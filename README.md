# Willbon Atlas

An Astro-powered personal site that combines a polished blog with a curated navigation hub.

## Stack

- Astro
- Markdown / MDX
- KaTeX for LaTeX math
- Mermaid for diagrams and mindmaps
- YAML navigation data
- GitHub Pages deployment

## Development

```bash
npm install
npm run dev
```

## Content

- Blog posts: `src/content/blog/`
- Navigation data: `src/data/navigation.yml`
- Site branding and repo settings: `src/config/site.ts`

## Build

```bash
npm run validate:content
npm run build
```
