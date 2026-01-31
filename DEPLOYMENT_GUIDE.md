# Get Listings Portal - Deployment Guide

## Quick Reference

### Portal (Next.js on DigitalOcean)
- **Server**: Portal droplet (SYD1 region)
- **GitHub Repo**: `https://github.com/thomasreddaway-afk/getlistings-portal.git`
- **Production Branch**: `fix/match-demo-html` (or `main` after merge)
- **Process Manager**: PM2

---

## Step 1: Push Changes to GitHub (Local Machine)

From your local Get Listings Portal directory:

```bash
cd "/Users/tomreddaway/Downloads/Get Listings Portal"

# Check what's changed
git status

# Stage all changes
git add .

# Commit with a message
git commit -m "feat: description of changes"

# Push to GitHub
git push origin fix/match-demo-html
```

---

## Step 2: Deploy to Production (DigitalOcean)

### Access the Server
1. Go to [DigitalOcean](https://cloud.digitalocean.com)
2. Click **Droplets** in left sidebar
3. Find **Portal** droplet (SYD1 region)
4. Click **Console** (or use SSH)

### Run Deployment Commands

Copy and paste this single command:

```bash
cd ~/portal && git pull origin fix/match-demo-html && npm install && npm run build && pm2 restart all --update-env
```

### What Each Part Does
| Command | Purpose |
|---------|---------|
| `cd ~/portal` | Navigate to portal directory |
| `git pull origin fix/match-demo-html` | Pull latest changes from GitHub |
| `npm install` | Install any new dependencies |
| `npm run build` | Build the Next.js production app |
| `pm2 restart all --update-env` | Restart the app with new build |

---

## Step 3: Verify Deployment

After PM2 restarts, you'll see a table like:

```
┌────┬────────────────────┬─────────┬─────────┬────────┬─────────┬──────────┐
│ id │ name               │ version │ mode    │ status │ cpu     │ mem      │
├────┼────────────────────┼─────────┼─────────┼────────┼─────────┼──────────┤
│ 0  │ getlistings-portal │ 0.39.7  │ fork    │ online │ 0%      │ 22.4mb   │
└────┴────────────────────┴─────────┴─────────┴────────┴─────────┴──────────┘
```

✅ **Success**: Status shows `online` in green

---

## Troubleshooting

### Check PM2 Logs
```bash
pm2 logs getlistings-portal --lines 50
```

### Check PM2 Status
```bash
pm2 status
```

### Full Restart (if issues)
```bash
pm2 delete all
cd ~/portal
npm run build
pm2 start npm --name "getlistings-portal" -- start
pm2 save
```

### Check Which Branch is Deployed
```bash
cd ~/portal && git branch
```

---

## Environment Variables

The production `.env` file is at `~/portal/.env.local` on the server. Key variables:
- `NEXT_PUBLIC_API_BASE_URL` - API endpoint (https://prop.deals/v1)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps key

---

## Admin Panel (Separate Deployment)

- **Repo**: `https://gitlab.com/propdeals/admin.git`
- **Stack**: Angular + Docker
- **Server**: Propdeals droplet (SFO3)

Admin deployment uses Docker - contact Bilal/Sarmad for admin deployments.

---

## Team Contacts

- **Bilal** - Backend developer
- **Sarmad** - Backend developer (authorized Portal deployments)

---

## Summary Checklist

- [ ] Make changes locally
- [ ] `git add . && git commit -m "message" && git push origin fix/match-demo-html`
- [ ] Open DigitalOcean → Portal droplet → Console
- [ ] Run: `cd ~/portal && git pull origin fix/match-demo-html && npm install && npm run build && pm2 restart all --update-env`
- [ ] Verify status shows `online`
- [ ] Test in browser
