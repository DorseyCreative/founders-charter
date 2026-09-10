# Support Handbook — GoTechGo

*Ashley's lane. Assembled from code research, 2026-09-10.*

## First: there are two different "customers"

This trips everyone up, and getting it wrong sends you to the wrong screen.

- **Our customer = the tenant.** The installer business that pays us $217/mo. Ezra's peers. **These are the only people who will ever contact you.**
- **Their customer = the homeowner.** The person who bought blinds from Home Depot and receives the appointment texts. **A homeowner will never call you** — they call Home Depot or the installer.

So every question below is phrased the way a *tenant* would say it, even when the problem happened to a homeowner. When a tenant says "my customer," they mean the homeowner.

Opt-outs, texts, and arrival blocks all belong to the homeowner. Trials, logins, vouchers, and billing all belong to the tenant.

## Six corrections to get right before anything else

1. **PayCheck is not installer pay.** It is Crew2/Home Depot **voucher reconciliation for the company** — what Crew2 actually paid versus what the work was worth. **Owner + super_admin only.** Installers, managers, and even tenant admins cannot see it.
2. **The PayCheck add-on is $45/mo after a 30-day free trial, no card required.** There is no $15/mo tier anywhere in the code.
3. **Reconciliation matches on base WA** (e.g. `WA588856`) — never on `-N` sub-orders, never on `work_order_id`.
4. **There are two "Reconciliation" screens.** `/accounting` → *Reconciliation* tab is a dead placeholder showing `--`. The working one is `/accounting/paycheck`.
5. **There is no tenant impersonation.** Only owner/admin "view as installer" *inside* one tenant. You cannot see a customer's screen — ask them to share it.
6. **There is no work-order import queue and no email-to-order parsing.** Orders arrive via Smartsheet sync or manual entry only.

## Glossary

**Work order** — one installation or service job for one customer, identified by its base number (`WA588856`). If a job splits into multiple visits each piece gets a `-N` suffix, but PayCheck always collapses back to the base WA. Lives in Pipeline, Dispatch, and the installer app.

**WA** — the Home Depot / Crew2 work-authorization number. GoTechGo's primary key for a job. Always quote the base number when looking anything up.

**Proposal** — the appointment time the system offers a customer by text before it's confirmed. Sits in Pipeline until they accept, decline, or ignore.

**Blast** — a batch text to many customers at once carrying proposed times. **Settings → SMS Blast**.

**Dry run** — a tenant-wide safety switch (`orchestrator_dry_run`) blocking real texts and Smartsheet writeback so a tenant can test without touching real customers. A single order can be flipped live with a per-order `bypass_dry_run` toggle. **Never disable that toggle to "fix" something** — it's the one lever that lets a specific message go out for real while the rest of the tenant stays in test. Status at **Settings → Dry-Run Summary**.

**Intervention** — the "stop and let a human look" flag on an order, raised when automation isn't confident. It's a flag on the order, not a status label — check the order itself, not a filter dropdown.

**Guardian** — the automated texting brain that reads customer replies and decides what to do. Lives at `/guardian` with Dashboard, Conversations, Escalations, Templates, Training.

**Dispatch / Command Center** — the day-of job board at `/dispatch`. Installers see their slice at `/installer/dispatch`.

**Pipeline** — the master order list at `/pipeline` showing every order's status and dry-run state. The "everything about this order" screen, distinct from Dispatch.

**Territory** — the geographic zone a store's orders group into. Set during onboarding.

**Store grouping** — how orders from different Home Depot store numbers bundle for one installer or route. **Settings → Store Grouping**.

**Arrival block** — the window promised to the customer (`confirmed_arrival_block`). What the customer thinks of as "my appointment."

**Geofence** — the location trigger detecting when an installer arrives at or leaves a job site.

**Voucher** — Crew2's payment document for a completed job. The actual "did we get paid" record.

**PayCheck** — the owner-only reconciliation tool at `/accounting/paycheck`. Three views: Discrepancies, Awaiting, Mileage.

**Discrepancy** — a mismatch between what a voucher paid and what the job should have paid.

**Chargeback** — Crew2 clawing back money already paid. Shows as a negative adjustment tied to a WA.

**Smartsheet sync** — the pull of orders from the tenant's Smartsheet. Every 15 minutes, on webhook, or via Sync Now. **A stale or expired connection raises no error and no alert** — check it first.

**Writeback** — the push the other way, writing schedule info back to the Smartsheet row. Stamps `smartsheet_writeback_at` only on success; a failure retries every 30 minutes and shows no alert.

**Row adoption** — matching an inbound Smartsheet row to an order already known by WA, rather than creating a duplicate.

**DID** — the tenant's dedicated texting number. What customers see and reply to.

