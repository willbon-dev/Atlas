import rss from "@astrojs/rss";
import { getPostSlug, getPublishedPosts } from "../lib/posts";
import { siteConfig, siteUrl } from "../config/site";

export async function GET() {
  const posts = await getPublishedPosts();
  return rss({
    title: siteConfig.siteName,
    description: siteConfig.siteDescription,
    site: siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `${siteConfig.basePath}/blog/${getPostSlug(post.id)}/`
    }))
  });
}

