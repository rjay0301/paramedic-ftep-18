# Deployment Guide

This guide provides comprehensive instructions for deploying the Field Training Education Portal (FTEP).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Edge Functions Deployment](#edge-functions-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- **Supabase Account** - Database and authentication
- **Deployment Platform** - Netlify, Vercel, or similar

### Required Tools
- Node.js (v18 or higher)
- npm or yarn
- Git
- Supabase CLI (for edge functions)

---

## Environment Setup

### 1. Environment Variables

Create a `.env` file in the project root with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings > API**
3. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

**IMPORTANT:** Never commit `.env` file to version control. It's already in `.gitignore`.

---

## Database Setup

### 1. Apply Migrations

All migrations are located in `supabase/migrations/`. Apply them in order:

```bash
# Using Supabase CLI
supabase db push
```

Or manually apply through Supabase dashboard:
1. Go to **SQL Editor**
2. Run each migration file in chronological order

### 2. Verify Database Schema

Check that all tables exist:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

Expected tables:
- profiles
- students
- coordinators
- training_phases
- student_submissions
- form_submissions
- form_revisions
- form_drafts
- instructional_case_summaries
- assignments
- audit_logs
- hubs
- student_progress
- addendum_forms

### 3. Verify Row Level Security

Check RLS is enabled on all tables:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

### 4. Create Initial Admin Account

After first user signup, run:

```sql
-- Replace with actual user email
UPDATE profiles
SET role = 'admin', status = 'active'
WHERE email = 'admin@example.com';
```

---

## Edge Functions Deployment

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Project

```bash
supabase link --project-ref your-project-ref
```

### 4. Deploy Edge Functions

```bash
# Deploy delete-user function
supabase functions deploy delete-user

# Deploy handle-role-update function
supabase functions deploy handle-role-update
```

### 5. Verify Deployment

```bash
supabase functions list
```

Both functions should show as deployed.

---

## Frontend Deployment

### Option 1: Netlify

1. **Connect Repository**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Add Environment Variables**
   - Go to Site settings > Environment variables
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Click "Deploy site"

### Option 2: Vercel

1. **Connect Repository**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your repository

2. **Configure Project**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   ```

3. **Add Environment Variables**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Click "Deploy"

### Manual Build & Deploy

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The dist/ folder now contains your production build
# Upload contents to your hosting provider
```

---

## Post-Deployment Verification

### 1. Smoke Tests

Run these tests immediately after deployment:

- [ ] **Homepage loads** - Visit the deployed URL
- [ ] **Login page accessible** - Navigate to `/login`
- [ ] **Can create account** - Try signup flow
- [ ] **Database connection** - Check browser console for connection errors
- [ ] **Auth flow works** - Login with test account
- [ ] **Role-based routing** - Verify student/coordinator/admin dashboards load

### 2. Database Connectivity

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity
WHERE datname = current_database();
```

### 3. Edge Functions Check

Test each function:

```bash
# Test delete-user (admin only)
curl -X POST https://your-project.supabase.co/functions/v1/delete-user \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-id"}'

# Test handle-role-update (admin only)
curl -X POST https://your-project.supabase.co/functions/v1/handle-role-update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-id", "role": "student"}'
```

### 4. Security Verification

- [ ] RLS policies active
- [ ] Edge function authorization working
- [ ] CORS headers correct
- [ ] No sensitive data in client-side code
- [ ] Environment variables not exposed

---

## Rollback Procedures

### Database Rollback

Supabase maintains automatic backups. To rollback:

1. Go to **Database > Backups**
2. Select backup point
3. Click "Restore"

### Application Rollback

#### Netlify
1. Go to **Deploys**
2. Find previous successful deploy
3. Click "Publish deploy"

#### Vercel
1. Go to **Deployments**
2. Find previous successful deployment
3. Click three dots > "Promote to Production"

### Edge Functions Rollback

Edge functions don't have built-in versioning. Keep backups:

```bash
# Before deploying, backup current functions
cp -r supabase/functions supabase/functions.backup
```

To restore:
```bash
cp -r supabase/functions.backup supabase/functions
supabase functions deploy delete-user
supabase functions deploy handle-role-update
```

---

## Troubleshooting

### Issue: "Can't connect to database"

**Solution:**
1. Check environment variables are set correctly
2. Verify Supabase project is not paused
3. Check Supabase project health dashboard
4. Verify RLS policies aren't blocking queries

### Issue: "Authentication failed"

**Solution:**
1. Verify `VITE_SUPABASE_ANON_KEY` is correct
2. Check Supabase auth settings
3. Ensure user status is 'active' in database
4. Clear browser cache and localStorage

### Issue: "Edge functions not working"

**Solution:**
1. Check function deployment status: `supabase functions list`
2. Verify CORS headers in function code
3. Check function logs: `supabase functions logs delete-user`
4. Ensure service role key is configured in Supabase

### Issue: "RLS policy blocking queries"

**Solution:**
1. Check if user is authenticated: `SELECT auth.uid()`
2. Verify user role in profiles table
3. Review RLS policies for affected table
4. Check policy uses correct auth.uid() comparisons

### Issue: "Large bundle size / slow loading"

**Solution:**
- Code splitting is already implemented
- Check for heavy dependencies
- Use build analyzer: `npm run build -- --analyze`
- Consider CDN for static assets

### Issue: "CORS errors"

**Solution:**
1. Verify edge function CORS headers match:
   ```typescript
   "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey"
   ```
2. Check Supabase CORS settings
3. Ensure OPTIONS requests return 204

---

## Monitoring & Maintenance

### Recommended Monitoring

1. **Error Tracking**
   - Integrate Sentry or similar
   - Monitor error rates
   - Set up alerts for critical errors

2. **Performance Monitoring**
   - Use Lighthouse CI
   - Monitor Core Web Vitals
   - Track page load times

3. **Database Monitoring**
   - Watch connection pool usage
   - Monitor query performance
   - Set up alerts for slow queries

4. **Uptime Monitoring**
   - Use UptimeRobot or similar
   - Monitor both frontend and edge functions
   - Set up downtime alerts

### Regular Maintenance Tasks

**Weekly:**
- Review error logs
- Check database performance
- Monitor user feedback

**Monthly:**
- Update dependencies: `npm update`
- Review and optimize slow queries
- Audit user accounts and permissions
- Check backup integrity

**Quarterly:**
- Security audit
- Performance optimization review
- Dependency security scan
- Database cleanup (old drafts, logs)

---

## Security Checklist

Before going live:

- [ ] All RLS policies tested and active
- [ ] No console.log statements in production
- [ ] Environment variables not in code
- [ ] Edge functions require admin role
- [ ] CORS configured correctly
- [ ] Database backups enabled
- [ ] SSL/HTTPS enforced
- [ ] Rate limiting considered
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified

---

## Support

For issues or questions:

1. Check this documentation
2. Review `ROLES_AND_PERMISSIONS.md` for access issues
3. Check Supabase logs and dashboard
4. Review browser console for client-side errors
5. Check edge function logs for server-side errors

---

## Changelog

### Version 1.0.0 (Current)
- Initial production deployment
- Complete database schema
- Three user roles (admin, coordinator, student)
- 14 database tables with RLS
- 2 edge functions
- Code splitting implemented
- Error boundaries active
