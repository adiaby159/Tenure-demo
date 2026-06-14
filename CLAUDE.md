# Tenure — Claude Code project context

**One-liner:** Institutional knowledge that survives leadership transitions.

This file is the working context for Claude Code. The authoritative product spec is the
**Tenure Project Bible** (provided by the founder). When this file and the bible disagree,
the bible wins — surface the conflict rather than silently choosing. Full bible lives at
`docs/PROJECT_BIBLE.md` (add it there if not yet present).

---

## Locked decisions (2026-06-13)

These were decided explicitly with the founder before scaffolding:

1. **Build type: Production foundation.** Real codebase per bible §12/§14 — not a throwaway demo.
   Next.js (App Router) + Postgres + Prisma + central server-side authorization.
2. **First scope: Phase 0 + President role workspace.** Foundations (schema, auth module,
   club switcher, seed 2 real clubs) then the President workspace end-to-end (role-overview
   panel, card board, card modal, readiness meter). Go deep on the wedge before breadth (§16).
3. **Auth & data: stubbed auth + seeded data, for now.** A persona/user-picker login (not real
   Google SSO yet) and data seeded from the real Simon clubs (§15). Architected so real
   Google SSO drops in later without rework. **Still persists to Postgres — not localStorage.**
4. **Database: Neon (serverless Postgres, free tier).** Connection string in `.env` (gitignored).
   Matches the Vercel/Postgres production target.
5. **Repo:** https://github.com/adiaby159/Tenure-demo (scaffolded fresh into an empty repo).

## Deferred (architect for, don't build yet)

- Real Google SSO (Auth.js) — replaces the stub login. Keep the auth boundary clean so it slots in.
- Phases 2–7 (handoff/permission-flip, live budget, club hub, collaboration board, OSE views,
  SimonSource integration). Don't build ahead of the roadmap (§14).
- Multi-school tenancy — partition by `club_id` and treat institution as a higher tenant so it's
  cheap later, but don't build cross-school features now.

---

## Stack

- **Framework:** Next.js (React, App Router), TypeScript throughout (no `any` at module boundaries).
- **DB:** Postgres (Neon). **ORM:** Prisma — typed schema is the source of truth (§13, schema-first).
- **Styling:** Tailwind CSS with the brand tokens below.
- **Auth:** stub now (persona picker); Auth.js + Google SSO later.
- **Email:** `mailto` only in throwaway flows; transactional provider in production.
- **Hosting target:** Vercel.

## Hard rules (from bible §7, §12, §13, §16)

- **One authorization module.** Every access decision flows through a single
  `(user, club, resource, action)` check. No inline/scattered permission checks. Default-deny.
- **Server-side enforcement.** Never rely on hiding UI. The API enforces. Permission state is
  derived from `RoleAssignment` + dates, computed server-side, never trusted from the client.
- **Multi-tenant from day one.** Every query partitioned by `club_id`.
- **Cards are typed.** `type` + JSON `fields` validated per type. Each card carries
  `(club_id, owning_role_id, visibility)` from creation.
- **Readiness = simple N-of-M** required cards present + fresh. NOT a configurable rules engine (v1).
- **Keep file bytes OUT.** Artifacts store external links + metadata (Canva/Drive/Box), not bytes.
- **No localStorage as primary store.** Persist to Postgres.
- **Migrations for every schema change.** Never hand-edit data.

## Visibility scopes (RBAC, four scopes — §4.5/§7.3)

- `role` → role holder + that club's president only.
- `club` → any active board member of that club.
- `global` → any active board member of any club (collaboration posts, vendor directory).
- `admin` → OSE, read-only within their lane; writes only approvals/announcements.

## Permission states (per user, per club — §7.1)

`shadow` (read-only depository, ~4–6 wks pre-term) → `active` (full) → `outgoing` (write off)
→ `archived`. The scheduled `shadow → active` flip on `term_start` is derived from
`RoleAssignment` terms, not manual toggles. **Open question to resolve, not guess:** does an
outgoing member keep read access to cards they created? (Bible recommends yes, read-only.)

## Brand tokens (Tailwind theme — §13)

- navy `#1F3864`, navy-deep `#16294A`, brass `#C9A227`, parchment `#FAF8F3`, ink `#2B2B33`.
- Display serif for headings (Fraunces-like), clean sans for body (Inter-like).
- Per-card-type accent families (teal/purple/green/amber/coral/blue). No decorative color bars/stripes.

## Non-goals (do NOT build — §16)

No surveillance/passive activity capture. No re-implementing storage/chat/design/event tools
(link out / integrate). No file-byte storage v1. No configurable readiness rules engine v1.
No nested comments/DMs v1. No AI features in early phases. No cross-school work before pilot.
No mobile-native app v1 (responsive web is enough). No acting on a single-interview anecdote.

## Domain language (§18)

card · charter · RoleAssignment · shadow · the permission flip · depository · club hub ·
collaboration board · readiness · scope · OSE · Leadership Accelerator · SimonSource ·
Impact Initiative · GBC · mini-mester · WIFM. Match these names in code.

## Working agreement

- Schema-first: define the Prisma schema (§5) before UI.
- Prioritize tests on the authorization layer and the permission-flip logic.
- Small, reviewed commits. Flag scope/permission conflicts instead of silently resolving them.
