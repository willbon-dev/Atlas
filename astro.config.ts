import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { siteConfig, siteUrl } from "./src/config/site";
import rehypeCallouts from "./src/lib/rehype-callouts.mjs";
import rehypeLazyImages from "./src/lib/rehype-lazy-images.mjs";

export default defineConfig({
  site: siteUrl,
  base: siteConfig.basePath,
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
      wrap: true
    },
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor"],
            ariaLabel: "Anchor"
          },
          content: {
            type: "text",
            value: "#"
          }
        }
      ],
      rehypeKatex,
      rehypeCallouts,
      [rehypeLazyImages, { basePath: siteConfig.basePath }]
    ]
  }
});
