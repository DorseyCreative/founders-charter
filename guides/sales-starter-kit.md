# Sales Starter Kit — GoTechGo

*Built from `hd_installer_research.md`, `crew2_installer_contacts.txt`, and `home_depot_stores.csv`. No invented contacts or figures. 2026-09-10.*

## 1. What we already have — and it's warm

**Provenance matters here.** These came out of Ezra's own Gmail: a filter for `@crew2.com` senders on threads with >4 recipients, surfacing **49 blasts spanning May 2019 → May 2026**. The contacts are Ezra's **peers** — Crew2 window-treatment subs CC'd alongside him on the same emails from the same PMs. That is not a cold list.

**Present:** display name (sometimes), email, blast count, every date/subject the address appeared on.
**Missing:** phone, legal entity, address, crew size, HD store assignment, whether still active.

Deduping 65 raw addresses (dropping ~40 crew2 staff, 3 homedepot.com, donotreply, a mangled row, and Ezra) leaves **~20 outside installer businesses**.

**Ten already carry a business identity:** ULS Built / Ultimate Living Spaces, Midwest Plantation Shutters, TG Blinds LLC, Harper Group, TJ's Installations, Pintor Shutters, Contender Contractors, plus `wtinstallation@`, `wayneinstalls@`, `theinstallerwt@`.

**Recency splits the list cleanly:**

- **Active on the 2026 blasts:** Jacob Gerlich / ULS Built · Andy Skeels · Nathan Shellito · Allen Freiermuth · Terry Lind · Contender Contractors · Tyler Marshall · `golferbits@` · Trevor Greil / TG Blinds (last Mar 2025)
- **Lapsed since 2023–24:** Jose Hector Pintor · Bryan Von Bruenchenhein · Wayne Rial · Alan Brown · William Koen · Perry Peterson · Mike Naughton · Josh Wright · Lucas Spivey · Joshua Nicoson · `lennyth1212@att.net`

One flag: Allen Freiermuth appears once as `@crew2.com` (Sep 2024), then as gmail in 2025–26. He may have gone in-house and come back out. Ask, don't assume.

**Geography:** Upper Midwest only — WI (Wausau, Neenah/Appleton, Kronenwetter, Franksville, Madison), IL (Spring Grove), IN (LaPorte, Avon, Indianapolis).

**Verdict:** as a prospect *database*, unusable. As a **first-ten-calls list, it's the best asset in the building** — every one is a confirmed Crew2 WT sub, paid off the same vouchers, and several already know Ezra's name from a shared CC line.

## 2. The target map

**Tier 1 — Home Depot itself.** `THD At-Home Services, Inc.` HD grants national category exclusivity. **Not sellable** — HD doesn't buy software from a one-man shop.

**Tier 2 — the aggregators.**

| Provider | Coverage | Window treatments? |
|---|---|---|
| **Crew2** (Interior Logic Group) | ~300 HD stores, 17 states. Minneapolis HQ; Milwaukee, Pewaukee, KC, Des Moines, SLC, Indianapolis | **Yes** |
| **Rockwood Shutters** (Houston) | ~900 stores, 35 states | **Yes** — shutters manufactured, blinds as a Hunter Douglas dealer |
| **ACC Home Remodeling** | MI, IN, MO, FL, GA, AL | No — cabinets, closets, windows |
| **Romanoff Renovations** | 32 offices, 13 states | No — flooring |
| **Pinnacle Window Coverings** | SoCal | HD relationship unconfirmed — do not contact as an HD provider |

**Tier 2 is intelligence, not pipeline.** Rockwood employs its design layer directly and runs its own certification program — they'd build, not buy. Crew2 is Ezra's own middleman; selling to them is a conflict.

**Tier 3 — the long tail. This is the market.** HD's own recruiting copy: *"Most Service Providers are companies with one-to-two crews."* The CSV holds **2,004 HD stores**; Crew2's ~300 is ~15%, meaning **roughly 85% of HD stores get window treatments from someone who isn't Crew2** — mostly 1–5 person owner-operated shops. Exactly the ICP.

The 3-hour arrival window is **contractual** in the HD Service Provider Agreement, which is why GoTechGo's 8-11 / 11-2 / 2-5 blocks already speak their language.

## 3. Building the list — legitimate paths only

**Do this first, it's free and highest-confidence.** The original mailbox filter was `@crew2.com` sender AND >4 recipients. Widen it: *any* email where a crew2.com address co-occurs with any non-crew2 address, at any recipient count. Then mine attachments — work orders and sign-off sheets carry installer names. Expected to roughly double the 21, at zero cost and zero risk, from Ezra's own mailbox.

**Then enrich what you have:**

- **Secretary of State** business search (WI/MN/IL offer free bulk download) → legal entity, registered agent, address.
- **Google Places API** for phone and website. The API, not scraping.
- **Shovels.ai** — 2,750+ jurisdictions, 3.55M contractors with phone/email/website, searchable by name, city, and specialty. Paid, and the fastest name→phone conversion.
- **BuildZoom** for vetting an individual sub; **CSLB Public Data Portal** for California in bulk.
- **Manufacturer dealer locators**, Hunter Douglas especially — HD-channel providers must be authorized dealers, so these locators are effectively a published roster.
- Join each candidate ZIP to `home_depot_stores.csv` for the nearest store number.

**Compliance, briefly:** public business contact info only. Cold email to business addresses is fine under CAN-SPAM with a working opt-out. **Cold SMS to cell numbers is the real exposure under TCPA — keep SMS out of first contact.** Don't scrape LinkedIn or Facebook; that risk lands on Ezra's personal account.

