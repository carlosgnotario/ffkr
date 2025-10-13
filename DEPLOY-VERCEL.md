# Deploying to Vercel

This guide will help you deploy the FFKR project to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 20.x or later

## Project Structure

This is a monorepo containing:
- `frontend/` - SvelteKit application
- `studio/` - Sanity Studio (if needed, deploy separately)

## Step 1: Prepare Your Repository

1. Commit all your changes:
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   ```

2. Push to your Git repository:
   ```bash
   git push origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the project root:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N** (first time)
   - What's your project's name? **ffkr** (or your preferred name)
   - In which directory is your code located? **frontend**

5. For production deployment:
   ```bash
   vercel --prod
   ```

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)

2. Import your Git repository

3. Configure the project:
   - **Framework Preset**: SvelteKit
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave default (`.vercel/output`)
   - **Install Command**: `npm install`

4. Add environment variables (if needed):
   - `PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
   - `PUBLIC_SANITY_DATASET` - Your Sanity dataset (usually 'production')
   - Any other environment variables from your `.env` file

5. Click **Deploy**

## Step 3: Environment Variables

If your project uses environment variables, add them in Vercel:

1. Go to your project settings in Vercel Dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variables (check `frontend/env-example.txt` for reference):
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_SANITY_DATASET`
   - Any other required variables

4. Redeploy to apply the changes:
   ```bash
   vercel --prod
   ```

## Step 4: Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** > **Domains**
3. Add your custom domain
4. Follow the DNS configuration instructions

## Configuration Files

The following files have been configured for Vercel deployment:

- `vercel.json` - Root-level Vercel configuration for monorepo
- `frontend/vercel.json` - Frontend-specific configuration
- `frontend/svelte.config.js` - Updated to use `@sveltejs/adapter-vercel`

## API Routes

Your SvelteKit API routes in `frontend/src/routes/api/` will automatically be deployed as Vercel Serverless Functions.

## Troubleshooting

### Build Fails

- Check that all dependencies are installed: `cd frontend && npm install`
- Test the build locally: `cd frontend && npm run build`
- Check Vercel build logs for specific errors

### Environment Variables Not Working

- Ensure variables are prefixed with `PUBLIC_` for client-side access
- Redeploy after adding/changing environment variables

### API Routes Not Working

- Verify that your API routes are in `frontend/src/routes/api/`
- Check that the Vercel adapter is properly configured
- Review function logs in Vercel Dashboard

### Base Path Issues

The base path has been removed from the Vercel configuration. If you need a custom base path:
1. Uncomment the `paths` section in `frontend/svelte.config.js`
2. Set the `BASE_PATH` environment variable in Vercel

## Deploying Sanity Studio Separately (Optional)

If you want to deploy the Sanity Studio to Vercel as well:

1. Create a new Vercel project for the studio
2. Set **Root Directory** to `studio`
3. Sanity Studio can be deployed as a static site or you can use Sanity's hosted studio

Alternatively, you can deploy Sanity Studio using Sanity's hosting:
```bash
cd studio
npm run deploy
```

## Continuous Deployment

Vercel automatically sets up continuous deployment:
- Every push to your main branch triggers a production deployment
- Pull requests get automatic preview deployments

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [SvelteKit on Vercel](https://vercel.com/docs/frameworks/sveltekit)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

## Notes

- The adapter has been changed from `adapter-static` to `adapter-vercel` for better serverless function support
- The `/ffkr` base path has been removed (configure if needed)
- Node.js runtime is set to 20.x
- Region is set to `iad1` (US East) - change in `svelte.config.js` if needed

---

For any issues, check the Vercel deployment logs or consult the [Vercel Support](https://vercel.com/support).

