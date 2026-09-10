# The Business Model

*Draft — one open question, flagged below. Everything else is drawn from the code, the production data, and the formation documents. 2026-09-10.*

This is the layer that was missing. Without it, every role's tasks drift toward whatever is nearest — the codebase, the inbox, the bug list — and the program goes myopic. Roles derive from this. Not the other way round.

## What business this is

You recover money installers are already owed but never collect, and you schedule the work that generates it.

**PayCheck** reconciles Crew2's payment vouchers against the work actually done and surfaces the gap. **Scheduling** runs the day — proposals, confirmations, routes, arrival windows.

## Who pays

The **installer business**. Not Home Depot, not the homeowner.

- 1–5 installers, owner-operated
- Does Home Depot window-treatment work as a subcontractor
- Receives jobs through a Smartsheet handed down by Crew2 (Interior Logic Group)
- The owner installs alongside the crew and does the scheduling at night

The buyer and the user are the same person. One decision-maker, no procurement, and $217/mo is a personal-checkbook decision.

## What they pay

| Component | Monthly | Annual |
|---|---|---|
| Base — includes 3 installer slots | $217 | $2,148 (~$179/mo) |
| Each installer beyond 3 | $35 | $29/mo equivalent |
| PayCheck add-on | $45 | not yet offered |
| AI Pro add-on | $79 | $59/mo equivalent |

A 6-installer shop with PayCheck: **$367/mo**. A 3-installer shop on base alone: **$217/mo**.

## Why they'd pay

PayCheck found **−$6,664.51** of real underpayment across 2,191 vouchers on Go Blinds data. At $45/mo, that is roughly a **12× return in the first year** — *if it repeats for someone who isn't you.*

The secondary value is the owner's evenings. Today they reconcile vouchers by hand at 10pm and call customers to book installs. Both are automatable and neither is why anyone got into the trade.

## The repeating unit

**One installer business at roughly $322/mo**, reached through the peer network or the Home Depot review corpus.

## Break-even

**N = ⌈ F ÷ ARPU ⌉** where F is the fixed monthly stack.

At a $500/mo stack: **2 tenants** at $322, or **3** at $217. This is not a company that needs scale to survive — it needs two customers.

## The market

- **2,004** Home Depot stores in the dataset
- Crew2 covers roughly **300** of them — about **15%**
- So **~85% of HD stores** get window treatments from someone who is not Crew2

Crew2 is the beachhead because their voucher format is already parsed and their subs are reachable through the peer network. The rest of the market is the expansion, and each new aggregator costs a new parser.

## What must be true — none of it tested yet

1. **Other installers are underpaid too**, not just Go Blinds. One data point exists and it is yours.
2. **The parser reads someone else's voucher** without hand-holding.
3. **An owner will pay $217+/mo** out of their own checkbook.
4. **Crew2 doesn't change their format.**

Assumptions 1 and 2 are testable this week with one peer and one voucher PDF. Assumption 3 needs a real conversation. Assumption 4 is not controllable — it is the risk you carry.

## What kills it

**Crew2 concentration.** There is no Home Depot API. Crew2 owns the row you read, and the integration is hardcoded to their specifics: the voucher PDF parser, the `donotreply@crew2.com` inbox hunt, SKUs IB31A1 and IO50A1, and the convention that Crew2 deletes the Smartsheet row once it sees a confirmed schedule.

If Crew2 changes columns or voucher layout, ingestion, writeback, and PayCheck all break at once. Mitigation is not avoidance — it is knowing this is the bet, and expanding to a second aggregator before the first one moves.

## Where the money currently is

**Zero paying tenants.** Real revenue is $0. The one production tenant is Go Blinds Gold, the founder's own installer business. Alpha Blinds is a mock.

Launch is defined as **the first paying tenant that is not Go Blinds Gold.**

## The open question

**Is PayCheck the wedge and scheduling the retention, or the reverse?**

The case for PayCheck first: it is provable in dollars on day one, no competitor in field-service software does it, and it is the only thing here a generic tool cannot copy in a quarter.

The case for scheduling first: it is what the product mostly *is* by volume of code, it is what the onboarding wizard configures, and it is the daily habit that makes the tool sticky.

This decides what CEO, Product, and Sales are actually for. It is not a marketing choice — it changes which assumption gets tested first, what the first sales conversation opens with, and which half of the product gets engineering attention before launch.

**Awaiting Ezra's call.**
