# Before the First Paying Tenant

*Findings that stop or endanger the first paying customer, ranked by that test alone. Compiled 2026-09-10.*

Launch is defined as the first paying tenant, so anything that fails at or before the moment of payment outranks everything else. Each finding carries the reason it was flagged, not just the defect.

**6 blockers · 8 high · 7 admin console · 3 already fixed · 0 paying tenants**

---

## Already fixed — do not re-fix

**Trial length is resolved at 30 days, from one source.** `TRIAL_DAYS = 30` now lives in `lib/billing-constants.ts:14` — a deliberately dependency-free module so client components need not import the Stripe SDK — and is re-exported by `lib/stripe.ts:39`. `create-tenant` and `create-embedded-checkout` both import it. The earlier 30/14/30 split is gone. Residual: `api/tenant/initialize:121` still hardcodes `+ 30`, which now happens to agree, but should import the constant like everything else.

**The deprecated Stripe webhook forwards instead of 410ing.** `api/stripe/webhook/route.ts` now imports and calls the canonical handler. Still confirm which URL Stripe Live points at — see B6.

---

## Blockers

### B1. Paying can lock the payer out
`app/api/webhooks/stripe/route.ts:612-617` — also `:166-178`, `:273-284`

`handlePaymentSucceeded` writes only `subscription_status: 'active'`. No `is_active: true`, no clearing of `locked_at` or `grace_ends_at`. Only `customer.subscription.resumed` clears all four.

**Why this is first:** a tenant locked by the grace cron who then pays through the Stripe portal gets `active` written over `locked` while `is_active` stays false. Login gating still blocks them, and the locked banner stops rendering because it keys on `status === 'locked'`. They have paid, the UI says active, and they can neither get in nor see why. Nothing else on this list fails at the exact moment of success.

**Fix:** make all three handlers write the same four fields `resumed` writes. ~1 hour.

### B2. The customer-portal error branch wipes a live customer's Stripe IDs
`app/api/stripe/customer-portal/route.ts:59-74`

Any `resource_missing` — a dashboard deletion, a key rotation, a test/live mode slip — triggers `update({ stripe_customer_id: null, stripe_subscription_id: null, subscription_status: 'inactive' })`.

**Why flagged:** Stripe keeps charging the orphaned subscription while the app believes the tenant has no billing, and routes them into a fresh checkout. Two live subscriptions, two charges. A destructive write on an error path with no confirmation and no audit row.

**Fix:** delete the wipe. Log the mismatch and let a human decide. ~30 min.

### B3. The DID route has no authentication and spends the shared balance
`app/api/voipms/dids/route.js` · `src/middleware.js`

Exports GET, POST and DELETE including `orderDID`, `assign` and `cancelDID`. `tenantId` and `did` come from the query string and body. Middleware matches `/api/:path*` but only runs telemetry on API routes — it never authenticates.

**Why flagged — verified live:** an anonymous GET to production returned **200** while `/api/admin/tenants` returned 403 and `/api/work-orders` returned 401. The response body was an error from *VoIP.ms*, not the app, proving the anonymous request reached the provider using server credentials. Every tenant shares one subaccount and one prepaid balance, so draining it takes SMS down for all of them at once.

Only a read-only GET was tested. Order, assign and cancel were deliberately not exercised.

**Fix:** platform-staff guard on all three verbs; derive tenantId from the session. ~1 hour.

### B4. Blocked SMS returns success and is stored as sent
`services/sms-gateway.js:294-297` · `api/webhooks/voipms/route.js:2072`, `:2131-2144`

The gateway returns `{ success: true, blocked: true }` for a suppressed send. The webhook branches on `.success` alone and inserts `status: 'sent'`.

**Why flagged:** under the deliberate per-order default-dry gate, every AI reply to a real homeowner is suppressed until that order is flipped live — yet the thread shows a delivered reply. The homeowner gets silence and support believes they were answered. This gates all other verification work: you cannot trust a live test until reporting is honest. **The gate itself is correct and must not be touched** — the reporting is the bug.

**Fix:** check `blocked` before claiming success; write `status: 'blocked'`. ~2 hours.

### B5. The inbound SMS webhook is unauthenticated
`app/api/webhooks/voipms/route.js:415-422` · `app/api/sms/webhook/route.js`

The secret check is commented out; the only gate is a User-Agent blocklist. A second route is an open forwarder into the same handler.

**Why flagged:** anyone knowing a tenant DID and a homeowner number can confirm an appointment or permanently opt a homeowner out. Both irreversible from the tenant's side, and the opt-out has no self-service undo.

**Fix:** shared secret in the callback URL, matching the email webhook pattern. ~1 hour.

### B6. Confirm the Stripe Live webhook URL
Stripe dashboard — no code change

