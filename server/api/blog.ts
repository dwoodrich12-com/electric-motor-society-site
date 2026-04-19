import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Blog posts file path - content folder is copied to dist during build
const BLOG_POSTS_PATH = process.env.BLOG_POSTS_PATH || 
  path.resolve(__dirname, 'content/blog-posts.json');

// Blog API key for automated posting
const BLOG_API_KEY = process.env.BLOG_API_KEY || '';

// Type definition
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  featured: boolean;
  image: string;
  imageAlt: string;
  keywords: string[];
  content: string;
}

// Load posts from file
function loadPosts(): BlogPost[] {
  try {
    if (fs.existsSync(BLOG_POSTS_PATH)) {
      const data = fs.readFileSync(BLOG_POSTS_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.posts || [];
    }
  } catch (err) {
    console.error('[BLOG] Error loading posts:', err);
  }
  return [];
}

// Save posts to file
function savePosts(posts: BlogPost[]): boolean {
  try {
    const dir = path.dirname(BLOG_POSTS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BLOG_POSTS_PATH, JSON.stringify({ posts }, null, 2));
    console.log(`[BLOG] Saved ${posts.length} posts to ${BLOG_POSTS_PATH}`);
    return true;
  } catch (err) {
    console.error('[BLOG] Error saving posts:', err);
    return false;
  }
}

// In-memory cache, loaded from file on startup
let blogPosts: BlogPost[] = loadPosts();
console.log(`[BLOG] Loaded ${blogPosts.length} posts from file`);

// Get all posts (for listing)
router.get('/posts', (req: Request, res: Response) => {
  const category = req.query.category as string;
  const featured = req.query.featured === 'true';
  const limit = parseInt(req.query.limit as string) || undefined;

  let filtered = [...blogPosts];

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (featured) {
    filtered = filtered.filter(p => p.featured);
  }

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  // Return without full content for listing
  const posts = filtered.map(({ content, ...rest }) => rest);

  res.json({ posts });
});

// Get single post (full content)
router.get('/posts/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json({ post });
});

// Get categories
router.get('/categories', (req: Request, res: Response) => {
  const categories = [...new Set(blogPosts.map(p => p.category))];
  res.json({ categories });
});

// Generate sitemap data for blog posts
router.get('/sitemap', (req: Request, res: Response) => {
  const baseUrl = 'https://electricmotorsociety.com';
  const urls = blogPosts.map(post => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: post.featured ? 0.8 : 0.6
  }));

  res.json({ urls });
});

// Create new blog post (authenticated)
router.post('/posts', (req: Request, res: Response) => {
  // Check authorization
  const authHeader = req.headers.authorization;
  if (!BLOG_API_KEY || !authHeader || authHeader !== `Bearer ${BLOG_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, slug, excerpt, content, category, keywords, image, imageAlt, featured } = req.body;

  // Validate required fields
  if (!title || !slug || !excerpt || !content || !category) {
    return res.status(400).json({ error: 'Missing required fields: title, slug, excerpt, content, category' });
  }

  // Check for duplicate slug
  if (blogPosts.find(p => p.slug === slug)) {
    return res.status(409).json({ error: 'Post with this slug already exists' });
  }

  // Create new post
  const newPost: BlogPost = {
    slug,
    title,
    excerpt,
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    author: 'Electric Motor Society',
    category,
    featured: featured || false,
    image: image || '/assets/ems-logo.webp',
    imageAlt: imageAlt || title,
    keywords: keywords || [],
    content
  };

  // Add to beginning of array (newest first)
  blogPosts.unshift(newPost);

  // Save to file
  if (!savePosts(blogPosts)) {
    return res.status(500).json({ error: 'Failed to save post to file' });
  }

  console.log(`[BLOG] New post created: ${title}`);

  res.status(201).json({ 
    success: true, 
    message: 'Post created',
    post: { ...newPost, content: undefined } // Return without content
  });
});

// Update existing blog post (authenticated)
router.put('/posts/:slug', (req: Request, res: Response) => {
  // Check authorization
  const authHeader = req.headers.authorization;
  if (!BLOG_API_KEY || !authHeader || authHeader !== `Bearer ${BLOG_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { slug } = req.params;
  const postIndex = blogPosts.findIndex(p => p.slug === slug);

  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const { title, excerpt, content, category, keywords, image, imageAlt, featured } = req.body;

  // Update fields
  if (title) blogPosts[postIndex].title = title;
  if (excerpt) blogPosts[postIndex].excerpt = excerpt;
  if (content) blogPosts[postIndex].content = content;
  if (category) blogPosts[postIndex].category = category;
  if (keywords) blogPosts[postIndex].keywords = keywords;
  if (image) blogPosts[postIndex].image = image;
  if (imageAlt) blogPosts[postIndex].imageAlt = imageAlt;
  if (featured !== undefined) blogPosts[postIndex].featured = featured;

  // Save to file
  if (!savePosts(blogPosts)) {
    return res.status(500).json({ error: 'Failed to save post to file' });
  }

  console.log(`[BLOG] Post updated: ${slug}`);

  res.json({ 
    success: true, 
    message: 'Post updated',
    post: { ...blogPosts[postIndex], content: undefined }
  });
});

// Delete blog post (authenticated)
router.delete('/posts/:slug', (req: Request, res: Response) => {
  // Check authorization
  const authHeader = req.headers.authorization;
  if (!BLOG_API_KEY || !authHeader || authHeader !== `Bearer ${BLOG_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { slug } = req.params;
  const postIndex = blogPosts.findIndex(p => p.slug === slug);

  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const deleted = blogPosts.splice(postIndex, 1)[0];

  // Save to file
  if (!savePosts(blogPosts)) {
    return res.status(500).json({ error: 'Failed to save changes to file' });
  }

  console.log(`[BLOG] Post deleted: ${slug}`);

  res.json({ 
    success: true, 
    message: 'Post deleted',
    post: { ...deleted, content: undefined }
  });
});

// Reload posts from file (authenticated) - useful after manual edits
router.post('/reload', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!BLOG_API_KEY || !authHeader || authHeader !== `Bearer ${BLOG_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  blogPosts = loadPosts();
  console.log(`[BLOG] Reloaded ${blogPosts.length} posts from file`);

  res.json({ 
    success: true, 
    message: `Reloaded ${blogPosts.length} posts`,
    count: blogPosts.length
  });
});

export default router;
