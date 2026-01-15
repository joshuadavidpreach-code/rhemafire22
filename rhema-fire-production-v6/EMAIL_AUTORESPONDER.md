# In-house Autoresponder (SMTP)

This build includes an in-house 10-email drip sequence.
- Opt-ins create/update a subscriber record in `EmailSubscriber`
- A cron endpoint sends due emails via SMTP

## Configure
Set env vars:
- SMTP_HOST
- SMTP_PORT (587 typical)
- SMTP_USER
- SMTP_PASS
- SMTP_SECURE (true/false)
- FROM_EMAIL (optional)
- CRON_SECRET (required)

## Run sender locally (manual)
Call:
GET http://localhost:3000/api/cron/send-drip?secret=YOUR_CRON_SECRET

## Vercel Cron
Create a cron job that hits:
/api/cron/send-drip?secret=YOUR_CRON_SECRET
Every hour is fine.
