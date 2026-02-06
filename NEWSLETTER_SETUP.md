# Newsletter System Guide (Redis & Serverless)

This blog includes a fully serverless newsletter subscription system using **Redis** for persistent storage and **Vercel Cron Jobs** for automated weekly digests.

## Architecture

- **Storage**: Redis - key-value store (https://redis.io or any Redis provider)
- **Email Service**: Nodemailer with SMTP (Gmail, SendGrid, Mailgun, etc.)
- **Scheduling**: Vercel Cron Jobs - built-in to Vercel deployments
- **No files needed**: All data stored in Redis, not the filesystem

## Setup

### 1. Create Redis Database

You can use any Redis provider:

**Option A: Redis Cloud (Recommended)**
1. Go to [Redis Cloud](https://redis.com/cloud)
2. Sign up for a free account
3. Create a new database (free tier available)
4. Copy the connection string (format: `redis://default:password@host:port`)

**Option B: Self-hosted Redis**
- DeployRedis to your own server
- Use Docker: `docker run -d -p 6379:6379 redis/redis-stack-server:latest`

**Option C: Other Providers**
- Railway.app, Upstash, AWS ElastiCache, etc.

### 2. Environment Variables

Add these to `.env.local` (local) or Vercel project settings (production):

```bash
# Redis Configuration
REDIS_URL=redis://default:password@host:port

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SECURE=false
SMTP_FROM_EMAIL=noreply@yourblog.com

# Blog Configuration
BLOG_URL=https://yourblog.com
BLOG_TITLE=Your Blog Name

# Cron Job Secret (keep it secret!)
CRON_SECRET=your-super-secret-key-here
```

### 3. Gmail SMTP Setup (Recommended)

1. Enable 2-factor authentication on your Google Account
2. Generate an [App Password](https://support.google.com/accounts/answer/185833)
3. Use the app password as `SMTP_PASSWORD`

Alternative: Use services like SendGrid, Mailgun, or AWS SES

### 4. Install Dependencies

```bash
npm install
```

This installs the `redis` package needed to connect to your Redis database.

### 5. Deploy to Vercel

```bash
git add .
git commit -m "Add serverless newsletter system with Redis"
git push origin main
```

The `vercel.json` cron job configuration will be deployed automatically.

## How It Works

### Subscriber Registration (`/api/newsletter/subscribe`)

Users enter email → Redis stores subscriber record with:
- `email`: lowercase email address
- `subscribedAt`: ISO timestamp
- `active`: true/false flag

**POST Request:**
```bash
curl -X POST https://yourblog.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Weekly Digest (`/api/newsletter/digest`)

**Automatic**: Runs every Monday at 9 AM (UTC) via Vercel Cron

**Manual trigger:**
```bash
curl -X POST https://yourblog.com/api/newsletter/digest \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Process:**
1. Fetches posts published in the past 7 days
2. Filters out draft posts
3. Checks if at least 3 posts exist
4. Sends beautiful HTML email to all active subscribers
5. Updates last digest timestamp to avoid duplicates

### Unsubscribe (`/api/newsletter/unsubscribe`)

- **GET** (email link): `https://yourblog.com/api/newsletter/unsubscribe?email=user@example.com`
- **POST** (API): JSON body with email

Marks subscriber as `active: false` while keeping the record for unsubscribe history.

## Email Design

Beautiful, responsive HTML email template with:
- Gradient hero section with blog title
- Individual post cards with:
  - Post number badge
  - Title (linked to blog)
  - Publication date with emoji
  - Author name
  - Excerpt preview
  - "Read more →" link
- Call-to-action button
- Professional footer with unsubscribe link

## Customize Cron Schedule

Edit `vercel.json` to change when digests send:

```json
{
  "crons": [
    {
      "path": "/api/newsletter/digest",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

**Cron format**: `minute hour day month day-of-week`

**Examples:**
- `0 9 * * 1` → Monday 9 AM (default)
- `0 18 * * 0` → Sunday 6 PM
- `0 8 * * *` → Daily at 8 AM
- `0 9 * * 1-5` → Weekdays at 9 AM

See [cron.guru](https://cron.guru) for help.

## Redis Operations

**View subscribers in Redis:**

Using Redis CLI:
```bash
redis-cli
> HGETALL newsletter:subscribers
```

Or use your Redis provider's dashboard/UI.

**Data Structure:**
```
Hash Key: newsletter:subscribers
Fields: {
  "user@example.com": "{"email":"user@example.com","subscribedAt":"2024-02-06T...","active":true}",
  "another@email.com": "{"email":"another@email.com","subscribedAt":"2024-02-07T...","active":false}"
}
```

**Last Digest Timestamp:**
```
String Key: newsletter:last-digest-time
Value: "2024-02-06T09:00:00.000Z"
```

## Using Newsletter Components

### Newsletter Signup Form

Add to your MDX content:

```mdx
<NewsletterSignup 
  title="Stay Updated"
  description="Get the latest posts delivered weekly."
  placeholder="your@email.com"
  buttonText="Subscribe"
/>
```

Or in React components:

```tsx
import { NewsletterSignupForm } from '@/components/newsletter-signup';

export default function Page() {
  return (
    <NewsletterSignupForm 
      title="Subscribe to our newsletter"
      description="New posts delivered every Monday morning."
    />
  );
}
```

## Troubleshooting

### No digests are being sent

**Check:**
- Redis is properly connected (test with `redis-cli`)
- Environment variables are set correctly in Vercel
- `CRON_SECRET` matches in your code and deployment
- At least 3 posts have been published since last digest
- Posts are not marked as "Draft"

**View logs:**
```bash
vercel logs --follow
```

### Emails not being sent

**Check:**
- SMTP credentials are correct
- Try the email with Gmail's [Test SMTP tool](https://www.gmass.co/smtp)
- Check spam/junk folders
- Review server logs for SMTP errors

### Subscribers not appearing in Redis

**Check:**
- Redis connection is working (check `REDIS_URL`)
- No errors in API response
- Check `newsletter:subscribers` key in Redis

### Can't connect to Redis

**Check:**
1. Verify `REDIS_URL` is correctly set in Vercel environment variables
2. Test connection locally: `redis-cli -u $REDIS_URL`
3. If self-hosted, ensure Redis server is running
4. If using Redis Cloud/Upstash, check firewall rules

**Reinstall dependencies:**
```bash
npm install
```

Then redeploy.

## Production Checklist

- [x] Add all environment variables to Vercel project settings
- [x] Test Redis connection from local environment
- [x] Test newsletter signup (fill out form)
- [x] Manually trigger digest to test email sending
- [x] Verify emails appear in inbox (not spam)
- [x] Check Redis to confirm subscribers stored
- [x] Verify cron job logs after first Monday 9 AM run
- [x] Update unsubscribe links in footer with correct domain

## Security

- **Cron Secret**: Keep unique and strong (use `openssl rand -hex 32`)
- **SMTP Password**: Never commit to repo, use Vercel environment variables
- **Redis URL**: Treat as sensitive - never commit to git or expose publicly
- **Email Privacy**: No personal data stored in files, only in Redis

## Rate Limiting

- Email sending: 100ms delay between emails to avoid rate limits
- Redis operations: Depends on your Redis provider's limits

## Cost

**Redis Provider Pricing:**

**Redis Cloud (Recommended)**
- Free tier: 30MB, sufficient for thousands of subscribers
- Pay-as-you-go for larger deployments

**Upstash:**
- Free tier: Excellent for small projects
- Pay-as-you-go scaling

**Railway.app:**
- Free credits, then simple per-resource pricing

**Alternative:** For higher email volumes, consider paid tiers of SendGrid/Mailgun

## Next Steps

1. Deploy to Vercel
2. Add newsletter signup form to your blog/footer
3. Write 3+ posts
4. Monday 9 AM: First digest automatically sends!

## Next Steps

1. Deploy to Vercel
2. Add newsletter signup form to your blog/footer
3. Write 3+ posts
4. Monday 9 AM: First digest automatically sends!
