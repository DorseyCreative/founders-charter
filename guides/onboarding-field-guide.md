# Onboarding Field Guide — GoTechGo

**For Ashley — walking a new customer through signup on a call.**

They sign up, land on `/onboarding/v2/business`, and go through 10 sections in order. Budget **60–75 minutes**. The wizard saves as it goes, so you can stop and resume.

**One rule above all: the customer drives their own mouse.** You talk, they click. Never ask for a password.

---

## 1. Business Profile — "What's your business called?"
4 screens: name/services → contact → logo → do-you-install.

**Bring:** business name; current business phone; a logo file (optional); their home/shop street address; which days they work.
**Say:** "We're saving your company details and your starting address so the system knows where your day begins."
**Goes wrong:** The **business email is locked** — pulled from whatever Google account they signed up with. Wrong email means a re-signup, not a fix. Also they *must pick the address from the dropdown*. Say: **"Click the suggestion that pops up — don't just type it."** A typed address saves with no map location and wrecks drive times.
**Time:** 8 min.

## 2. Communication — "Where should your new business phone be based?"
3 screens: pick state → pick number → text yourself.

**Bring:** the US state most of their customers are in; their personal cell.
**Say:** "We're giving your business its own texting number. It's included — you're not signing up with a phone company."
**Goes wrong:** Claiming the number takes **30–60 seconds**. Say: **"Don't refresh, don't hit back — it's working."** If the test text doesn't arrive, do **not** buy a second number. Stop and flag it.
**Time:** 6 min.

## 3. Email Setup — "What's your business Gmail?"
4 screens: enter Gmail → set up forwarding → verify → first voucher.

**Bring:** the Gmail address **Crew2 already sends voucher PDFs to**, logged in in another tab. Their PM's email.
**Say:** "Gmail forwards a copy of every voucher to us, so jobs show up in your pipeline automatically."
**Goes wrong — two big ones:**
- **Gmail only.** Yahoo/Outlook/company domain will not work. Screen for this *before* the call.
- Screen 3 says "send any email." **That's wrong — it needs an attachment.** Say: **"Email yourself a photo or any PDF."** A plain email leaves them stuck with no way forward.

Skip the "ask your PM" button — it always errors.
**Time:** 12 min. The hardest section.

## 4. Smartsheet — "Connect your Smartsheet"
5 screens: sign in → pick sheet → auto/manual → preview → done.

**Bring:** the **Smartsheet login the Crew2 sheet is actually shared with.**
**Say:** "We read your Crew2 sheet and pull your jobs in automatically."
**Goes wrong:** Wrong Smartsheet account gives "we couldn't see any sheets" and tells them to create one — **ignore that advice**, it's the wrong account. Leave sync on **Auto**.
**Time:** 5 min.

## 5. Services — "Which services do you offer?"
**Bring:** nothing.
**Say:** "We're loading a ready-made price list so you can quote jobs on day one."
**Goes wrong:** Only **Window Treatments** works — everything else shows "Coming soon" and can't be clicked. If in Section 1 they picked flooring or HVAC *instead of* window treatments, they hit a dead end with no skip button. Fix by going back to Section 1.
**Time:** 3 min.

## 6. Team Setup — "Add yourself first"
Owner → owner's address → add crew → their addresses → review.

**Bring:** each installer's full name, work email, home address. Cell optional but useful.
**Say:** "We're adding your crew and emailing each one a link to set their own password."
**Goes wrong:** Continue stays greyed out on every address screen. Say: **"Scroll down — there's a green 'Yes, that's right' button under the little map. That's your Continue."** This trips up nearly everyone. Note the owner is *always* added as an installer; there's no opt-out.
**Time:** 10 min + 3 min per extra installer.

## 7. Territories — "Group your stores into routes"
**Bring:** which **Home Depot store numbers** they cover, and which weekdays they drive each cluster.
**Say:** "We're grouping your stores into routes so jobs land on the right day with the right person."
**Goes wrong:** **Laptop only.** On a tablet the drag-and-drop doesn't respond to touch. On a phone, routes save but Continue stays locked until they tap the day-of-week chips. Saving errors appear as a toast that vanishes — if they built routes and nothing shows on reload, they redo it.
**Time:** 10 min.

## 8. Google Workspace — "Connect your Google account"
**Bring:** the Google account they want appointments on. **A free @gmail.com is fine.**
**Say:** "We're linking a calendar to each installer so confirmed jobs show up there."
**Goes wrong — the worst moment on the call.** The red "Google hasn't verified this app" screen, and a consent tick box that must be checked. Script below. Also: the screen says "Optional." **It is not** — skipping it permanently locks the Launch button.
**Time:** 8 min + 2 min per installer.

## 9. Account & Billing — "Activate your account"
**Bring:** a credit card (optional).
**Say:** "14 days free. Nothing is charged today."
Pricing: **$179/mo billed annually** or **$217/mo monthly**, both including 3 installers. Extra installers $29–35/mo. Leave AI Pro off.
**Goes wrong:** They can start the trial **without a card** — the button sits below the card form. Without a card the account pauses on day 15. Annual has a terms checkbox that must be ticked or the button won't fire.
**Time:** 5 min.