**Installer PWA** — the mobile app at `/installer`. Installers are route-locked and cannot reach admin screens.

**Route / reoptimize** — the day's driving order; reoptimize recalculates it after a change.

**Confirmed order** — `contact_status` is literally `confirmed`. The customer accepted a specific time.

**Opt-out** — a customer unsubscribed from texts. Enforced by a hard keyword filter before anything else touches the message. Absolute, but over-broad (see Q9).

## Aging tiers — two vocabularies, don't confuse them

**Discrepancy aging** (days since the WA's latest voucher): under 14 = `new` (normal pay cycle, don't chase) · 14–29 = `aging` · 30+ = `escalate`.

**Awaiting payment:** **Escalate** 30+ days no payment · **Flagged** 21–29 days, past two cycles · **Waiting** 14–20 days, one cycle overdue.

## Top 20 support questions

**1. "My customer never got a text."**
Could be a real send failure, or a blocked send lying about being sent — suppressed texts are recorded as `status: 'sent'`, so the thread looks normal when nothing went out. Check the order's message thread in Pipeline. If it shows a send and the customer swears otherwise, check whether they opted out. *Pipeline → order → message history.*

**2. "The text had the wrong appointment time."**
Compare the `confirmed_arrival_block` on the order against what Smartsheet last had. These drift when a reschedule doesn't sync back cleanly. *Pipeline → order detail, vs the Smartsheet row.*

**3. "The customer replied and nothing happened."**
Two known causes: the reply auto-opted them out because it contained "cancel", "end", or "quit" (see Q9); or the inbound message failed to match a work order and vanished — the unmatched-messages screen is permanently empty and won't show it. *Guardian → Conversations for that number.* If nothing's there and it isn't an opt-out, escalate.

**4. "This order is on the Home Depot list but not in GoTechGo."**
Orders arrive only by Smartsheet sync or manual entry — there is no email path. Try Sync Now. If it still doesn't appear, the Smartsheet connection may have quietly expired, which throws no error. *Check last successful sync time.*

**5. "I updated the schedule but Smartsheet still shows the old time."**
Writeback failed silently. It retries every 30 minutes — first ask whether 30 minutes have passed. If yes and it's still wrong, it's genuinely stuck. *Check `smartsheet_writeback_at` on that order.*

**6. "The installer can't see a job on their phone."**
Confirm it's actually assigned to that installer and on today's dispatch, not sitting unscheduled in Pipeline. Also confirm it isn't stuck in dry run without `bypass_dry_run`. *Dispatch → assignment, then the installer's schedule tab.*

**7. "The voucher amount doesn't match."**
That's what PayCheck's Discrepancies tab is for. **Search by base WA** — a `-N` sub-order or internal ID matches nothing. *`/accounting/paycheck` → Discrepancies.*

**8. "The customer says they never confirmed, but it shows confirmed."**
Read the actual thread for a reply that could have been read as confirmation, and check whether it came from elsewhere (manual entry, Smartsheet). Read the thread, not the status badge.

**9. "My customer went silent on us — they texted asking to move the appointment and now they don't get anything."**
The known opt-out bug. The homeowner texted something like "cancel" or "quit" meaning *cancel this time slot*, and the STOP filter fired on the word before anything else read the message. That homeowner is now permanently opted out of **this tenant's** texts. They aren't ignoring the installer — they stopped receiving. **There is no self-service undo.** Confirm the opt-out on that phone number, warn the tenant to phone the homeowner directly for this appointment, then escalate to Ezra to reverse it. Do not try to re-text around it.

**10. "PayCheck looks clean but something feels off."**
A clean week can hide a chargeback that landed after the week closed, or a mismatched WA. Don't treat "zero discrepancies" as proof — spot-check a couple of WAs by hand. *Discrepancies + Mileage, cross-checked against Smartsheet for the same dates.*

**11. "My free trial ended sooner than I expected."**
PayCheck's trial is 30 days from first activation. Most likely it started the day they first opened PayCheck, not the day they started using it. *`/admin/tenant-success` → tenant detail shows trial/grace and can extend grace.*

**12. "I can't log in / my account says locked."**
*`/admin/tenant-success` → tenant detail panel* — force lock, force reactivate, and extend grace all live there.

**13. "The installer got a notification for a job that isn't theirs."**
Almost always misconfigured territory or store grouping. *Settings → Store Grouping; Territories.*

**14. "We texted them at a weird hour / too many times."**
Check the blast history for that send and whether dry run was engaged — a live send during what should have been a test looks exactly like this. *Settings → SMS Blast history; Dry-Run Summary.*

**15. "The window on the text doesn't match the installer's app."**
Compare the arrival block on the order against Dispatch. Same field, but a partial reschedule leaves them out of sync.

