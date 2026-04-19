# EMS Blog Automation

This project now includes a local automation runner for weekly EMS blog publishing:

- Script: `scripts/ems-blog-automation.mjs`

## What it does
1. Reads the latest EMS blog post from `GET /api/blog/posts?limit=1`
2. Uses OpenAI to pick the next continuity-aware topic
3. Uses OpenAI to generate a 600-800 word HTML article
4. Attempts to generate an image
5. Publishes via `POST /api/blog/posts` with `BLOG_API_KEY`

## Required environment variables
Loaded from local secrets files if present:
- `BLOG_API_KEY`
- `OPENAI_API_KEY`

Optional:
- `EMS_BASE_URL` (defaults to `https://electricmotorsociety.com`)
- `EMS_BLOG_MODEL` (defaults to `gpt-4.1-mini`)
- `EMS_BLOG_IMAGE_MODEL` (defaults to `gpt-image-1`)

## Manual run
```bash
cd /Users/mikedropp/.openclaw/workspace/ems-website/electric-motor-society
node scripts/ems-blog-automation.mjs
```

## Suggested cron
Every Monday at 9:00 AM America/Chicago:
```cron
0 9 * * 1 cd /Users/mikedropp/.openclaw/workspace/ems-website/electric-motor-society && /usr/bin/node scripts/ems-blog-automation.mjs >> /tmp/ems-blog-automation.log 2>&1
```

## Important limitation
The EMS blog API currently accepts automated posting, but the underlying post storage in `server/api/blog.ts` is an in-memory array.

That means:
- automated posting works for the running process,
- but posts may not survive server restarts/redeploys unless blog persistence is upgraded.

So this automation runner is ready, but **true production-safe automation still needs persistent blog storage** (database, file-backed content committed to source, or CMS).
