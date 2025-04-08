# Deploying to Render

This guide explains how to deploy the Medical Assistant application on Render, which provides a more straightforward approach for full-stack applications than Vercel.

## Why Render Works Well for Full-Stack Apps

Render is designed to handle full-stack applications with both frontend and backend components in a single repository without requiring complex configuration.

## Step 1: Prepare Your Repository

First, push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/medical-assistant.git
git push -u origin main
```

## Step 2: Create a render.yaml Configuration

Create a file named `render.yaml` in the root of your project:

```yaml
services:
  # Web service with combined frontend/backend
  - type: web
    name: medical-assistant
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: GROQ_API_KEY
        sync: false
      - key: ELEVEN_LABS_API_KEY
        sync: false
```

## Step 3: Create a Render Account

1. Go to [render.com](https://render.com/) and sign up for an account
2. Verify your email and log in

## Step 4: Deploy Your Application

### Option 1: Using the Blueprint (Recommended)

1. In the Render dashboard, click on "New" and select "Blueprint"
2. Connect your GitHub account if you haven't already
3. Select your repository
4. Render will automatically detect the `render.yaml` file and set up your services
5. Add your environment variables:
   - `GROQ_API_KEY`: Your Groq API key
   - `ELEVEN_LABS_API_KEY`: Your Eleven Labs API key
   - `PERPLEXITY_API_KEY`: (Optional) Your Perplexity API key for enhanced search capabilities
   - `ALLOWED_ORIGINS`: (Optional) Comma-separated list of domains that can access your API, e.g., `https://yourdomain.com,https://app.yourdomain.com`
6. Click "Apply" to start the deployment

### Option 2: Manual Web Service Setup

If you prefer to set up manually without using the `render.yaml` blueprint:

1. In the Render dashboard, click on "New" and select "Web Service"
2. Connect your GitHub account and select your repository
3. Configure the service:
   - **Name**: medical-assistant (or your preferred name)
   - **Environment**: Node
   - **Region**: Choose the region closest to your users
   - **Branch**: main (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node scripts/start.js`
   - **Plan**: Free (or select paid plan for production)
   
4. Add Environment Variables:
   - Click "Advanced" and add:
     - `NODE_ENV`: production
     - `GROQ_API_KEY`: Your Groq API key
     - `ELEVEN_LABS_API_KEY`: Your Eleven Labs API key
     - `PERPLEXITY_API_KEY`: (Optional) Your Perplexity API key for enhanced search capabilities
     - `ALLOWED_ORIGINS`: (Optional) Comma-separated list of domains that can access your API, e.g., `https://yourdomain.com,https://app.yourdomain.com`
   
5. Click "Create Web Service"

## Step 5: Wait for Deployment

Render will now build and deploy your application. This might take a few minutes for the first deployment.

## Step 6: Access Your Application

Once deployment is complete:

1. Click on the service name in your Render dashboard
2. You'll see the status of your deployment and a URL where your app is hosted
3. Click on the URL to open your application

## Troubleshooting

### Build Errors

If your deployment fails during the build process:

1. Check the build logs in the Render dashboard
2. Common issues include:
   - Missing dependencies in package.json
   - Errors in your build scripts
   - Environment variables not properly accessed

### Runtime Errors

If your app deploys but doesn't work correctly:

1. Check the logs in the Render dashboard
2. Ensure your start command is correct
3. Verify all environment variables are set correctly

### Fixing the Server URL

You may need to update API URLs in your frontend code to match your Render deployment URL:

```javascript
// Example: Update API base URL
const apiUrl = process.env.NODE_ENV === 'production'
  ? window.location.origin  // Use the same origin in production
  : 'http://localhost:5000';  // Use localhost in development
```

## Custom Domains

To use a custom domain with your Render deployment:

1. Go to your service in the Render dashboard
2. Click on "Settings" and scroll to "Custom Domain"
3. Click "Add Custom Domain"
4. Enter your domain name and follow the provided instructions to update your DNS settings

## Scaling

Render's free tier has some limitations:

- Spins down after 15 minutes of inactivity
- Limited to 750 hours of usage per month
- Limited bandwidth and performance

For production use, consider upgrading to a paid plan for:

- Always-on service
- More compute resources
- Higher bandwidth limits

## Monitoring and Logs

Render provides built-in monitoring and logging:

1. Navigate to your service in the Render dashboard
2. Click on "Logs" to view application logs
3. Set up notifications in the "Settings" tab for deployment and error alerts

## Additional Tips

1. **Auto-Deploy**: By default, Render automatically deploys when you push to your repository. You can disable this in settings if needed.

2. **Preview Environments**: Render supports preview environments for pull requests, which you can enable in your service settings.

3. **Environment Variables**: For sensitive variables, use Render's environment variable management rather than hardcoding values.

4. **Performance Optimization**: Consider adding a CDN like Cloudflare in front of your Render deployment for improved global performance.

5. **Cost Management**: Keep an eye on your usage to avoid unexpected charges if you're on a paid plan.

## Useful Resources

- [Render Documentation](https://render.com/docs)
- [Render Dashboard](https://dashboard.render.com/)
- [Render Status Page](https://status.render.com/)