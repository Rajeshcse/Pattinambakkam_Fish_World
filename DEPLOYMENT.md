# Deployment Guide - Pattinambakkam Fish World SPA

## Prerequisites

Before deploying, ensure you have:
- A Vercel account (sign up at https://vercel.com)
- Git repository pushed to GitHub/GitLab/Bitbucket
- All environment variables configured

## Environment Variables

Your application requires these environment variables:

```env
VITE_API_BASE_URL=https://pattinambakkam-fish-world-api.onrender.com
VITE_APP_NAME=Pattinambakkam_Fish_World
VITE_WHATSAPP_NUMBER=919994072395
VITE_RAZORPAY_PAYMENT_LINK=https://razorpay.me/@paramanandamrajesh
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to Git**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your repository
   - Configure project:
     - Framework Preset: Vite
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Add Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add each variable:
     - `VITE_API_BASE_URL` = `https://pattinambakkam-fish-world-api.onrender.com`
     - `VITE_APP_NAME` = `Pattinambakkam_Fish_World`
     - `VITE_WHATSAPP_NUMBER` = `919994072395`
     - `VITE_RAZORPAY_PAYMENT_LINK` = `https://razorpay.me/@paramanandamrajesh`
   - Select "Production", "Preview", and "Development" for all variables

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a deployment URL (e.g., https://your-app.vercel.app)

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? Y
   - Which scope? (Select your account)
   - Link to existing project? N
   - What's your project's name? pattinambakkam-fish-world-spa
   - In which directory is your code located? ./
   - Want to override settings? N

5. **Set environment variables**
   ```bash
   vercel env add VITE_API_BASE_URL production
   vercel env add VITE_APP_NAME production
   vercel env add VITE_WHATSAPP_NUMBER production
   vercel env add VITE_RAZORPAY_PAYMENT_LINK production
   ```

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Post-Deployment

### 1. Verify Deployment
- Visit your deployment URL
- Test login/registration
- Test cart and checkout flow
- Verify payment instructions are correct

### 2. Configure Custom Domain (Optional)
1. Go to your project in Vercel Dashboard
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

### 3. Enable HTTPS
- Vercel automatically provides SSL/HTTPS
- Your custom domain will also get a free SSL certificate

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request gets a preview URL
- **Development**: Optional preview for other branches

## Monitoring

Monitor your deployment:
- **Vercel Dashboard**: View builds, deployments, and analytics
- **Build Logs**: Check for any build errors
- **Runtime Logs**: Monitor application errors
- **Analytics**: Track performance metrics

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure dependencies are in package.json
- Test build locally: `npm run build`

### Blank Page After Deployment
- Check browser console for errors
- Verify environment variables are set correctly
- Check API base URL is accessible from browser
- Ensure CORS is configured on backend

### API Connection Issues
- Verify `VITE_API_BASE_URL` is correct
- Ensure backend API allows CORS from your Vercel domain
- Check backend API is running and accessible

## Rollback

If you need to rollback:
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments"
4. Find the previous working deployment
5. Click "..." → "Promote to Production"

## Support

For issues:
- Vercel Documentation: https://vercel.com/docs
- GitHub Issues: Create an issue in your repository
- Vercel Support: https://vercel.com/support