The legacy endpoint now forwards rather than 410ing. But if it carries its *own* signing secret, the forward 400s and events die after roughly three days of retries.

**Why flagged:** five minutes, no code, and it is the difference between having a paying customer and not. The canonical handler is the only code that sets `subscription_status='active'`. Escape hatch if it has already bitten: `/api/admin/tenants/[id]/force-reactivate`.

---

## High

### H1. A routine Stripe event can end a PayCheck trial early
`api/webhooks/stripe/route.ts:802-840` — `syncVoucherAddonFeature()`

**Correction to an earlier version of this document:** the metadata-only trial bug is **fixed**. Trial start no longer attaches a billable Stripe item at all. Entitlement is granted locally (`features.voucher_addon = true`, `voucher_addon_billing_status: 'trial_pending_stripe'`) and `api/cron/voucher-trial-convert` attaches the $45 item only once the 30 days elapse. A customer is not charged during the trial.

What remains is subtler. `syncVoucherAddonFeature()` sets `features.voucher_addon` purely from whether a voucher price item currently exists on the subscription, unless the tenant is grandfathered. It does **not** check for `voucher_addon_billing_status === 'trial_pending_stripe'` — confirmed absent from that file.

**Why flagged:** during the 30-day local trial no Stripe item exists by design. So any unrelated `customer.subscription.updated` event in that window — adding an installer seat, toggling AI Pro — computes `stripeSaysEntitled = false` and silently revokes the trial. The tenant loses PayCheck mid-trial for doing something unrelated, and nothing tells them why.

**Fix:** treat `trial_pending_stripe` as entitled in the sync. ~30 min.

### H1b. The paywall advertises a 14-day PayCheck trial; the real one is 30
`lib/voucher-addon-gate.ts:59` vs `lib/stripe.ts:120`

The 402 body returned to a blocked API caller reads *"Start the 14-day trial to unlock PDF import, manual IMAP sync, and the audit dashboard."* `SUBSCRIPTION_MODEL.voucher.trialDays` is 30, and every trial-creation route uses 30.

**Why flagged:** understating your own trial by sixteen days is a self-inflicted conversion loss, and it is a one-word fix. ~5 min.

### H2. past_due and canceled are dead ends
`api/cron/grace-period/route.ts:108`, `:330` · `webhooks/stripe/route.ts:698-703`, `:403-406`

The grace cron only acts on `paused`. `handlePaymentFailed` writes `past_due` with no `is_active: false`, and nothing reads either state to gate access.

**Why flagged:** a declined card at trial end means indefinite free product. The 22-day lockout machinery only fires on the no-card path, so the paying-then-failing customer slips through. ~4 hours.

### H5. "Cancel my appointment" permanently opts the homeowner out
`api/webhooks/voipms/route.js:600`

The STOP guardrail anchors on `/^(stop|...|cancel|end|quit|...)\b/i`. `cancel`, `end` and `quit` are ordinary scheduling words.

**Why flagged:** a homeowner texting "cancel" to move a time slot is silenced permanently in that tenant's thread, before anything else reads the message. The tenant experiences it as their customer going dark for no reason, and may drive to an install that is not happening. No self-service undo, so every instance becomes a manual fix. STOP handling is otherwise correct — this is a regex scope problem. ~15 min.

### H6. Reply-engine routing is chosen by an arbitrary row
`api/webhooks/voipms/route.js:1830`

`sms_use_v2_fallback` is read with `.in('key', [...])` then `.find()` — no `tenant_id` filter. Every tenant gets its own row.

**Why flagged:** one arbitrary row decides V1-vs-V2 reply routing for every tenant. Harmless today with one tenant; live the moment tenant #2 exists, which is the definition of launch. Every other config read in that file is tenant-scoped. One line. ~15 min.

### H7. Inbound messages vanish when no work order matches
`packages/database/migrations/002_sheets_integration.sql:82` · `webhooks/voipms/route.js:1729`, `:2221`, `:2329`

`work_order_id` is `NOT NULL` and no migration relaxes it. The insert passes `workOrder?.id || null`, fails, is `console.error`'d, and execution continues.

**Why flagged:** if V2 Guardian then handles the message the route returns early and the rescue path never runs — the message exists nowhere. A homeowner wrote in and there is no record in any surface, so nobody can know it was lost. ~3 hours.

### H8. Support has no working queue for unanswered messages
`api/messages/unmatched` · `api/messages/count` · `webhooks/voipms/route.js:2324`, `:2602-2631`

`/api/messages/unmatched` filters on a status value written only by two dead files, so the tab is permanently empty. `/api/messages/count` counts `work_orders.contact_status`, not unread inbound. On LLM failure the row is stamped `guardian_failed` with no intervention and no alert.

