import { getCollection, render } from "astro:content";

export async function getPublishedPosts() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((left, right) => right.data.date.getTime() - left.data.date.getTime());
}

export async function renderPost(entry: Awaited<ReturnType<typeof getPublishedPosts>>[number]) {
  return render(entry);
}

export function collectTags(posts: Awaited<ReturnType<typeof getPublishedPosts>>) {
  return Array.from(new Set(posts.flatMap((post) => post.data.tags))).sort((a, b) =>
    a.localeCompare(b, "zh-CN")
  );
}

export function getPostSlug(id: string) {
  return id.replace(/\.(md|mdx)$/i, "");
}

