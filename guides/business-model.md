# The Business Model

*Draft. Everything here is drawn from the code, the production data, and the formation documents. One open question is flagged at the end. 2026-09-10.*

This is the layer the role program derives from. Without it, tasks drift toward whatever is nearest — the codebase, the inbox, the bug list — and the program goes myopic.

## What the business is

**Crew2 field operations, on autopilot.**

An installer gets their work as rows in a Smartsheet handed down by Crew2. Today the owner reads that sheet, calls each homeowner at night to book a window, drives a route they planned in their head, and reconciles the payment vouchers by hand at 10pm.

GoTechGo takes the whole loop: orders sync in from the sheet, schedules build themselves, homeowners get texted and confirm, the day's route gets ordered, the installer works from a phone app, and the confirmed schedule writes back to Crew2. Twenty-eight scheduled jobs keep it running without anyone operating it.

That is the base product, and it is the business. The add-ons sit on top of it.

## Who pays

The **installer business** — not Home Depot, not the homeowner.

- 1–5 installers, owner-operated
- Home Depot window-treatment subcontractor
- Receives jobs through a Crew2 Smartsheet
- The owner installs alongside the crew and does the scheduling at night

Buyer and user are the same person. One decision-maker, no procurement, and $217/mo is a personal-checkbook decision.

## What they pay

| | Monthly | Annual |
|---|---|---|
| **Base** — includes 3 installer seats | $217 | $2,148 (~$179/mo) |
| Each active installer beyond 3 | $35 | $29/mo equivalent |
| PayCheck add-on | $45 | not offered |
| AI Pro add-on | $79 | $59/mo equivalent |

A 3-installer shop on base alone is **$217/mo**. A 6-installer shop with PayCheck is **$367/mo**.

The only real gate on the base plan is the **3 active installer seats**. The seven-key feature-flag system in the database is dead — it has zero enforcement sites and gates nothing.

## Why they pay

**The base earns its keep by taking back the evenings.** The scheduling, the calling, the confirming, the route planning, the writeback — all of it currently happens after hours, by hand, by the owner. That is the recurring reason to keep paying.

**PayCheck is why they choose you over Jobber.** It reconciles Crew2's payment vouchers against the work actually done and surfaces the gap. On real Go Blinds data it found **−$6,664.51** across 2,191 vouchers. At $45/mo that is roughly a 12× first-year return — *if it repeats for someone who is not you.* No generic field-service tool does this, because it requires knowing Crew2's voucher format specifically.

**AI Pro is insurance, not intelligence.** It does not upgrade the model. Base tenants get 1,000 AI requests per billing period; past that the system degrades to template replies rather than leaving homeowners unanswered. AI Pro removes the ceiling. The pitch is "your automation doesn't drop to templates in the last week of the month."

## The repeating unit

**One installer business at roughly $322/mo**, reached through the peer network or the Home Depot review corpus.

## Break-even

**N = ⌈ F ÷ ARPU ⌉** where F is the fixed monthly stack.

At a $500/mo stack: **2 tenants** at $322, or **3** at $217. This company does not need scale to survive. It needs two customers.

## The market

- **2,004** Home Depot stores in the dataset
- Crew2 covers roughly **300** — about **15%**
- So **~85% of HD stores** get window treatments from someone who is not Crew2

Crew2 is the beachhead because their voucher format is already parsed and their subs are reachable through the peer network. The rest is expansion, and each new aggregator costs a new parser.

**The product is single-vertical today.** Fourteen of fifteen service verticals in the picker are `comingSoon` with empty item lists and are refused server-side. Only Window Treatments is live. Any pitch beyond window coverings is a roadmap conversation, not a demo.

## What must be true — none of it tested yet

1. **Other installers are underpaid too**, not just Go Blinds. One data point exists and it is yours.
2. **The parser reads someone else's voucher** without hand-holding.
3. **An owner will pay $217+/mo** out of their own checkbook.
4. **Crew2 doesn't change their format.**

Assumptions 1 and 2 are testable this week with one peer and one voucher PDF. Assumption 3 needs a real conversation. Assumption 4 is not controllable — it is the bet you are carrying.

## What kills it

**Crew2 concentration.** There is no Home Depot API. Crew2 owns the row you read, and the integration is hardcoded to their specifics: the voucher PDF parser, the `donotreply@crew2.com` inbox hunt, SKUs IB31A1 and IO50A1, and the convention that Crew2 deletes the Smartsheet row once it sees a confirmed schedule.

If Crew2 changes columns or voucher layout, ingestion, writeback and PayCheck break at once. The mitigation is not avoidance — it is knowing this is the bet, and reaching a second aggregator before the first one moves.

## Where the money currently is

**Zero paying tenants.** Real revenue is $0. The one production tenant is Go Blinds Gold, the founder's own installer business. Alpha Blinds is a mock.

Launch is **the first paying tenant that is not Go Blinds Gold.**

## The open question

**Which half do you lead with in a first conversation?**

Not "which is the product" — the base plainly is. The question is narrower and it is a sales question.

*Lead with PayCheck:* provable in dollars on day one, no competitor replicates it, and it opens with money the prospect is already owed rather than software they have to adopt.

*Lead with the operations:* it is what they use every day, it is what the onboarding configures, and it is the habit that makes the tool stick. PayCheck then lands as the bonus that closes.

This decides which assumption gets tested first, what the first call opens with, and which half gets engineering attention before launch.

**Awaiting Ezra's call.**