## 4. Qualifying questions

1. "Who's sending you your work these days — straight from the store, or through Crew2 or somebody like that?"
2. "How many guys you got hanging blinds right now — just you, or you running a couple trucks?"
3. "Do they push your jobs to you on one of those Smartsheet things, or is it still emails and phone calls?"
4. "You ever go through a voucher and find a job you know you did that just isn't on there — or one where the number's lower than what you quoted?"
5. "Who's doing the calling to set up your installs — you doing that yourself at night, or you got somebody?"

**Fit signal:** aggregator work + 1–5 installers + Smartsheet + a yes (or a pause) on Q4 + the owner answering Q5 with "me, at night."

## 5. The opener

**Email**

> **Subject: the vouchers**
>
> Hey [Name] —
>
> Ezra Dorsey. I do window treatment installs through Crew2 out of Milwaukee. You and I have been on the same emails from Dianna and Nikki for a while now.
>
> Reason I'm writing: I got tired of going through the payment vouchers line by line at 10pm trying to figure out if I got paid for everything. So I built something that pulls the voucher in, matches every line back to the work order, and tells me what's short and what got charged back.
>
> Spits out a one-page summary once a week. I forward it straight to my PM. Takes the argument out of it — it's just the list.
>
> If you're reconciling those by hand too, I'd like to show it to you. Fifteen minutes, and if it's not useful you tell me so.
>
> — Ezra, Dorsey Creative Concepts / GoTechGo
> [phone] · reply STOP and I won't email again

**Voicemail (~20 sec)**

> Hey [Name], Ezra Dorsey — I do blinds for Crew2 out of Milwaukee, we've been on the same email blasts. Quick reason for the call: I put together something that reads the payment vouchers and shows you which work orders came up short. Found money on my own I'd never have caught by hand. Figured you deal with the same thing. Give me a ring at [number] — no big deal either way. Thanks.

**SMS** — only to someone who already knows Ezra, or after they've replied to an email. Never to a cold cell.

> Ezra Dorsey — I hang blinds for Crew2 out of Milwaukee, been at it since 2019. Built something that reads the voucher PDF and flags the WOs they shorted you on. Found real money on mine. Worth 5 min?

## 6. First 10 calls

**Group A — active Crew2 WT roster. Same PM, same voucher format, warmest possible.**

| # | Who | Handle | Why | Success = |
|---|---|---|---|---|
| 1 | Jacob Gerlich / ULS Built | `support@ulsbuilt.com` | 27 blasts, most of anyone. Runs a *separate scheduling inbox* — proof of a dispatcher and multiple installers. Real domain. | 15-min screen share on a live voucher. Design partner #1. |
| 2 | Terry Lind / TJ's Installations | `terrylind@sbcglobal.net`, `tjsinstallations@att.net` | 33 blasts across two addresses, 2019→2026. Longest-tenured sub in the set. | Phone number + yes to "send me next week's report." |
| 3 | Nathan Shellito | `nathanshellito@gmail.com` | 11 blasts, on April *and* May 2026 | Answers Q1–Q5. Fit or no-fit, recorded. |
| 4 | Andy Skeels | `andyskeels@gmail.com` | 9 blasts, active 2026 | Same. |

**Group B — has a company identity, easy to find a phone for.**

| # | Who | Handle | Why | Success = |
|---|---|---|---|---|
| 5 | Trevor Greil / TG Blinds LLC | `trevorg@tgblindsllc.com` | Named LLC with its own domain — clearest 1–5 shop in the file | Live call. Still on the roster? |
| 6 | Contender Contractors | `contendercontractors@icloud.com` | On both 2026 blasts. Name suggests multi-trade | Qualify crew size before pitching |
| 7 | Tyler Marshall | `theinstallerwt@gmail.com` | "WT" in the address. Newer sub (2 blasts, 2025–26) | Discovery only — learn how new subs get onboarded |
| 8 | Bryan Von Bruenchenhein / Midwest Plantation Shutters | `info@midwestplantationshutters.com` | Real business, lapsed after 2021 | Find out **why he left**. Worth more than the sale. |

**Group C — lapsed, research calls.**

| # | Who | Handle | Success = |
|---|---|---|---|
| 9 | Jose Hector Pintor / Pintor Shutters | `pintorshutters@live.com` | 19 blasts then gone. Did he move to another aggregator? If so, **name it** — that's a new Tier-2 lead. |
| 10 | Wayne Rial | `wayneinstalls@gmail.com` | Solo operator, dropped off after 2024. Tests whether a true one-man shop will pay $217/mo. Either answer matters before pricing is set. |

**Run order:** email all ten Monday morning. Look up phones for 1, 2, 5, 8 that afternoon via SoS + Google Places. Call Tuesday–Wednesday. Voicemails, don't chase more than twice.

## Week-one success

Not ten sales. **Three live conversations and one screen share of PayCheck against someone else's real Crew2 voucher.**

If the parser reads a stranger's voucher correctly on the first try, the product is validated. If it doesn't, that is the most important bug in the company and you found it before launch instead of after.

## Open gaps

- The exact 17-state Crew2 list is unknown, and territory expansion depends on it. Untried angles: the ILG/Crew2 Workday careers location facet, and the happyinstallers.com market dropdown.
- The mailbox harvest is unfinished. Widening the filter is free and should happen before anything else.