**Why flagged:** the highest-leverage fix for Ashley's actual job. She owns support and is non-technical; the one screen that would show her a dropped homeowner shows nothing, always. It does not prevent a loss — it makes losses *visible*, which is what turns support from guessing into working. ~4 hours.

### H9. Unknown inbound numbers are filed under a random work order
`api/webhooks/voipms/route.js:2386-2400` — `.limit(1)`, no ordering, `placeholderSource: 'random_fallback'`.

**Why flagged:** homeowner A's text lands in homeowner B's thread, traced only in `activity_log`. Worse than losing the message, because it corrupts a second conversation and looks legitimate. ~1 hour.

### H14. No A2P 10DLC registration
`app/settings/page.tsx:1130-1132` — hardcoded `BU…`/`BN…`/`CM…` placeholders, Twilio-format IDs on a VoIP.ms stack. All tenants share one subaccount and one carrier reputation.

**Why flagged:** unregistered A2P traffic gets filtered by carriers with no bounce you can see, so it fails exactly like the blocked-SMS bug: silently. Calendar time, not engineering time — the paperwork takes weeks, which is why it belongs on today's list. The Twilio references elsewhere in config are stray; VoIP.ms is the live rail.

---

## The admin console

**The shared theme:** none of these crash. Every one reports success, or a state, that is not real. For an operator — especially a non-technical one — a console that lies is worse than one that is missing, because it produces confident wrong action.

**Platform Settings is theatre.** Trial length, default plan, maintenance mode and six feature-flag toggles are hardcoded literals, and the Save button has no `onClick`. An operator will change trial length, see it accept, and be wrong about their own product's terms. Cheapest honest fix is to hide the tab.

**Stripe connection badges are hardcoded.** "Connected" and "Webhooks Active" are literals, never probed. This is the one place you'd look to confirm billing is wired, and it says yes regardless — including in exactly the B6 scenario where no tenant can become paying.

**MRR reports revenue that does not exist.** `tenant_mrr_snapshots` reports $179 / 1 paid. That is Alpha Blinds, a mock tenant with no `stripe_subscription_id`. Real revenue is $0. It is the number a founder quotes to a bank.

**Invite user reports success and sends nothing.** `inviteUserByEmail` appears nowhere in the codebase. Only `/api/admin/staff` actually mails a link. The onboarding wizard's Team Setup does send correctly — the working path exists, only the admin one lies.

**No tenant impersonation.** What exists is view-as-installer *within* one tenant. "Walk me through what you're seeing" is the whole of support, and Ashley cannot see a customer's screen. A feature gap, not a bug, and it shapes what her role can be.

**2,144 feed items never render.** The tag is lower-case `dispatch` and is not in the admin feed's department list, so the largest queue in the system reads as empty. Rows carry a 7-day `expires_at` but nothing deletes them.

**Removing a user leaves the tenant billed for the seat.** The delete route never calls the seat sync, and the three routes that do are fire-and-forget with `console.warn` on failure. Support performs a routine action and silently overcharges the customer.

---

## Do this first

1. **Make payment actually unlock the tenant.** Launch is the first paying tenant, and today paying can lock that tenant out behind a UI that says active.
2. **Check the Stripe Live webhook URL.** Five minutes, no code, and it decides whether you can have a paying customer at all. Start it while #1 is being written.
3. **Delete the customer-portal ID wipe.** One block. Converts a transient Stripe error into a duplicate-billing incident.
4. **Lock down the DID route.** Confirmed anonymous in production. Highest damage per hour after the billing three.
5. **Stop logging blocked SMS as sent.** Gates all verification below it — you cannot trust a live test until reporting is honest.
6. **Fix or unadvertise the PayCheck trial.** Most probable refund-and-churn event, and it lands in week one.
7. **One 45-minute batch:** the `tenant_id` filter, the STOP regex, and auth on the destructive merge route. Three cheap fixes, one deploy.

---

## Provenance and limits

**Verified directly:** the DID route's missing auth (one read-only GET against production, compared with two guarded routes); the middleware's telemetry-only treatment of API paths; the trial-length values and their fixes; the deprecated webhook now forwarding; `tsc --noEmit` clean under `strict`.

**From agent audits, several of which queried the production database:** the payment-lockout path, the portal ID wipe, the SMS reporting and webhook auth gaps, the PayCheck trial, the feed backlog counts, the seat-sync gaps.

**Not independently re-verified:** some table names, row counts, and line numbers cited by those audits. Two agents over-claimed during this work and were caught — one asserted the terms page had no governing law when it does, another asserted findings before reading the files. Treat unverified line numbers as pointers, not gospel.

**Deliberately not done:** no `order`, `assign` or `cancel` call was made against the DID route — confirming the auth gap did not require spending money or destroying a phone number. No file in the repository was modified.
