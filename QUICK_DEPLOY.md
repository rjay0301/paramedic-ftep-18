# Quick Deployment Guide

Fast-track deployment instructions for experienced developers.

## Prerequisites
- Supabase project created
- Node.js 18+ installed
- Supabase CLI installed: `npm install -g supabase`

## 1. Environment Setup (2 minutes)

Create `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Database Setup (5 minutes)

```bash
# Login to Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

## 3. Edge Functions (3 minutes)

```bash
# Deploy both functions
supabase functions deploy delete-user
supabase functions deploy handle-role-update

# Verify
supabase functions list
```

## 4. Frontend Deploy (5 minutes)

### Option A: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist

# Set env vars in Netlify dashboard
```

### Option B: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set env vars in Vercel dashboard
```

### Option C: Manual
```bash
# Build
npm install
npm run build

# Upload dist/ folder to your hosting
```

## 5. Post-Deploy Verification (2 minutes)

```bash
# Check these URLs:
# - https://your-site.com (homepage)
# - https://your-site.com/login (login page)
# - https://your-site.com/dashboard (requires auth)
```

## 6. Create First Admin (1 minute)

After first user signs up, run in Supabase SQL Editor:

```sql
UPDATE profiles
SET role = 'admin', status = 'active'
WHERE email = 'your-admin@email.com';
```

## Total Time: ~20 minutes

## Troubleshooting

**Build fails:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Can't connect to DB:**
- Check VITE_SUPABASE_URL is correct
- Verify project not paused
- Check RLS policies

**Edge functions fail:**
- Verify deployment: `supabase functions list`
- Check logs: `supabase functions logs delete-user`
- Ensure service role key configured

**Auth not working:**
- Verify VITE_SUPABASE_ANON_KEY correct
- Check user status is 'active'
- Clear browser cache

## Rollback

**Frontend:**
- Netlify: Deploys > Previous deploy > Publish
- Vercel: Deployments > Previous > Promote

**Database:**
- Supabase Dashboard > Database > Backups > Restore

## Need Help?

See `DEPLOYMENT.md` for detailed instructions.
