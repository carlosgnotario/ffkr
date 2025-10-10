# Deploy to GitHub Pages

## Setup Instructions

### 1. Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `ffkr` (or your preferred name)
3. Make it public (required for free GitHub Pages)

### 2. Push Your Code
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/ffkr.git

# Push to main branch
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy when you push to main

### 4. Environment Variables (if needed)
If you need environment variables for the build:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add any required secrets (like `SANITY_TOKEN`)

## Build Commands

### Local Build Test
```bash
cd frontend
npm run build
```

### Manual Deployment
```bash
# Build the project
cd frontend
npm run build

# The build files will be in the `build` folder
# You can manually upload these to any static hosting service
```

## Repository Structure
```
ffkr/
├── frontend/           # Your SvelteKit app
│   ├── .github/        # GitHub Actions workflow
│   ├── build/         # Generated build files (after npm run build)
│   └── ...
└── studio/            # Sanity Studio
```

## URL Structure
- **Repository**: `https://github.com/YOUR_USERNAME/ffkr`
- **Live Site**: `https://YOUR_USERNAME.github.io/ffkr`

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `svelte.config.js` has correct base path
- Verify all imports are correct

### Pages Not Loading
- Check the base path in `svelte.config.js`
- Ensure all assets are properly referenced
- Check browser console for 404 errors

### API Calls Failing
- Verify your Sanity project ID and dataset
- Check CORS settings in Sanity
- Ensure API endpoints are working locally first
