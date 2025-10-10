# Netlify Deployment Guide

## Quick Deploy to Netlify

### Method 1: Drag & Drop (Fastest)
1. Run `npm run build` in the frontend directory
2. Go to [netlify.com](https://netlify.com)
3. Sign up/login
4. Drag the `build` folder to the deploy area
5. Your site is live! 🎉

### Method 2: Git Integration (Recommended)
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Build settings:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/build`
6. Deploy!

### Method 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=build
```

## Your Site URLs
- **Live Site**: https://your-site-name.netlify.app
- **Sanity Studio**: https://ffkr.sanity.studio/
- **API**: https://80je9ukv.api.sanity.io/v2024-01-01/data/query/production

## Features You Get
- ✅ Automatic deployments on Git push
- ✅ Custom domain support
- ✅ HTTPS by default
- ✅ Global CDN
- ✅ Form handling
- ✅ Serverless functions
- ✅ Branch previews
- ✅ Rollback capability
