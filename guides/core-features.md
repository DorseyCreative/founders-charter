# What the Product Does

*The base $217/mo plan, derived from the code. Add-ons are covered separately. 2026-09-10.*

## The one line, in the product's own words

From the SaaS pitch at `/platform`:

> **Full Automation. Total Control.**
> EDI-powered field service automation. Orders flow in from Smartsheet, schedules build themselves, customers get confirmed — all without manual handoffs.

The onboarding headline is more literal, and probably the better sentence for a sales call: **"Crew2 Field Operations, On Autopilot."**

Note the public root page is *not* this pitch — it's a Home Depot homeowner landing page explaining "why did I get this text." Two audiences, two doors.

## What a tenant gets, by where they work

**Order intake.** Connect Crew2's Smartsheet by OAuth, pick a sheet, get auto-sync plus manual Sync Now. The import engine normalises names and phones, geocodes, dedupes and merges rows, flags orphans missing WO#/PO#, and kicks off scheduling proposals. Confirmed schedules write back into the Smartsheet row, with a 30-minute retry sweep for failures. Manual entry runs the same pipeline.

**Pipeline** (`/pipeline`). The main order board: pending → proposed → scheduled → in progress → completed, plus on-hold and cancelled. Assign, confirm, hold, cancel, merge, split, note, resolve interventions, drag-reschedule with constraint checking.

**Dispatch / Command Center.** One call surfaces confirmed jobs, stale opt-ins, unopened proposals, route-review alerts, escalations, today's board by installer, and re-engagement candidates. Bulk reschedule, call and voicemail logging, live SSE stream. Owner/admin/manager only — installers cannot reach it.

**Scheduling and routing.** The live scheduler is `/pro-scheduler`. The InsertionEngine inserts new jobs while respecting confirmed-window locks, and forces a re-notify obligation rather than silently moving a customer. `getPromisedWindow()` is the single source of truth for the arrival window. Route feasibility checks against a self-hosted VROOM + ORS engine.

**Customer messaging.** Outbound SMS from the tenant's own VoIP.ms number — single sends, a daily bulk proposed-date blast, and AI propose/confirm flows. Inbound SMS is auto-classified and auto-replied by Guardian, with human escalation when it is unsure. Outbound email uses the tenant's own SMTP. Inbound email is polled by IMAP and AI-replied — this is separate infrastructure from the Gmail polling, which is PayCheck-only.

**Installer PWA** (`/installer`). A real installable app: job list with status flow and photo upload, geofence auto-arrival, live map, schedule and blockouts, SMS threads, personal stats, punch in/out, push notifications with action buttons.

**Calendar.** Google Calendar OAuth at tenant level with per-installer calendar mapping. Creates, updates and deletes events for scheduled jobs, and pulls available slots.

**Territories and stores.** Pick which Home Depot stores you service, group them into named territories with recurring days or date ranges and a home base. Reassigning a territory's installer shows an impact preview before committing.

**Team.** Roster CRUD, invite by email or SMS, magic login links, per-installer analytics, activate/deactivate.

**Settings.** Business info, scheduling, messaging, Guardian, blast, automation engine, line items, routing provider, integrations, notifications, security, activity log.

## What runs while nobody is watching

This is a large part of the value and it is invisible in any feature list. Of 28 scheduled jobs:

**Keeping Crew2 data flowing** — sheet sync, token refresh, writeback retry, confirmed-block drift detection, route review.

**Customer messaging on its own** — the daily blast, appointment reminders, proposal follow-up nudges, expired-proposal cleanup, hold reminders, geofence checks. This is the "customers get confirmed without manual handoffs" claim, made real.

**Tenant-visible ops** — a morning briefing pushed to owners, and a stale-cleanup sweep that flags forgotten past-dated jobs.

**Billing lifecycle** — trial warnings and grace-period enforcement.

The rest (Guardian training and review, error monitoring, department digests, MRR snapshots) is GoTechGo watching itself, not tenant value.

## What is actually gated

**The feature-flag system is dead.** `tenants.features` carries seven `KNOWN_FEATURES` keys — `sms`, `email`, `calendar_sync`, `ai_scheduling`, `advanced_reporting`, `api_access`, `white_label`. Every plan tier sets them identically and a developer comment confirms **zero enforcement sites**. They gate nothing. The one real flag on that field is `voucher_addon`.

**The seat cap is the gate that matters.** `INCLUDED_INSTALLERS = 3`. Activation counts profiles with `is_active_installer = true` against `3 + Stripe overage quantity`; with no subscription the cap is hard-locked at 3. Activating a fourth returns **HTTP 402** with an upgrade payload from *every* surface — invite accept, status toggle, admin create, punch-in — not just the UI. Unlimited installer *profiles* are allowed; only concurrently active seats are capped.

**Role gating is separate from plan.** The `installer` role is confined to `/installer/*` regardless of tier. Full desktop access is an owner/admin/manager privilege, not something you buy.

## What the UI offers that does not work

- **Pipeline order-menu actions** — reminder, feedback request, invoice generation, duplicate, split, history — fire toasts with no backend behind them.
- **Analytics**: Revenue Trends, Geographic Performance and Customer Communication are literal "coming soon" placeholders. Duplicated in `/accounting`.
- **Settings → Integrations** advertises QuickBooks, Stripe and Zapier as coming soon. Non-functional tiles.
- **14 of 15 service verticals** — HVAC, plumbing, electrical, roofing, landscaping, pest control, appliance repair, garage door, painting, flooring, handyman, locksmith, cleaning, solar — are `comingSoon: true` with empty item lists, disabled in the UI *and* refused by the server. **Only Window Treatments is live.** The product is single-vertical today despite a multi-trade picker.
- **Orphaned pages**: `/scheduler`, `/scheduler-calendar` (hardcoded mock data), `/field-scheduler`, plus dead backup route files, all unreachable from navigation.
