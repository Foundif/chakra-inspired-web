## 1. Footer text size
Bump bottom row from `text-xs` → `text-sm md:text-base`, increase spacing, make "Foundif Innovations" and "Tiruppur · India · Worldwide Export" clearly legible.

## 2. Super Admin role & panel
Add a new `super_admin` role (separate from `admin`) so only the platform owner (you, Foundif) controls it. Client admins won't see super admin menu.

**Database (migration):**
- Add `'super_admin'` value to `app_role` enum.
- New table `platform_settings` (single row id=1):
  - `maintenance_enabled boolean default false`
  - `launch_at timestamptz` (countdown target shown on public site)
  - `maintenance_title text`, `maintenance_message text`
  - `renewal_hosting_due date`, `renewal_amc_due date`
  - `renewal_message text`, `renewal_dismissed_at timestamptz`
- Public SELECT allowed (so site can read maintenance state). Only `super_admin` can UPDATE.
- RLS via existing `has_role()` helper, plus `is_super_admin()` convenience function.
- Seed first super admin via existing `claim_admin` pattern → new `claim_super_admin` RPC (only works if no super_admin exists yet).

**Super Admin UI** (`/admin/super`, same `AdminLayout` styling but with a purple/gold accent badge to distinguish):
- Maintenance Mode card: toggle enable/disable + datetime picker for launch, title/message inputs, live preview.
- Renewal Alerts card: set hosting & AMC due dates + custom message.
- Only visible in sidebar when `isSuperAdmin` is true.

## 3. Public maintenance / launch page
- New `<MaintenanceGate>` wrapper in `App.tsx` that reads `platform_settings`. When `maintenance_enabled` is true AND user is not super_admin, render `<LaunchingSoon>` instead of routes.
- `LaunchingSoon` page: full-screen brand background, big "Launching Soon" headline, live countdown timer to `launch_at`, when timer hits zero → fire `canvas-confetti` burst and show "We're Live!" with auto-reload after a few seconds.
- Add `canvas-confetti` dependency.

## 4. Renewal alert banner in client admin
- In existing `AdminLayout`, fetch `platform_settings`; if `renewal_hosting_due` or `renewal_amc_due` is within 30 days (or past due) and not dismissed, show a sticky amber banner at top of admin: "Hosting renewal due on …" with a "Remind me later" (sets `renewal_dismissed_at` for 7 days) — only super admin can clear permanently from super panel.

## Files touched
- `src/components/layout/Footer.tsx` (text size)
- migration: enum + `platform_settings` table + grants + RLS + `is_super_admin` + `claim_super_admin` RPC
- `src/hooks/useAuth.tsx` (expose `isSuperAdmin`)
- `src/hooks/usePlatformSettings.ts` (new, realtime)
- `src/components/MaintenanceGate.tsx` (new)
- `src/pages/LaunchingSoon.tsx` (new, with confetti)
- `src/pages/admin/SuperAdmin.tsx` (new)
- `src/pages/admin/AdminLayout.tsx` (super admin link + renewal banner)
- `src/App.tsx` (wrap routes in MaintenanceGate, add `/admin/super` route)
- `package.json` (add `canvas-confetti`)
