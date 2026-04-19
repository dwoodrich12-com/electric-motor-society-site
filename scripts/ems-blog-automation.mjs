#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DEFAULT_SECRETS = [
  '/Users/mikedropp/.openclaw/workspace/config/secrets.env',
  '/Users/mikedropp/.openclaw/workspace-hermes/config/secrets.env',
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

for (const file of DEFAULT_SECRETS) loadEnvFile(file);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BLOG_API_KEY = process.env.BLOG_API_KEY || process.env.EMS_BLOG_API_KEY;
const EMS_BASE_URL = process.env.EMS_BASE_URL || 'https://electricmotorsociety.com';
const OPENAI_MODEL = process.env.EMS_BLOG_MODEL || 'gpt-4.1-mini';
const OPENAI_IMAGE_MODEL = process.env.EMS_BLOG_IMAGE_MODEL || 'gpt-image-1';
const DEFAULT_AUTHOR = 'Electric Motor Society';
const CATEGORY_ROTATION = ['Technology', 'Efficiency', 'Industry', 'Research', 'Applications', 'Maintenance'];
const THREAD_SEEDS = {
  'Motor Sizing & Selection': [
    'What is motor sizing?',
    'NEMA motor sizing standards',
    'IEC motor frame sizes',
    'Calculating torque requirements',
    'Service factor explained',
    'Duty cycle considerations'
  ],
  'Motor Efficiency': [
    'Motor efficiency classes (IE1-IE4)',
    'Premium efficiency motors',
    'Variable frequency drives and efficiency',
    'Energy cost calculations',
    'Efficiency regulations worldwide'
  ],
  'Motor Types': [
    'AC induction motors explained',
    'Synchronous motors',
    'Permanent magnet motors',
    'Switched reluctance motors',
    'Stepper vs servo motors'
  ],
  'Applications': [
    'Motors in HVAC systems',
    'EV traction motors',
    'Industrial pump applications',
    'Conveyor and material handling',
    'Robotics and automation'
  ],
  'Maintenance & Troubleshooting': [
    'Motor maintenance schedules',
    'Bearing failure signs',
    'Insulation testing',
    'Vibration analysis',
    'Thermal imaging for motors'
  ],
  'Emerging Technology': [
    'Axial flux motors',
    'Rare earth alternatives',
    'Integrated motor-drives',
    'Motor control advances',
    'AI in motor diagnostics'
  ]
};

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function pickFallbackImage(category) {
  const map = {
    Technology: '/assets/blog/brushless-dc-motor-bldc-technology-guide.webp',
    Efficiency: '/assets/blog/ecm-motor-efficiency-variable-speed-control-hvac.webp',
    Industry: '/assets/blog/electric-motor-industry-trends-2026-market-growth.webp',
    Research: '/assets/blog/electric-motor-research-priorities-university-collaboration.webp',
    Applications: '/assets/blog/electric-motor-industry-trends-2026-market-growth.webp',
    Maintenance: '/assets/blog/professional-motor-association-career-benefits-networking.webp',
    Membership: '/assets/blog/professional-motor-association-career-benefits-networking.webp',
    News: '/assets/blog/electric-motor-society-professional-membership-organization.webp'
  };
  return map[category] || '/assets/blog/electric-motor-industry-trends-2026-market-growth.webp';
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${JSON.stringify(data).slice(0, 500)}`);
  }
  return data;
}

async function getLatestPost() {
  const data = await fetchJson(`${EMS_BASE_URL}/api/blog/posts?limit=1`);
  return data.posts?.[0] || null;
}

async function callResponsesAPI(prompt, inputType = 'text') {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
  const body = {
    model: OPENAI_MODEL,
    input: prompt,
    text: { format: { type: 'json_schema', name: 'blog_payload', schema: inputType === 'topic' ? {
      type: 'object',
      additionalProperties: false,
      properties: {
        title: { type: 'string' },
        category: { type: 'string' },
        thread: { type: 'string' },
        keywords: { type: 'array', items: { type: 'string' } },
        excerpt: { type: 'string' },
        imageAlt: { type: 'string' }
      },
      required: ['title', 'category', 'thread', 'keywords', 'excerpt', 'imageAlt']
    } : {
      type: 'object',
      additionalProperties: false,
      properties: {
        contentHtml: { type: 'string' }
      },
      required: ['contentHtml']
    } } }
  };
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`OpenAI error: ${JSON.stringify(json).slice(0, 800)}`);
  const text = json.output_text
    || json.output?.flatMap((item) => item.content || [])?.find((c) => c.text)?.text
    || json.output?.find((item) => item.type === 'message')?.content?.find((c) => c.type === 'output_text')?.text;
  if (!text) throw new Error(`No parseable text in Responses API payload: ${JSON.stringify(json).slice(0, 1200)}`);
  return JSON.parse(text);
}

async function maybeGenerateImage(title) {
  if (!OPENAI_API_KEY) return null;
  try {
    const prompt = `Professional technical illustration for an Electric Motor Society blog article titled "${title}". Clean modern editorial style, electric motor industry theme, technical but accessible, 16:9, no visible text.`;
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: OPENAI_IMAGE_MODEL,
        prompt,
        size: '1536x1024'
      })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(json).slice(0, 500));
    const imageBase64 = json?.data?.[0]?.b64_json;
    if (!imageBase64) return null;
    return `data:image/png;base64,${imageBase64}`;
  } catch (err) {
    console.warn('[ems-blog] image generation failed, using fallback image:', err.message);
    return null;
  }
}

function buildTopicPrompt(lastPost) {
  const seedText = Object.entries(THREAD_SEEDS)
    .map(([thread, items]) => `- ${thread}: ${items.join('; ')}`)
    .join('\n');
  return `You are the editorial planner for the Electric Motor Society blog.\n\nGoal: choose the next weekly blog post topic.\nRules:\n- Always electric-motor related.\n- 70% of the time continue naturally from the previous article.\n- 30% of the time start a fresh thread if the previous thread feels exhausted.\n- Keep it practical, technical, and credible.\n- Pick one category from: ${CATEGORY_ROTATION.join(', ')}.\n- Avoid spammy SEO titles.\n- Output concise, publication-ready metadata.\n\nExisting thread seeds:\n${seedText}\n\nLatest post context:\n${lastPost ? JSON.stringify({ title: lastPost.title, category: lastPost.category, excerpt: lastPost.excerpt }, null, 2) : 'No prior post found; start a strong first editorial thread.'}`;
}

function buildArticlePrompt(topic, lastPost) {
  return `Write a 600-800 word Electric Motor Society blog article as clean HTML only.\n\nTopic:\n${JSON.stringify(topic, null, 2)}\n\nPrevious post context (for continuity):\n${lastPost ? JSON.stringify({ title: lastPost.title, category: lastPost.category }, null, 2) : 'None'}\n\nRequirements:\n- Use semantic HTML fragments only: <h2>, <h3>, <p>, <ul>, <li>.\n- No <html>, <body>, or markdown fences.\n- Professional, technically credible tone.\n- Avoid hype and unsupported claims.\n- Include a short intro, 3-5 useful sections, and a conclusion.\n- Mention Electric Motor Society naturally once or twice at most.\n- Do not invent statistics unless clearly framed as directional or general.\n- Keep paragraphs readable on the web.`;
}

async function main() {
  if (!BLOG_API_KEY) throw new Error('BLOG_API_KEY missing');
  const lastPost = await getLatestPost();
  console.log('[ems-blog] latest post:', lastPost?.title || '(none)');

  const topic = await callResponsesAPI(buildTopicPrompt(lastPost), 'topic');
  topic.category = CATEGORY_ROTATION.includes(topic.category) ? topic.category : 'Technology';

  const article = await callResponsesAPI(buildArticlePrompt(topic, lastPost), 'article');
  const slug = slugify(topic.title);
  await maybeGenerateImage(topic.title);

  const payload = {
    title: topic.title,
    slug,
    excerpt: topic.excerpt,
    content: article.contentHtml,
    category: topic.category,
    keywords: topic.keywords,
    image: pickFallbackImage(topic.category),
    imageAlt: topic.imageAlt,
    featured: false,
    author: DEFAULT_AUTHOR
  };

  const store = readCanonicalBlogFile();
  const posts = Array.isArray(store.posts) ? store.posts : [];
  if (posts.find((p) => p.slug === slug)) {
    throw new Error(`Slug already exists in content/blog-posts.json: ${slug}`);
  }
  posts.unshift({
    ...payload,
    date: new Date().toISOString().split('T')[0]
  });
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  writeCanonicalBlogFile(posts);

  console.log('[ems-blog] wrote canonical blog file:', JSON.stringify({
    title: payload.title,
    slug,
    category: payload.category,
    path: BLOG_CONTENT_PATH
  }, null, 2));
  console.log('[ems-blog] next step: commit/push repo so Render redeploys with the new content');
}

main().catch((err) => {
  console.error('[ems-blog] failed:', err.message);
  process.exit(1);
});
st result = await fetchJson(`${EMS_BASE_URL}/api/blog/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BLOG_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  console.log('[ems-blog] success:', JSON.stringify({ title: payload.title, slug, category: payload.category, api: result.message || 'ok' }, null, 2));
}

main().catch((err) => {
  console.error('[ems-blog] failed:', err.message);
  process.exit(1);
});
