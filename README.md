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

## Navigation Icons

The site supports both remote icons (direct URLs) and local cached icons (for faster loading).

### Icon Configuration

In `src/data/navigation.yml`, icons support two modes:

- **`icon-remote`**: Original remote icon URL
- **`icon-local`**: Cached local icon path (for faster loading)

The system **prioritizes `icon-local` over `icon-remote`**.

You can manually set `icon-local` with a local path like `assets/nav/icons/example-com.png`, or use the cache script to automatically populate both fields.

### Caching Remote Icons

Run the cache script to fetch remote icons and process them for local use:

```bash
npm run cache:nav-icons
```

This will:

1. Fetch favicons from all URLs in `navigation.yml`
2. Process icons (add white background to transparent icons, resize to 64x64)
3. Save them to `public/assets/nav/icons/`
4. Automatically update `navigation.yml`:
   - Migrate any existing remote `icon` to `icon-remote`
   - Set `icon-local` to the cached local path

**Note**: The old `icon` field is no longer used. Icons without any available favicon will not have `icon-local` or `icon-remote` set.
