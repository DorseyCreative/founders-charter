# Customer Success Manual — GoTechGo

*Read from the running code and the production database, 2026-09-10. Ashley's lane.*

## 1. The health score, in plain English

Every active tenant gets a 0–100 engagement score once a day (`lib/tenant-lifecycle-engine.ts`). Six inputs, each capped:

| Input | Window | Full marks at | Points |
|---|---|---|---|
| Work orders created | 30 days | 20 orders | 30 |
| Outbound customer messages actually sent (dry runs don't count) | 30 days | 30 messages | 15 |
| Features switched on | — | 7 features | 15 |
| Page views | **7 days** | 50 views | 20 |
| Distinct days with any activity | 30 days | 15 days | 10 |
| Onboarding marked finished | one-time | — | 10 flat |

Two things to hold onto. **Page views are the only 7-day input**, so 20 of the 100 points swing on whether someone logged in this week — a good customer on holiday looks like a falling customer. And the engine also recomputes the score **as it stood 14 days ago**. That pair, not the raw number, drives the stages.

## 2. The six stages

Checked in order, first match wins:

1. **dormant** — zero page views in 7 days AND zero orders in 30 AND zero active days in 30. Total silence.
2. **at_risk (falling)** — score dropped **30% or more** vs 14 days ago.
3. **onboarding** — never finished setup.
4. **power_user** — score **above 60** and not declining.
5. **active** — score **30 or above**.
6. **developing** — setup done, under 30, account **younger than 60 days**.
7. **at_risk (catch-all)** — setup done, under 30, account older than 60 days.

Order matters: total silence reads as *dormant*, never *at_risk*. A tenant still in setup reads as *onboarding* whatever the number.

## 3. Stage → action (starting point — edit this)

| Stage | How fast | Channel | What to say |
|---|---|---|---|
| **onboarding** | Within 24h of a stall | Email, phone on 2nd try | "I saw you stopped at [step]. Want me to finish it with you on a 15-minute call?" |
| **developing** | Weekly, light | Email | One concrete next step, not a check-in. |
| **active** | Monthly | Email | Ask what they'd change. Nothing to fix. |
| **power_user** | Within a week | Personal email from the founder | Ask for a testimonial or referral. The only stage where CS makes money instead of saving it. |
| **at_risk** | **Same day** | Email, phone within 48h | Name the specific thing that stopped. "Something changed two weeks ago — can I look at it with you?" |
| **dormant** | Within 2 days, then stop | One email, one call, then leave it | "Your workspace is exactly where you left it." |

**Reasoning you're allowed to reject:** speed is weighted toward *at_risk* over *dormant* because a falling customer is still reachable and a silent one has usually already decided. If practice says otherwise, flip it.

**Critical rule:** snoozing or dismissing on `/admin/tenant-success` makes the automation stand down on that concern. Use it every time you take something on personally, or the robot emails the owner the day after you did.

## 4. Trial → lock timeline (cron times UTC)

| When | What fires |
|---|---|
| Signup | `trialing`, `trial_ends_at` = **now + 30 days** |
| Billing step completed | Stripe creates a **14-day** trial; webhook **overwrites** `trial_ends_at` |
| 7 days left | "How is the trial going?" email |
| 3 days left | Stripe `trial_will_end` + bulletin — 2 emails + SMS |
| 1 day left | Email + SMS |
| Trial ends, no card | Stripe pauses, `grace_ends_at` = +7 days. Access unchanged. |
| Grace 5/3/1 | Countdown email to customer + alert to alerts@gotechgo.co |
| Grace expires | Hard lock (`is_active=false`). Emails + critical CS feed item. |
| Card added anytime | Resumes instantly, grace and lock cleared |

**Step in at:** 3 days left with no card (highest-value call anyone here makes), the *first* grace alert not the last, and lock day — a lock is a conversation, not a failure.

### The 30-vs-14 problem, and the silent hole

The countdown banner reads `trial_ends_at`. At signup it says 30 days. The moment they finish the billing step Stripe's 14-day trial overwrites it and **their countdown visibly shrinks by two weeks in one refresh**, with nothing explaining why.

Worse: a customer who **never finishes the billing step** has no Stripe subscription, so pause / grace / lock never runs. They still get reminder emails — firing on the 30-day clock but saying "your 14-day trial" — then on day 30 the app simply blocks them. No pause, no grace, no lock notice, **and no alert to us.** They just disappear.

**Watch for:** any tenant `trialing` with no Stripe subscription ID nearing day 30, and any customer who says their trial got shorter.

## 5. The department feed

`department_feed_items` is one row per thing someone should look at. Written every morning 07:00 UTC by `daily-tenant-intelligence`.

Yours: **`engagement_drop`** (score fell 15%+; critical at 30%+) and **`lifecycle_at_risk`**. Adjacent: `trial_expiring` → Finance if score >30 else Growth; `onboarding_stall` → Growth; `lifecycle_exhausted` → every automatic email spent without resolution, which is a direct request for a human.

Read it at `/admin/ai-insights`, but work your day from `/admin/tenant-success` — it collapses the same signals per account and its snooze/dismiss is what silences the automation.

**Live backlog 2026-09-10:** 63 unresolved CS items, oldest 2026-07-12 (27 critical drops, 33 at-risk, 3 high). By tenant: Alpha Blinds 43, MotoMamma 12, Evanesce 8. Rows carry a 7-day `expires_at` but nothing deletes them — the queue only shrinks when a person clears it.

## 6. Five exercises for this week (no customers required)

Practise on **Go Blinds Gold** (founder's own) and **Alpha Blinds** (mock).

1. **Score them by hand.** Work out both scores on paper from §1, compare to the system. *Produces:* a health-score worksheet for explaining a drop to a customer.
2. **Clear the Alpha Blinds backlog.** 43 items. Decide each: real, stale, or duplicate. *Produces:* a written triage rule and the first clean queue this company has had.
3. **Walk the trial clock.** Trace Evanesce and MotoMamma through §4 and write what each owner would have received, and when. *Produces:* a customer-eye timeline and every point the 30/14 drift confuses people.
4. **Write the six stage emails in your own voice.** The automated copy exists in the codebase; read it, then write yours. *Produces:* a template pack that replaces guessing at 9pm.
5. **Run one round for real.** Work Go Blinds top to bottom on `/admin/tenant-success` and time yourself. *Produces:* the day-one CS runbook.
