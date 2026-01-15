# Rhema Fire Launch Checklist (Vercel)

## 1) Create GitHub repo
- Create a new repo
- Push this code

## 2) Create Vercel project
- Import GitHub repo
- Framework: Next.js
- Build Command: `npm run vercel-build`
- Install Command: `npm install`

## 3) Add Database (Vercel Postgres)
- Vercel → Storage → Postgres → Create and attach
- Ensure env vars exist:
  - DATABASE_URL (or POSTGRES_PRISMA_URL)
  - DIRECT_URL (or POSTGRES_URL_NON_POOLING) recommended

## 4) Add Auth env vars
- NEXTAUTH_URL = your Vercel domain (or custom domain)
- NEXTAUTH_SECRET = `openssl rand -base64 32`

## 5) Deploy
- Deploy (no cache)
- After first successful deploy: seed production once:
  - locally set DATABASE_URL to prod DB
  - run: `npx prisma db seed`

## 6) Add Custom Domain
- Add rhemafire.org in Vercel → Domains
- Update DNS at registrar
- Wait for SSL

## 7) Configure Admin (easy edits)
- Login: `/login`
- Admin → Appearance: update header/footer/sidebar + paste opt-in embed HTML
- Admin → Blog/Courses/Lessons: publish content
- Admin → Landing Pages: create funnel pages at `/lp/<slug>`

## 8) URL expectations
Clean, modern URLs:
- /
- /about
- /contact
- /blog
Also supports legacy links:
- /index.html
- /home.html
- /about.html
- /contact.html
- /blog.html

## 9) In-house autoresponder (optional)
Set SMTP env vars in Vercel:
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL
- CRON_SECRET (random string)

Then schedule a Vercel Cron job to call:
- GET /api/cron/send-drip?secret=YOUR_CRON_SECRET
Frequency: every hour (recommended)

## SEO/AEO
- Submit sitemap: https://YOURDOMAIN/sitemap.xml
- robots.txt is at https://YOURDOMAIN/robots.txt
- Add direct-answer blocks in /admin/page-builder for AEO.
