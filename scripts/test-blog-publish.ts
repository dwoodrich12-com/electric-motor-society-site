/**
 * Publish-date gate for the blog.
 * A post stays out of the index API, the post API, the HTML post route, and
 * the sitemap until 00:00 America/Chicago on its date. The same post is public
 * once that instant has passed. Run: pnpm test:blog
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.env.BLOG_POSTS_PATH = path.join(root, "content", "blog-posts.json");
delete process.env.STRIPE_SECRET_KEY;

const { calendarDateInTimeZone, isBlogPostPublished } = await import(
  "../shared/blogPublish.ts"
);

function chicagoDate(iso: string) {
  return calendarDateInTimeZone(new Date(iso));
}

assert.equal(chicagoDate("2026-12-03T05:59:59.999Z"), "2026-12-02");
assert.equal(chicagoDate("2026-12-03T06:00:00.000Z"), "2026-12-03");
assert.equal(chicagoDate("2026-07-15T04:59:59.999Z"), "2026-07-14");
assert.equal(chicagoDate("2026-07-15T05:00:00.000Z"), "2026-07-15");

assert.equal(
  isBlogPostPublished("2026-12-03", new Date("2026-12-03T05:59:59.999Z")),
  false
);
assert.equal(
  isBlogPostPublished("2026-12-03", new Date("2026-12-03T06:00:00.000Z")),
  true
);
assert.equal(
  isBlogPostPublished("2026-07-15", new Date("2026-07-15T04:59:59.999Z")),
  false
);
assert.equal(
  isBlogPostPublished("2026-07-15", new Date("2026-07-15T05:00:00.000Z")),
  true
);
assert.equal(
  isBlogPostPublished("not-a-date", new Date("2026-12-03T06:00:00.000Z")),
  false
);

const scheduled = [
  {
    slug: "motor-safety-roundup-june-november",
    date: "2026-12-03",
    title: "Motor Safety Roundup: June–November 2026",
    urls: [
      "https://cdn-static.nidec-netherlands.nl/media/4358-engineering-documentatie-safe-torque-off-guide-en-iss6-0704-0000.pdf",
      "https://www.dguv.de/medien/ifa/en/pub/rep/pdf/reports2013/ifar0713e/safe_drive_controls.pdf",
      "https://www.ti.com/lit/wp/slyy080b/slyy080b.pdf",
      "https://www.ti.com/lit/wp/sprad98/sprad98.pdf",
      "https://www.extrica.com/article/24808",
      "https://ntrs.nasa.gov/api/citations/20210017188/downloads/1540_Boeing%20NASA:CR-20210017188_FINAL_013122.pdf",
      "https://www.faulhaber.com/en/know-how/tutorials/stepper-motor-tutorial-implementation-of-redundancy-in-a-miniature-stepper-motor/",
      "https://library.e.abb.com/public/6ecce91d66ee4088a3dc05283cd59d82/Redundant_Drive_with_DTC_and_Dual-Star_Synchronous_Machine.pdf",
      "https://ntrs.nasa.gov/api/citations/19870006901/downloads/19870006901.pdf",
      "https://www.cetjournal.it/cet/25/116/025.pdf",
    ],
  },
  {
    slug: "sto-is-the-floor",
    date: "2026-12-08",
    title: "STO is the floor, not the safety function",
    urls: [
      "https://cdn-static.nidec-netherlands.nl/media/4358-engineering-documentatie-safe-torque-off-guide-en-iss6-0704-0000.pdf",
      "https://www.cetjournal.it/cet/25/116/025.pdf",
      "https://www.ien.com/product-development/article/21319070/motor-drive-safe-torque-off-improves-equipment-safety",
    ],
  },
  {
    slug: "safe-encoders",
    date: "2026-12-17",
    title: "Do safe drive functions require safe encoders?",
    urls: [
      "https://www.dguv.de/medien/ifa/en/pub/rep/pdf/reports2013/ifar0713e/safe_drive_controls.pdf",
      "https://www.controleng.com/safety-certified-and-diverse-redundant-encoders-for-motion-control/",
      "https://www.kollmorgen.com/en-us/blogs/redundant-servo-feedback-when-fail-safe-positioning-must",
      "https://www.posital.com/media/posital_media/documents/TCR_Divers-Redundant_Encoder_WHITEPAPER_2021-04-23.pdf",
    ],
  },
  {
    slug: "safety-critical-markets",
    date: "2026-12-22",
    title: "Safety-critical markets set the numbers",
    urls: [
      "https://ntrs.nasa.gov/api/citations/20210017188/downloads/1540_Boeing%20NASA:CR-20210017188_FINAL_013122.pdf",
      "https://www.extrica.com/article/24808",
      "https://www.ti.com/lit/wp/sprad98/sprad98.pdf",
    ],
  },
] as const;

const store = JSON.parse(fs.readFileSync(process.env.BLOG_POSTS_PATH, "utf8"));
for (const spec of scheduled) {
  const post = store.posts.find(
    (item: { slug: string }) => item.slug === spec.slug
  );
  assert.ok(post, `missing ${spec.slug}`);
  assert.equal(post.date, spec.date);
  assert.equal(post.title, spec.title);
  assert.match(post.content, /href="\/members"/);
  assert.match(post.content, /href="\/subscribe"/);
  for (const url of spec.urls)
    assert.ok(post.content.includes(url), `${spec.slug} missing ${url}`);
  const blob = `${post.title}\n${post.excerpt}\n${post.content}`;
  assert.equal(/tesla/i.test(blob), false);
  assert.equal(blob.includes("(DRAFT)"), false);
  assert.equal(blob.includes("Proposed publish date"), false);
  assert.equal(blob.includes("Not approved"), false);
  assert.equal(blob.includes("/workspace/"), false);
}

const indexHtmlDir = path.join(root, "dist", "public");
fs.mkdirSync(indexHtmlDir, { recursive: true });
fs.writeFileSync(
  path.join(indexHtmlDir, "index.html"),
  `<!doctype html><html><head><title>Electric Motor Society</title><meta name="description" content="placeholder description" /></head><body><div id="root"></div></body></html>`
);

const port = await new Promise<number>((resolve, reject) => {
  const probe = net.createServer();
  probe.listen(0, "127.0.0.1", () => {
    const address = probe.address();
    const chosen = typeof address === "object" && address ? address.port : 0;
    probe.close(err => (err ? reject(err) : resolve(chosen)));
  });
});
process.env.PORT = String(port);

const { setBlogClockForTests } = await import("../server/api/blog.ts");
await import("../server/index.ts");

async function waitForServer() {
  const bases = [`http://127.0.0.1:${port}`, `http://localhost:${port}`];
  for (let attempt = 0; attempt < 50; attempt++) {
    for (const base of bases) {
      try {
        const res = await fetch(`${base}/robots.txt`);
        if (res.ok) return base;
      } catch {
        /* server still binding */
      }
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`server did not listen on ${port}`);
}

