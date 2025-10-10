# Frontend Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Vercel auto-detects SvelteKit
5. Deploy!

### 2. Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/.svelte-kit/output/client`

### 3. GitHub Pages (Free)
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Enable GitHub Actions
4. The workflow will auto-deploy on push to main

### 4. Manual Deploy
```bash
cd frontend
npm run build
# Upload the 'build' folder to your hosting provider
```

## Your URLs
- **Sanity Studio**: https://ffkr.sanity.studio/
- **Frontend**: Will be provided by your hosting platform
- **API**: https://80je9ukv.api.sanity.io/v2024-01-01/data/query/production
