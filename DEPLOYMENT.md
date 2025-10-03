# 🚀 Shotty Deployment Guide (Vercel)

## Prerequisites

- GitHub account (to connect repositories)
- Vercel account (free): https://vercel.com/signup
- MongoDB Atlas account (free): https://www.mongodb.com/cloud/atlas/register

---

## Step 1: Setup MongoDB Atlas (Free Database)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free M0 cluster
3. Create a database user (username + password)
4. Add IP: `0.0.0.0/0` (allow from anywhere - for Vercel)
5. Get connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/shotty`

---

## Step 2: Deploy Backend to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. **Push backend to GitHub**:

   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin https://github.com/yourusername/shotty-backend.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:

   - Go to https://vercel.com/new
   - Import your `shotty-backend` repository
   - Click "Deploy"

3. **Add Environment Variables** (in Vercel Dashboard):

   - `MONGO_URI` = `mongodb+srv://...` (from Step 1)
   - `JWT_SECRET_KEY` = `any-random-secure-string-here`
   - `CLIENT_URL` = `https://shotty-frontend.vercel.app` (we'll get this in Step 3)
   - `NODE_ENV` = `production`

4. **Redeploy** after adding env vars

### Option B: Using CLI

```bash
cd backend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? shotty-backend
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add MONGO_URI
vercel env add JWT_SECRET_KEY
vercel env add CLIENT_URL
vercel env add NODE_ENV

# Deploy to production
vercel --prod
```

**Your backend URL**: `https://shotty-backend.vercel.app`

---

## Step 3: Deploy Frontend to Vercel

1. **Update frontend environment variable**:

   ```bash
   cd frontend
   ```

2. **Push frontend to GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial frontend commit"
   git remote add origin https://github.com/yourusername/shotty-frontend.git
   git push -u origin main
   ```

3. **Deploy on Vercel**:

   - Go to https://vercel.com/new
   - Import your `shotty-frontend` repository
   - Framework Preset: Vite
   - Click "Deploy"

4. **Add Environment Variable**:

   - `VITE_API_URL` = `https://shotty-backend.vercel.app`

5. **Redeploy**

**Your frontend URL**: `https://shotty-frontend.vercel.app`

---

## Step 4: Update Backend CORS

1. Go back to backend Vercel project
2. Update `CLIENT_URL` environment variable:
   - Value: `https://shotty-frontend.vercel.app` (your actual frontend URL)
3. Redeploy backend

---

## Step 5: Update Cookie Settings (Important!)

The backend needs secure cookies for production. Update these files:

**In `backend/src/controllers/loginUser.ts` (line 57):**

```typescript
res.cookie("token", token, {
  httpOnly: true,
  expires: new Date(Date.now() + 8 * 3600000),
  secure: true, // HTTPS only
  sameSite: "none", // Cross-domain
});
```

**In `backend/src/controllers/signupUser.ts` (similar location):**

```typescript
res.cookie("token", token, {
  httpOnly: true,
  expires: new Date(Date.now() + 8 * 3600000),
  secure: true,
  sameSite: "none",
});
```

Then commit and push - Vercel will auto-deploy!

---

## Step 6: Test Your Deployment

1. Visit your frontend: `https://shotty-frontend.vercel.app`
2. Sign up for an account
3. Create a short URL
4. Test the redirect

---

## Troubleshooting

### Cookies not working?

- Make sure `secure: true` and `sameSite: "none"` in cookie config
- Check `CLIENT_URL` matches your frontend URL exactly

### CORS errors?

- Verify `CLIENT_URL` in backend env vars
- No trailing slash in URLs

### Database connection failed?

- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify connection string username/password

---

## Custom Domain (Optional)

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Vercel Dashboard → Your Project → Settings → Domains
3. Add your domain: `shotty.yourdomain.com`
4. Update DNS records as instructed
5. Update `CLIENT_URL` and `VITE_API_URL` to use custom domain

---

## Free Tier Limits

**Vercel Free:**

- 100GB bandwidth/month
- Unlimited projects
- Automatic HTTPS
- Perfect for personal projects!

**MongoDB Atlas Free:**

- 512MB storage
- Shared cluster
- Great for getting started!

---

🎉 **That's it! Your app is live!**
