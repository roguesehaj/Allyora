# Deploying Allyora to Vercel

This guide will walk you through deploying your Allyora application to Vercel.

## Prerequisites

1. A GitHub, GitLab, or Bitbucket account
2. Your code pushed to a repository
3. A Vercel account (sign up at [vercel.com](https://vercel.com))

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push Your Code to GitHub

1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub and push:
   ```bash
   git remote add origin https://github.com/yourusername/allyora.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project

### Step 3: Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

From your project directory:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No** (for first deployment)
- Project name? (Press Enter for default or enter custom name)
- Directory? (Press Enter for current directory)
- Override settings? **No**

### Step 4: Production Deployment

For production deployment:

```bash
vercel --prod
```

## Important Notes

### Environment Variables

If you need environment variables (for API keys, etc.):

1. Go to your project on Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add your variables
4. Redeploy

### Custom Domain

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### Build Configuration

The `vercel.json` file is already configured with:
- Correct build command
- Output directory
- SPA routing (all routes redirect to index.html)

### LocalStorage Considerations

⚠️ **Important**: Your app uses localStorage for data storage. This means:
- Data is stored in the user's browser
- Data is not synced across devices
- Data persists even after deployment

For production, consider:
- Migrating to a backend database (Supabase, Firebase, etc.)
- Adding user authentication
- Implementing cloud data sync

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (Vercel uses Node 18.x by default)

### Routes Not Working

The `vercel.json` includes SPA routing configuration. If routes still don't work:
- Verify `vercel.json` is in the root directory
- Check that rewrites are configured correctly

### Environment Variables Not Working

- Ensure variables are set in Vercel dashboard
- Redeploy after adding variables
- Check variable names match your code

## Post-Deployment

After deployment:

1. Test all routes
2. Verify localStorage functionality
3. Check mobile responsiveness
4. Test on different browsers
5. Monitor performance in Vercel dashboard

## Continuous Deployment

Vercel automatically deploys when you push to:
- `main` branch → Production
- Other branches → Preview deployments

Each push creates a new preview URL you can share for testing.

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel list
```

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html

