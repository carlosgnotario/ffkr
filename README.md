# Sanity + SvelteKit Project

A modern headless CMS setup with Sanity Studio and SvelteKit frontend, featuring SCSS support and unified development workflow.

## Project Structure

```
├── studio/          # Sanity Studio (CMS)
├── frontend/        # SvelteKit frontend
├── package.json     # Root package with unified commands
└── README.md
```

## Features

- 🚀 **Sanity Studio** - Headless CMS with real-time collaboration
- ⚡ **SvelteKit** - Fast, modern web framework
- 🎨 **SCSS Support** - Enhanced styling with preprocessing
- 🔄 **Browser Reloading** - Hot reload for development
- 🚀 **Unified Start** - Single command to run everything

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start both Studio and Frontend:**
   ```bash
   npm start
   ```

   This will:
   - Start Sanity Studio at `http://localhost:3333`
   - Start SvelteKit frontend at `http://localhost:5173` (auto-opens in browser)

3. **Add Sample Data:**
   - Open Sanity Studio at `http://localhost:3333`
   - Create an Author (name: "John Doe", email: "john@example.com")
   - Create a Category (title: "Web Development", color: "blue")
   - Create a Post with:
     - Title and content
     - Author and category references
     - **Featured Image** (upload an image and add alt text)
     - Mark as "Featured" to see it on the homepage

## Available Scripts

- `npm start` - Run both Studio and Frontend concurrently
- `npm run studio` - Run only Sanity Studio
- `npm run frontend` - Run only SvelteKit frontend
- `npm run build` - Build both Studio and Frontend for production
- `npm run install:all` - Install dependencies for all projects

## Development

### Sanity Studio
- Located in `/studio`
- Access at `http://localhost:3333`
- Configure your schemas in `/studio/schemaTypes`
- **Available Content Types:**
  - **Posts** - Blog posts with rich content, categories, tags, and featured images
  - **Authors** - Content authors with bio, social links, and profile images
  - **Categories** - Content categorization with color coding
- **Image Features:**
  - Optimized image delivery with Sanity's CDN
  - Automatic image resizing and format optimization
  - Alt text support for accessibility
  - Lazy loading for better performance

### SvelteKit Frontend
- Located in `/frontend`
- Access at `http://localhost:5173`
- SCSS files in `/frontend/src/lib/styles/`
- Pages in `/frontend/src/routes/`

## Configuration

### Sanity Configuration
- Project ID: `80je9ukv`
- Organization ID: `o8IF1dyTU`
- Dataset: `production`

### SCSS Support
SCSS is pre-configured and ready to use:
- Global styles: `frontend/src/lib/styles/global.scss`
- Component styles: Use `<style lang="scss">` in Svelte components

## Production Deployment

1. Build both projects:
   ```bash
   npm run build
   ```

2. Deploy the built files from `/studio/dist` and `/frontend/build` directories.

## Troubleshooting

- If ports are in use, modify the port configuration in respective `package.json` files
- For SCSS issues, ensure `sass` is installed in the frontend directory
- Check that all dependencies are installed with `npm run install:all`
