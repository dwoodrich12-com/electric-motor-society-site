import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import formsRouter from "./api/forms.js";
import stripeRouter from "./api/stripe.js";
import mailchimpRouter from "./api/mailchimp.js";
import blogRouter from "./api/blog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
