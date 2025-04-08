# Vercel Deployment Guide

This guide provides detailed instructions for deploying the Medical Assistant project on Vercel. As a full-stack application with both frontend and backend components, we need a specific configuration for proper deployment.

## Issue with Direct Deployment

If you're seeing server code displayed in the browser (like the screenshot showing server/index.ts), this is because Vercel is not properly distinguishing between your frontend and backend code.

## Solution: Project Configuration

### Step 1: Create a vercel.json file

Create a `vercel.json` file in the root of your project with the following content:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "dist/$1",
      "continue": true
    },
    {
      "src": "/(.*)",
      "dest": "dist/index.html"
    }
  ]
}
```

This configuration tells Vercel to:
1. Build the server using the Node.js builder
2. Build the client using the static build command in package.json
3. Route API requests to the server
4. Serve static files from the dist directory
5. Serve index.html for routes that don't match static files (for React routing)

### Step 2: Clone to a New GitHub Repository

1. Create a new GitHub repository
2. Push your code to this repository:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/medical-assistant.git
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the build settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Root Directory**: `./` (default)

5. Add Environment Variables:
   - `GROQ_API_KEY` = your_groq_api_key
   - `ELEVEN_LABS_API_KEY` = your_eleven_labs_api_key
   - `PERPLEXITY_API_KEY` = (Optional) your_perplexity_api_key for enhanced search capabilities
   - `ALLOWED_ORIGINS` = (Optional) Comma-separated list of domains that can access your API, e.g., `https://yourdomain.com,https://app.yourdomain.com`

6. Click "Deploy"

### Step 4: Alternative Deployment Method (Vercel CLI)

If the dashboard deployment doesn't work, try using the Vercel CLI:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy directly from your local directory:
```bash
vercel
```

4. Follow the prompts and ensure you set the environment variables when asked.

## Troubleshooting

### Server Code Showing Instead of Frontend

If you still see server code in the browser:

1. Make sure your `vercel.json` file is properly formatted and in the root directory
2. Check that the build commands are completing successfully (check build logs)
3. Verify the routes are correctly configured in `vercel.json`
4. Check your environment variables are properly set

### API Errors

If the frontend loads but API calls fail:

1. Check that your API routes are correctly prefixed with `/api/`
2. Ensure your server is properly handling CORS
3. Verify the environment variables are accessible to the server

### Debugging Deploy Issues

You can use the Vercel CLI to get more detailed logs:

```bash
# List all deployments
vercel ls

# Get logs from your latest deployment
vercel logs your-project-name

# Get build logs specifically
vercel logs your-project-name --scope=build
```

## Advanced Configuration

### Custom Domain Setup

Once your app is successfully deployed:

1. Go to your project settings in Vercel dashboard
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the verification instructions

### Serverless Function Optimization

For better performance:

1. Optimize serverless function size by excluding unnecessary dependencies
2. Use proper caching strategies in your API endpoints
3. Consider using Vercel Edge Functions for low-latency operations

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)