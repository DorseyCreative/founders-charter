# What Costs Extra

*The paid layer above the $217 base, derived from the code. 2026-09-10.*

One Stripe subscription per tenant, composed of up to four items: base (qty 1), installer overage (qty = active installers − 3), AI Pro (0 or 1), and PayCheck.

## Installer seats — $35/mo each beyond 3

The base includes **3 active installer slots**. A fourth and beyond costs $35/mo, or $29/mo effective on annual.

**The cap is on activation, not creation.** A tenant can hold unlimited installer *profiles*; only those flagged `is_active_installer = true` count. `checkActivationAllowed()` computes `planCap = 3 + the live Stripe overage quantity` — read from Stripe, not a cached flag.

At the cap, every activation surface returns **HTTP 402** with an upgrade payload whose error string literally quotes the price. That covers invite accept, status toggle, admin create, and punch-in — so an installer can hit it in the field, not just an owner in settings.

Your own tenant (Go Blinds Gold) is hardcoded `unlimited: true`. Worth remembering if it is ever used as a reference for a seat-pricing conversation.

## PayCheck — $45/mo, 30-day trial, no card

**What it is.** Crew2 voucher reconciliation plus a weekly PM discrepancy report. The paywall copy:

> Auto-import your Crew2 payment vouchers, match each line to the work order, and surface every discrepancy or chargeback in a weekly report you can forward straight to your PM.

**What it unlocks.** The `/accounting/paycheck` dashboard (Discrepancies, Awaiting, Mileage), the whole `/api/paycheck/*` surface, the voucher ingest paths (PDF import, IMAP sync, Gmail sync), and four crons including the weekly PM report.

**How it is enforced.** Two independent gates stack. Role first — `PAYCHECK_ROLES = ['owner', 'super_admin']`, and a lookup error fails **closed**. Then entitlement — each route checks `features.voucher_addon === true` and returns **402** if not. One inconsistency: `api/paycheck/summary` returns 200 with zeroed stats instead of a 402.

The role list was deliberately tightened from a previous `['owner','installer','super_admin']`, which had handed every installer the company's full voucher ledger. `admin` and `manager` are excluded on purpose.

**Trial mechanics.** Trial start attaches **no Stripe item at all**. Entitlement is granted locally (`voucher_addon: true`, `voucher_addon_billing_status: 'trial_pending_stripe'`), and `cron/voucher-trial-convert` attaches the $45 item only once the 30 days elapse. **Nobody is charged during the trial.** An earlier metadata-only implementation did bill immediately; that is fixed.

**Two live issues.** The entitlement sync reads only whether a Stripe item exists and does not recognise `trial_pending_stripe` — so an unrelated subscription change mid-trial can revoke it silently. And the gate's own 402 copy advertises a **14-day** trial when the real one is 30.

**No annual SKU exists.** The annual price object is a deliberate stub set to zero, so a caller requesting annual PayCheck gets a clean error. You cannot sell PayCheck annually today.

## AI Pro — $79/mo

**It does not change the model or the provider.** Provider and model selection is a per-tenant system setting, unrelated to plan tier.

**What it actually buys is quota.** Base tenants get **1,000 AI requests per Stripe billing period**. AI Pro makes that unlimited. Threshold notifications fire once each at 50%, 80% and 100%, with an owner email at 80 and 100.

**What happens at the cap matters more than the cap.** At 100% without AI Pro the system *degrades* rather than stops: the customer-facing orchestrator falls back to template replies rather than leaving homeowners unanswered, while premium features (Guardian, Ask Alice) pause. Gated routes return **402** with an upgrade payload.

So the pitch is not "better AI." It is "your automation doesn't drop to templates in the last week of the month."

**Billing.** Toggled with real Stripe proration — an immediate mid-cycle charge, no trial. Adding it resets the usage period; removing it does not.

**Who can toggle.** Platform staff, or the tenant's own **owner** specifically. A tenant's `admin`-role user cannot change billing items.

## Packaging notes

- **No annual PayCheck.** A gap in the price book, not a bug.
- **The 402 copy undersells the PayCheck trial by 16 days** — 14 advertised, 30 real.
- **Prices are defined twice.** `lib/revenue-intelligence.ts` hardcodes its own copy of every price for MRR reporting and does not import `lib/stripe.ts`. Change a price in one and your MRR dashboards silently go stale.
- **A dead legacy price list still exports** from `stripe.ts` — Pro $49 and Enterprise $149 — documented in-file as wrong and not to be used for MRR.
- **Grandfathering exists** for PayCheck: named tenants are exempt from webhook revocation while billing is migrated.
- **The general trial is 30 days, no card**, from a single constant in `lib/billing-constants.ts` created specifically to end an earlier drift where three files disagreed.