## 10. Review & Launch — "Here's what we've got"
**Say:** "We create a practice job so you can watch the whole thing work, then we turn you on."
**Goes wrong:** Launch needs **all nine sections green AND the demo order created**. Any grey section = permanently disabled Launch. Have them click **"Create my first work order"** once only. If Launch celebrates instantly without ever saying "Launching…", reload and confirm they landed on the pipeline.
**Time:** 5 min.

---

## GATHER LIST — paste into your pre-call email

> **Before our call, please have these ready:**
>
> - [ ] Your business name and the phone number you use today
> - [ ] Your shop or home street address (where you start your day)
> - [ ] Which days of the week you work
> - [ ] Your logo file, if you have one (optional)
> - [ ] **The Gmail address Crew2 sends your voucher PDFs to** — and be logged into it. Must be Gmail; Yahoo/Outlook won't work.
> - [ ] Your project manager's email address
> - [ ] **Your Smartsheet login** — the one your Crew2 sheet is shared with
> - [ ] The **US state** most of your customers are in
> - [ ] Your personal cell number (we'll text it to test)
> - [ ] For each installer: full name, work email, home address, cell (optional)
> - [ ] **Your Home Depot store numbers** and which days you drive to each
> - [ ] A Google account for your calendar (a free Gmail is fine)
> - [ ] A credit card (optional — the 14-day trial doesn't require one)
>
> **Please join on a laptop or desktop, not a phone or tablet.** One step needs drag-and-drop. Set aside about an hour.

---

## STALL SCRIPTS

### A. Gmail forwarding (Section 3)
*This replaced the old app-password step. Do not ask for a password.*

> "Okay — this is the fiddliest part, and I'll stay with you the whole way.
> On your screen there's a long address starting with `vouchers+`. Copy it.
> Go to your Gmail tab. Gear icon top right, then **See all settings**, then **Forwarding and POP/IMAP**. Click **Add a forwarding address**, paste it, **Next**, **Proceed**, **OK**.
> Google will say it sent a confirmation code. You don't need to go find it — **watch our page.** The code appears on your screen in a few seconds.
> Last bit: **email yourself something with an attachment** — a photo from your phone is perfect. It has to have an attachment; a plain note won't count. As soon as it lands, the page turns green on its own."

### B. Getting the phone number (Section 2)
> "Pick the state where most of your customers are. Hit **Look up numbers** and we'll pull the available local numbers.
> Pick one you like and tap **Pick this**. Now — this takes about a minute and the screen will look like it's just sitting there. **Please don't refresh or hit back.** It's activating the number in the background, and interrupting it makes a mess.
> This number is included in your plan. You're not signing up with a phone company and there's nothing extra to pay."

### C. Google consent (Section 8)
> "Two heads-ups before you click, so nothing surprises you.
> **First:** Google will show a red-ish warning saying *'Google hasn't verified this app.'* That's expected — we're in Google's review queue, which takes a few weeks. Click the small **Advanced** link at the bottom, then **Go to Go Tech Go**.
> **Important:** do *not* click **Back to safety.** That dumps you onto a Google help page and out of setup entirely.
> **Second:** the next screen has permission checkboxes. **Make sure the calendar one is ticked** — the long one about seeing and editing calendars. Google leaves it unticked sometimes, and if it's off we can't see your calendars and we'd have to do this over."

---

## DO NOT DO

1. **Don't use the admin panel's "Invite user" button.** It says "User invited successfully" and does nothing — no email, no login. Use **Team Setup** in the wizard; that one genuinely sends.
2. **Don't let them skip Smartsheet.** The skip button marks the section *complete* with a green check, but no jobs will ever import. The product looks finished and stays permanently empty.
3. **Don't let them skip Google Workspace**, even though it says "Optional." Skipping locks the Launch button forever.
4. **Don't start Google Workspace before Team Setup.** With zero installers the Google step can't be completed at all.
5. **Don't say "send any email" in Section 3.** It needs an attachment. The on-screen wording is wrong.
6. **Don't buy a second phone number** if the first seems to fail. Stop and escalate — the first was likely already purchased.
7. **Don't do Territories on a tablet or phone.** Laptop only.
8. **Don't promise prices are saved** on the Services pricing screen. It says "Save" but discards edits. Say: *"Leave the defaults — you'll set real prices in Settings after launch."*
9. **Don't use the "ask your PM to forward vouchers" button.** It always errors. Have them email their PM themselves.
10. **Don't type addresses without picking from the dropdown.** Anywhere an address is asked for.
11. **Don't re-run onboarding for an existing customer** who has customized prices — the Services step silently overwrites them.

---

## Five things Ezra must fix before Ashley runs a real call

1. **The Google "unverified app" coaching modal exists in V1 but was never carried into V2** (`app/onboarding/page.tsx:4021`). Customers hit the red scare screen cold.
2. **Email screen 3 says "send any email" but the code requires an attachment** (`api/inbound/voucher/status/route.ts:147`). No skip link — hard dead end.
3. **Google Workspace is labeled "Optional" but is required for Launch.** A tenant with zero installers can never satisfy it.
4. **Smartsheet's skip button calls `markSectionComplete`** — records success rather than a skip, so nobody is ever prompted to come back.
5. **`/api/email/send-pm-voucher-request` reads a config key nothing writes**, so it returns "Email not configured" 100% of the time.

Unrelated but flagged: `POST /api/installers/invite` trusts `tenantId` from the request body when a user id is present (`route.ts:184-207`), which appears to let an authenticated user create an invitation into another tenant.
