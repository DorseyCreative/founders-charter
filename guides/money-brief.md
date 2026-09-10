# Money Brief — Dorsey Creative Concepts LLC

*Pre-launch snapshot, 2026-09-10. Every figure not already fixed in code is marked as an estimate or "needs checking." None are invented.*

## 1. Vendor stack — fixed vs variable

| Vendor | What it does | Cost type | Where to check |
|---|---|---|---|
| **Vercel** | Hosts the app + 28 crons | FIXED plan + usage at scale | vercel.com → Billing |
| **Supabase** | Postgres, auth, storage | FIXED base; storage/egress rise with tenants | supabase.com → Settings → Billing |
| **Hetzner** | VPS `ors-usa` running ORS + VROOM | FIXED flat rate until a bigger box is needed | Hetzner Cloud Console |
| **VoIP.ms** | SMS + voice on the DID | **VARIABLE** per message/minute | voip.ms → Billing / CDR |
| **OpenAI** | AI features — the cost behind AI Pro | **VARIABLE**, token-metered | platform.openai.com/usage |
| **Anthropic** | Alt/parallel AI provider | **VARIABLE**, token-metered | console.anthropic.com |
| **Google Maps** | Geocoding, directions | **VARIABLE** per request | console.cloud.google.com/billing |
| **Mapbox** | Key present — may be vestigial | Variable if used | Confirm it's actually called |
| **Resend** | Platform transactional email | **VARIABLE** per tier | resend.com → Billing |
| **Smartsheet** | OAuth row federation | Likely tenant-side, not yours | Confirm no paid dev tier |
| **Stripe** | Payments | **VARIABLE** per transaction, no fixed fee | dashboard.stripe.com |
| **Cloudflare** | Domain, DNS, email worker | FIXED (~annual domain) | dash.cloudflare.com |
| **Sentry** | Error tracking | Likely free/fixed | sentry.io |
| **Mixpanel / GA** | Analytics | Mixpanel tiered by events; GA free | mixpanel.com |
| **Gmail/Workspace** | Inbound polling | Unclear — free vs paid seat | Confirm account type |
| **OpenWeather, Expo push** | Weather, mobile push | Likely free tier | Check if any tier tripped |

**Not actually paid despite appearing in config:** Twilio (2 stray references — VoIP.ms is the live SMS rail), AWS S3 (the SDK points at Hetzner's S3-compatible endpoint, not AWS).

## 2. Unit economics

Base $217/mo includes 3 installer seats; $35/mo per installer beyond 3.

| Installers | Base + overage | +AI Pro $79 | +PayCheck $45 | +Both |
|---|---|---|---|---|
| 3 | 217 + 0×35 = **$217** | $296 | $262 | $341 |
| 6 | 217 + 3×35 = **$322** | $401 | $367 | $446 |
| 10 | 217 + 7×35 = **$462** | $541 | $507 | $586 |

**Scales per tenant:** Supabase rows/storage, Stripe fees, Resend volume, AI tokens (if AI Pro), Maps calls, Cloudflare Worker invocations.

**Scales per installer:** VoIP.ms SMS/voice, Maps directions per route, Hetzner ORS/VROOM load, Expo push.

**Fixed until a real threshold:** Vercel plan, Hetzner VPS, Cloudflare, Sentry, Mixpanel base.

## 3. Break-even

**N = ⌈ F ÷ ARPU ⌉** where F is your fixed monthly stack.

| Fixed cost F | at $217 (3 inst.) | at $322 (6 inst.) | at $367 (6 + PayCheck) |
|---|---|---|---|
| $200 | **1 tenant** | **1 tenant** | **1 tenant** |
| $500 | **3 tenants** | **2 tenants** | **2 tenants** |
| $1,000 | **5 tenants** | **4 tenants** | **3 tenants** |

Fill in the real F once the fixed-tier invoices are in hand.

## 4. §195 start-up costs — 16 categories currently untracked

Per `startup-costs-2026.md`, everything paid **before your first paying customer** is potentially a start-up cost: first $5,000 deductible, remainder amortised over 180 months. The tracker currently shows **$140 total** (WI filing fee, Cloudflare domain, FaxZero).

Given the stack above and active development since ~Dec 2025, these are almost certainly missing. **Confirm each with the CPA before treating as deductible.**

1. **Vercel** plan charges since deployment began
2. **Supabase** subscription since the project was created
3. **Hetzner** VPS, monthly since provisioned
4. **OpenAI + Anthropic** API usage during development and testing
5. **Google Cloud / Maps** billed usage during dev
6. **Resend** plan/overage — flag the allocation question (may be booked under go-blinds-system)
7. **VoIP.ms** DID rental + usage since provisioned
8. **Anthropic/Claude subscription** used to build the app
9. **GitHub** paid seats, Copilot, or CI minutes
10. **Sentry / Mixpanel** paid tiers vs free
11. **Cloudflare** beyond the tracked $10 domain
12. **App-store developer accounts** if the Expo app was submitted (Apple $99/yr, Google Play $25 once)
13. **Equipment bought specifically for building/testing** — keep separate; §179/depreciation split
14. **Contractor/consulting payments** since Dec 2025
15. **Mileage/travel** for HD-installer prospecting — log via the Accountable Plan
16. **Books/courses/training** for running the business

**Where to pull evidence:** each vendor's own invoice history, plus Mercury card/bank statements since ~Dec 2025 for anything not itemised, plus email receipts.

**What to retain:** the PDF invoice from each vendor, saved to `_receipts/2026/`, with the matching statement line and a one-line business-purpose note.