const base = await waitForServer();

async function get(pathname: string) {
  const res = await fetch(`${base}${pathname}`);
  const text = await res.text();
  return { status: res.status, cache: res.headers.get("cache-control"), text };
}

function slugsIn(payload: {
  posts?: { slug: string }[];
  urls?: { loc: string }[];
}) {
  if (payload.posts) return payload.posts.map(post => post.slug);
  return (payload.urls || []).map(url => url.loc);
}

const beforeAll = new Date("2026-11-26T18:00:00.000Z");
setBlogClockForTests(() => beforeAll);

const hiddenList = await get("/api/blog/posts");
assert.equal(hiddenList.status, 200);
assert.equal(hiddenList.cache, "no-store");
const hiddenPosts = JSON.parse(hiddenList.text) as {
  posts: { slug: string; content?: string }[];
};
assert.equal(hiddenPosts.posts.length, 14);
assert.equal(
  hiddenPosts.posts.some(post => post.slug === "welcome-to-ems"),
  true
);
for (const spec of scheduled) {
  assert.equal(
    hiddenPosts.posts.some(post => post.slug === spec.slug),
    false,
    spec.slug
  );
}
assert.equal(
  hiddenPosts.posts.some(post => post.slug === "rare-earth-exposure"),
  true
);
assert.equal("content" in (hiddenPosts.posts[0] || {}), false);