**16. "The customer wants to switch their appointment — can you?"**
Yes, normal use. Just check whether the tenant is in dry run before assuming the proposal text will actually go out.

**17. "Is this number on our do-not-text list?"**
Check opt-out status on the customer. Remember it may have been set by accident via Q9 — an opt-out doesn't always mean the homeowner asked for one.

**18. "The route shows a job that was already cancelled."**
The cancellation landed but the route wasn't reoptimized. *Dispatch → trigger reoptimize for that installer's day.*

**19. "We're missing a whole day of new orders."**
A sync problem, not data entry — no orders arrive by email. Check last successful sync before anything else.

**20. "A text came from a random number, not us."**
Confirm the tenant's assigned DID is what's configured, and that they aren't confusing it with a personal cell someone texted from manually.

## Triage ladder

When someone says "it's broken" with no detail, work these in order. Stop as soon as one narrows it enough to act.

1. **"Is this about a message, a schedule, or money?"** — splits it into Guardian/Pipeline, Dispatch/Pipeline, or PayCheck, and tells you which screen to open.

2. **"Which order — do you have the WA number?"** — rules out whole-system panic. Almost everything is diagnosable one order at a time. No WA yet means find it in Pipeline by name or phone first.

3. **Messaging: "Open the thread — does it show a text going out, and is the number opted out?"** — A "sent" message with a real complaint of nothing arriving points at the blocked-send bug. Opted-out points at Q9 — the homeowner was silenced by a keyword, not ignoring the installer. Neither, and the reply is genuinely missing — that's the unmatched-message bug, which you cannot diagnose further. **Escalate immediately.**

4. **Schedule: "Does the arrival block match what Smartsheet shows?"** — Match means the problem is downstream (installer's phone, customer expectation). Mismatch narrows to a stuck writeback (check the 30-minute retry) or a stale sync.

5. **Money: "Look up the base WA in PayCheck — does Discrepancies show anything?"** — A specific line-item mismatch gives you the answer to relay. Nothing shown but the tenant insists otherwise: the tool's "clean" isn't proof. Flag it rather than declaring it fine.

6. **"Is this tenant in dry run, and is `bypass_dry_run` on for this order?"** — Ask this for *any* "nothing happened" complaint before concluding it's a bug. Dry run with the toggle off is working exactly as designed. Explain, don't fix.

7. **"Did this start after a specific action — a reschedule, a manual Smartsheet edit, a sync, a blast?"** — turns a vague complaint into a reproducible one, which is what Ezra needs.

**Escalate to Ezra when:** the unmatched-message screen is your only lead; the customer needs a manual un-opt-out; writeback is stuck past its 30-minute retry with no explanation; or you've worked steps 1–6 and still can't explain it.

**Hand him:** the WA number(s), which steps you ruled out and what you saw at each, the tenant name, and roughly when it started. Then stop. A clear "here's what I checked" beats a longer investigation with no conclusion.

## "Why didn't this happen?" — quick causes

**Order never imported:** row has no identity at all (no WA#, PO#, customer, phone, address) and is skipped until one is entered · Smartsheet token expired (no error, no alert) · no sheet selected, or Sync Mode is Manual · row previously deleted · store not in the tenant's territories.

**Schedule never went back:** dry run on and order not flipped live · customer hasn't verified · Crew2 deleted the row (raises an intervention) · no sheet configured or writeback disabled.

## Who can see what

**Installers** are route-locked to `/installer`. Everything else redirects.
**Managers** are deliberately locked out of all AI/automation settings — Guardian, orchestrator, routing, automations, messaging, integrations, security, billing.
**Owner-installer fusion:** an owner who also installs keeps `role='owner'` and sets `installer_settings.is_active_installer = true`. This does not downgrade them.

## Your tools

| Tool | Where | For |
|---|---|---|
| **Tenant Success** | `/admin/tenant-success` | The best support screen in the app. Per-tenant automation board, plain English. Snooze/dismiss silences the automation. |
| **Activity Log** | `/settings?section=activity` | Invites, status changes, removals. No super-admin needed. |
| **Admin** | `/admin` | Force lock/reactivate, extend grace, per-tenant add-on toggle. |
| **Message Center** | `/admin/message-center` | Tenant outreach and issue resolution. |
| **Voucher Import Log** | `/accounting` → Import Log | Per-voucher history, duplicates, errors, WO links. |
| **Dry-run summary** | `/settings/dry-run-summary` | What automation *would* have done. |

## Known traps

- `/accounting` **Payments and Reconciliation tabs are dead stubs** showing `$0` and `--`.
- **Guardian Statistics tiles in Settings show `--`** — also stubs.
- **Voucher sync has burned a 7½-month silent failure before.** If a tenant says "no discrepancies," verify ingest is actually running before believing it.
