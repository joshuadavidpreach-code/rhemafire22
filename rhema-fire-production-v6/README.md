# Rhema Fire Platform (Deployable Package)

This is a **Vercel-ready** Next.js + Prisma package for the Rhema Fire website + clickable admin system.

## What’s included
- Public pages: Home, Blog, Media, About, Contact, Free Book
- Opt-in popup + stored opt-ins
- Contact + Invite forms (stored)
- Admin dashboard (clickable) with CRUD for Pages, Blog, Courses, Lessons, Redirects
- Prisma schema + **committed migrations**
- Seed script to create an admin user + sample content
- Locked Rhema Fire design system CSS

---

## 1) Run locally

### Install
```bash
npm install
```

### Configure env
```bash
cp .env.example .env
```

### Migrate + seed
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### Start
```bash
npm run dev
```

Open:
- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin

Default seeded admin (change in `.env`):
- Email: admin@rhemafire.local
- Password: ChangeMeNow!

---

## 2) Deploy to Vercel (production)

### A) Create a Postgres DB
Use **Vercel Postgres** (Storage) or any managed Postgres.

### B) Set environment variables in Vercel
- `DATABASE_URL` (Postgres connection string)
- `NEXTAUTH_SECRET` (generate: `openssl rand -base64 32`)
- `NEXTAUTH_URL` (your Vercel domain)

Optional seed envs:
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

### C) Deploy
Push to GitHub and import into Vercel.
This repo uses:
- `vercel.json` build command: `npm run vercel-build`
- which runs: `prisma generate && prisma migrate deploy && next build`

### D) Seed production (one-time)
After the first deploy (migrations applied), run seed against prod DB locally:
```bash
# temporarily set DATABASE_URL to production DB in your shell:
npx prisma db seed
```

---

## Notes
- Admin is protected by NextAuth credentials provider.
- Member portal routes are scaffolded (you can extend).
- This is a solid “get it live” foundation; expand Track/Ordination module next.


## New in this package
- Hashed passwords (bcrypt)
- /register page + /api/register
- Membership tiers + entitlements tables (FREE_MEMBER, MINISTRY_TRACK)
- /member/track gated scaffold + /upgrade scaffold + Stripe placeholder endpoint



## Admin editing (non-technical)
- /admin/appearance: edit header/footer/copyright, blog sidebar HTML, and opt-in embed HTML
- /admin/landing-pages: create funnel landing pages at /lp/<slug>

## Static .html support
This build redirects /about.html etc to clean routes and includes simple fallback files in /public.

## v6 upgrades (SEO/AEO + Visual Builder + In-house autoresponder editor)
- Page Builder for main pages: /admin/page-builder/home (and /about, /contact, /media)
- Landing Page Visual Builder already included: /admin/landing-builder/<slug>
- In-house autoresponder editor: /admin/autoresponder (edit the 10-email drip)
- SEO: /sitemap.xml and /robots.txt
- AEO: Direct Answer fields on pages (editable in Page Builder)