const missing = await get("/api/blog/posts/does-not-exist");
assert.equal(missing.status, 404);
assert.equal(missing.cache, "no-store");

for (const spec of scheduled) {
  const opens = `${spec.date}T06:00:00.000Z`;
  const stillHidden = new Date(Date.parse(opens) - 1);
  setBlogClockForTests(() => stillHidden);

  const apiHidden = await get(`/api/blog/posts/${spec.slug}`);
  assert.equal(
    apiHidden.status,
    404,
    `${spec.slug} API before Chicago midnight`
  );
  assert.equal(apiHidden.text, missing.text);
  assert.equal(apiHidden.text.includes(spec.title), false);

  const pageHidden = await get(`/blog/${spec.slug}`);
  assert.equal(
    pageHidden.status,
    404,
    `${spec.slug} page before Chicago midnight`
  );
  assert.equal(pageHidden.cache, "no-store");
  assert.equal(pageHidden.text.includes(spec.title), false);
  assert.equal(
    pageHidden.text.includes("<title>Electric Motor Society</title>"),
    true
  );

  const mapHidden = await get("/api/blog/sitemap");
  assert.equal(mapHidden.status, 200);
  assert.equal(mapHidden.cache, "no-store");
  assert.equal(
    slugsIn(JSON.parse(mapHidden.text)).some(loc =>
      loc.endsWith(`/${spec.slug}`)
    ),
    false
  );

  const xmlHidden = await get("/sitemap.xml");
  assert.equal(xmlHidden.status, 200);
  assert.equal(xmlHidden.cache, "no-store");
  assert.equal(xmlHidden.text.includes(`/blog/${spec.slug}`), false);

  setBlogClockForTests(() => new Date(opens));

  const apiLive = await get(`/api/blog/posts/${spec.slug}`);
  assert.equal(apiLive.status, 200, `${spec.slug} API at Chicago midnight`);
  assert.equal(apiLive.cache, "no-store");
  const live = JSON.parse(apiLive.text) as {
    post: { title: string; content: string; date: string };
  };
  assert.equal(live.post.title, spec.title);
  assert.equal(live.post.date, spec.date);
  assert.match(live.post.content, /href="\/members"/);
  assert.match(live.post.content, /href="\/subscribe"/);

  const pageLive = await get(`/blog/${spec.slug}`);
  assert.equal(pageLive.status, 200, `${spec.slug} page at Chicago midnight`);
  assert.equal(pageLive.cache, "no-store");
  assert.equal(
    pageLive.text.includes(
      `<title>${spec.title} | Electric Motor Society</title>`
    ),
    true
  );

  const listed = JSON.parse((await get("/api/blog/posts")).text) as {
    posts: { slug: string }[];
  };
  assert.equal(
    listed.posts.some(post => post.slug === spec.slug),
    true
  );

  const xmlLive = await get("/sitemap.xml");
  assert.equal(xmlLive.text.includes(`/blog/${spec.slug}`), true);

  console.log(
    `${spec.slug}: hidden at ${stillHidden.toISOString()}, public at ${opens} (Chicago midnight)`
  );
}

setBlogClockForTests(() => new Date("2026-11-24T05:59:59.999Z"));
assert.equal((await get("/api/blog/posts/rare-earth-exposure")).status, 404);
setBlogClockForTests(() => new Date("2026-11-24T06:00:00.000Z"));
const rareEarth = await get("/api/blog/posts/rare-earth-exposure");
assert.equal(rareEarth.status, 200);
assert.equal(
  (JSON.parse(rareEarth.text) as { post: { date: string } }).post.date,
  "2026-11-24"
);

setBlogClockForTests(() => new Date("2026-12-22T06:00:00.000Z"));
const allLive = JSON.parse((await get("/api/blog/posts")).text) as {
  posts: { slug: string }[];
};
assert.equal(allLive.posts.length, 18);

console.log(`blog publish gate ok (${base})`);
process.exit(0);
