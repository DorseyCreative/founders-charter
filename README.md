# Founders' Role Charter

A working tool for two founders splitting a technology company between them.

- **Charter** — 24 role definitions in plain language. Claim each for either founder, both, or an outside firm.
- **Program** — every claimed role becomes a tracked 14-day, four-module program with required inputs, milestones, and what each founder owes the other.

## Shared board

Both founders work on one synced board. The board id lives in the URL
(`#space=…`) and is the only credential — **anyone with the link can read and
edit**, so treat it like a private document link. "New board" rotates to a fresh
id if a link is ever over-shared.

Changes push immediately and the page polls every 5s, so the other phone
catches up within a few seconds. Edits are stored per field, so both of you can
work at once without overwriting each other. Offline edits queue locally and
flush on reconnect.

Backend: Supabase (`dorsey-creative-dashboard`), table `public.charter_state`,
RLS on, anon policy scoped to that table. Only the publishable anon key ships in
the page.

Single static page, no build step. Open `index.html`.
