import express from "express";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import formsRouter from "./api/forms.js";
import stripeRouter, { stripeWebhookHandler } from "./api/stripe.js";
import mailchimpRouter from "./api/mailchimp.js";
import blogRouter, { getBlogPostBySlug } from "./api/blog.js";
import {
  SUBSCRIBE_PAGE_DESCRIPTION,
  SUBSCRIBE_PAGE_TITLE,
} from "../shared/subscribePage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Stripe signs the raw body. This route must run before express.json().
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    (req, res) => {
      void stripeWebhookHandler(req, res);
    }
  );

  // Middleware
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // API Routes
  app.use("/api/forms", formsRouter);
  app.use("/api/stripe", stripeRouter);
  app.use("/api/mailchimp", mailchimpRouter);
  app.use("/api/blog", blogRouter);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Sitemap.xml
  app.get("/sitemap.xml", async (_req, res) => {
    const baseUrl = "https://electricmotorsociety.com";
    
    // Static pages
    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/sponsors", priority: "0.8", changefreq: "monthly" },
      { loc: "/members", priority: "0.8", changefreq: "monthly" },
      { loc: "/universities", priority: "0.7", changefreq: "monthly" },
      { loc: "/motor-quote", priority: "0.7", changefreq: "monthly" },
      { loc: "/join", priority: "0.8", changefreq: "monthly" },
      { loc: "/blog", priority: "0.9", changefreq: "weekly" },
      { loc: "/subscribe", priority: "0.6", changefreq: "monthly" },
      { loc: "/rare-earth-checklist", priority: "0.8", changefreq: "monthly" },
    ];

    // Fetch blog posts for dynamic URLs
    let blogUrls: { loc: string; lastmod: string; priority: string; changefreq: string }[] = [];
    try {
      const blogRes = await fetch(`http://localhost:${process.env.PORT || 3000}/api/blog/sitemap`);
      const blogData = await blogRes.json();
      blogUrls = blogData.urls.map((u: any) => ({
        loc: u.loc.replace(baseUrl, ""),
        lastmod: u.lastmod,
        priority: String(u.priority),
        changefreq: u.changefreq,
      }));
    } catch (err) {
      console.error("Failed to fetch blog sitemap:", err);
    }

    const allUrls = [...staticPages, ...blogUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  // robots.txt
  app.get("/robots.txt", (_req, res) => {
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://electricmotorsociety.com/sitemap.xml
`;
    res.header("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const sendSpa = (
    res: express.Response,
    meta?: { title: string; description: string }
  ) => {
    const indexPath = path.join(staticPath, "index.html");
    if (!meta) {
      res.sendFile(indexPath);
      return;
    }

    const html = fs
      .readFileSync(indexPath, "utf8")
      .replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(meta.title)}</title>`)
      .replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
        () => `<meta name="description" content="${escapeHtml(meta.description)}" />`
      );
    res.status(200).type("html").send(html);
  };

  // Direct loads: serve the SPA shell with the page title and description already set.
  app.get("/subscribe", (_req, res) => {
    sendSpa(res, {
      title: SUBSCRIBE_PAGE_TITLE,
      description: SUBSCRIBE_PAGE_DESCRIPTION,
    });
  });

  app.get("/blog", (_req, res) => {
    sendSpa(res, {
      title: "Electric Motor Blog | Electric Motor Society",
      description:
        "Insights, technical articles, and industry news about electric motor technology, innovation, and best practices from the Electric Motor Society.",
    });
  });

  app.get("/blog/:slug", (req, res) => {
    const slug = req.params.slug;
    const post = typeof slug === "string" ? getBlogPostBySlug(slug) : undefined;
    if (!post) {
      sendSpa(res);
      return;
    }
    sendSpa(res, {
      title: `${post.title} | Electric Motor Society`,
      description: post.excerpt,
    });
  });

  // Handle client-side routing - serve index.html for all other routes
  app.get("*", (_req, res) => {
    sendSpa(res);
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
