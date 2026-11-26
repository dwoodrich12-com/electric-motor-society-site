import type { Request, Response } from "express";
import { getBlogPostBySlug } from "./api/blog.js";

type SpaSender = (
  res: Response,
  meta?: { title: string; description: string }
) => void;

/**
 * Direct `/blog/:slug` loads. Before the Chicago publish date this is a 404
 * with the normal site shell and no post title or description in the HTML.
 */
export function handleBlogPostPage(
  req: Request,
  res: Response,
  sendSpa: SpaSender
) {
  const slug = req.params.slug;
  const post = typeof slug === "string" ? getBlogPostBySlug(slug) : undefined;
  res.set("Cache-Control", "no-store");
  if (!post) {
    res.status(404);
    sendSpa(res);
    return;
  }
  sendSpa(res, {
    title: `${post.title} | Electric Motor Society`,
    description: post.excerpt,
  });
}
