# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**FamilyQuest** (package name `household-hero`) is a tablet-first PWA that turns the whole of family life — chores, dinner, groceries, feelings, and the family calendar — into a game the household actually wants to play. It is a **local-only, client-side React app** — no backend, no accounts, no network calls. All state lives in one JSON-serializable object persisted to `localStorage`. This design is deliberate so cloud sync can be added later without a rewrite.

### Source-of-truth documents (read before building)

- **`new/family-quest-PRD-v3.md`** — the CURRENT product spec (v3.0). Full feature expansion and visual pivot. This supersedes everything below it. Read it in full before changing features, game rules, levels, data model, or fairness logic. It is organized into 7 build phases — build one phase at a time and get approval before continuing.
- **`new/DESIGN-NOTES-v2.md`** — the CURRENT visual spec. A complete redesign (liquid glass + chunky abstract blob creatures + warm light palette). It **overrides all earlier visual direction** — read it in full before touching ANY UI.
- **`family-quest-PRD.md`** — the ORIGINAL v1 PRD (cozy fantasy RPG framing). Now historical. The existing code references it (e.g. "PRD §8.3"), but where it conflicts with v3, **v3 wins**. Keep it for context on the engine internals only.

⚠️ The current build in `src/` was written against the v1 PRD and its medieval/dark aesthetic. v3 + DESIGN-NOTES-v2 represent a significant pivot — see "v3 migration: rebuild vs. keep" below before starting work.

## Commands

```bash
npm install          # first time only
npm run dev          # Vite dev server at http://localhost:5173
npm run dev -- --host   # expose on LAN so an iPad can open it
npm run build        # tsc -b (type-check) then vite build → /dist
npm run preview      # serve the built /dist
npm run lint         # eslint .
```

There is **no test framework** configured. Verify changes by running the dev server and exercising the UI. `npm run build` is the type-checking gate.

## Architecture

The whole app is driven by a single source of truth and a layered domain engine. Understanding three things explains most of the codebase:

### 1. The store is the only place state changes

`src/store/AppStore.tsx` holds the entire `AppState` (defined in `src/types.ts`) in one `useState`, persists it to `localStorage` on every change (key `familyquest-state-v1`), and exposes **action helpers** via `useStore()`. Components never mutate state directly — they call actions (`completeTask`, `redeemReward`, `setSpoons`, etc.). All point/level/badge awarding funnels through `awardTo()` → `awardBadges()`.

`loadState()` merges saved state over `makeEmptyState()` so adding a new field to `AppState` is back-compatible with older saves. If you add a field to `AppState`, add it to the seed/empty builders in `src/data/seed.ts`.

### 2. The engine encodes the product's values, not just rules

`src/engine/` is pure, state-in/state-out logic with no React:

- **`fairness.ts`** — the three-layer fairness model from the PRD:
  1. **Capability** (`canDo`, `Ability` rank) — a HARD filter on what a person can even be offered.
  2. **Capacity** (`fairShareTarget`, `CAPACITY_TARGET`) — how much someone should carry. The leaderboard ranks by **% of your own fair share**, never raw points, so everyone can hit 100%.
  3. **Assistance** (`pickBuddy`) — tasks needing a buddy auto-pair an adult, preferring whoever has the most spoons.
  Also owns the **capacity-weighted daily dinner rotation** (`scheduledCook`, `weightedDinnerCycle`).
- **`game.ts`** — levels (lifetime XP, only ever goes up), titles, skills, badges, and the shared `toISODate()` date helper. Badges are pure predicates re-checked on every award.
- **`spoons.ts`** — Spoon Theory layer. Spoons are sensitive daily energy readings, surfaced ONLY to invite help. They never lower fair share, never cost points, never use failure language. Acts of care earn a tiny quiet bonus (`CARE_POINTS = 3`).

### 3. Tasks are generated daily from chore templates

A `Chore` is a recurring template; a `Task` is a concrete instance for a date. `ensureTasksForToday()` runs once per load (guarded by `lastTaskGenDate`) and spins up daily/weekly tasks plus tonight's dinner task assigned to the scheduled cook. Tasks flow `open → claimed → pending → done` (the `pending` state only exists for chores with `requiresApproval`, which wait in a Guild Master's approval queue before points are awarded).

### App shell & navigation

`src/App.tsx` is a gated router (`react-router-dom`):
1. If `!setupComplete` → `SetupWizard` (name guild, set PIN, seed example family or create first Guild Master).
2. If no `currentUser` → redirect to `/who` (`ProfilePicker`).
3. Otherwise the five tabs: `/` Home · `/quests` Tasks · `/kitchen` Dinner · `/guild` Guild · `/me` Me, plus `/settings` Admin.

`/settings` (Admin) is the Guild Master area gated by the 4-digit `parentPIN` (verified via `verifyPin`; resettable with a security question). Celebrations (points/level-up/badge/care popups) run through a separate non-persisted queue in the store, rendered by `CelebrationOverlay`.

## Conventions & guardrails

These are product invariants, not style preferences — keep them when editing:

- **No shaming, no losing XP, no "last place."** Low spoons only ever invite help warmly. Acts of care get a quiet 💛, never a loud transactional banner.
- **Never use the word "chores" in user-facing copy.** They are Quests; people are Adventurers / Guild Masters.
- **No network, no analytics, no third-party calls.** Everything stays on-device.
- Vocabulary mapping in UI: parent = **Guild Master**, kid = **Adventurer**, chore = **Quest**, family = **Guild/Realm**, points = **XP**.
- Files use a `// ── Section ──` comment banner style; match it.

> Note: v3 keeps the no-shaming / no-chores / on-device rules, but **drops the medieval RPG framing** (Guild/Realm/fantasy titles) in favor of a warm, modern blob-creature game. See `new/DESIGN-NOTES-v2.md` "What We're Leaving Behind." Level titles, skill names, and copy in v3 are friendlier and non-medieval (e.g. "Tiny Helper," "Quest Champion"). Keep "Quest," "XP," "Guild Master," "Adventurer"; retire "Realm," "Village Apprentice," parchment/sword imagery.

## v3 migration: rebuild vs. keep

v3.0 is a feature expansion (chores-only → full family OS) plus a visual pivot (dark medieval RPG → warm light "liquid glass + blob creatures"). When migrating, treat the layers differently:

**Keep / extend (the engine is sound):**
- `src/engine/fairness.ts` — the 3-layer fairness model (capability / capacity / buddy) and capacity-weighted dinner rotation map directly to v3 §4 and §9. Keep.
- `src/engine/spoons.ts` — Spoon Theory maps directly to v3 §5. Keep; keep `CARE_POINTS`.
- `src/engine/game.ts` — level math, skill leveling, badge-as-predicate pattern, `toISODate` all reusable. **Update the data, not the structure:** the v1 level thresholds already match v3 §8 (0/100/250/500/850/1300/1900/2700/3700/5000), but **rename the titles** to the v3 table (Tiny Helper → Quest Master) and add the +1,500/level rule (already present). Add v3 skills (Kitchen Wizard, Tidy Champion, Learning Star, Self-Care Pro, Kind Heart) and the fuller v3 badge list.
- `src/store/AppStore.tsx` — the single-source-of-truth + action-helper + `loadState` merge pattern is exactly right for the new fields. Keep the architecture; add actions for the new domains.
- `ensureTasksForToday()` daily/weekly task generation, approval queue, PIN gate, celebration queue — all keep.

**Extend the data model (`src/types.ts` + `src/data/seed.ts`):**
- Split points into **`lifetimeXP`** (level, never drops) and **`spendableXP`** (avatar shop) per v3 §6 — current `lifetimePoints`/`spendablePoints` already approximate this; align names/semantics. Add `weeklyXP` for the Monday-reset leaderboard.
- Replace the **`avatar: string` (emoji)** field with a structured avatar object (`bodyShape`, `color`, `eyes`, `equippedAccessories`, `unlockedAccessories`) per v3 §6/§15. This is a real change, not a rename.
- Add `Ability` value `"teen"` and align ability/capacity enums with v3 §15 (`toddler`/`child`/`teen`/`adult`).
- Add new top-level collections: grocery items, activity requests, calendar events, feelings check-ins, reward-shop items (avatar accessories). `loadState` merge keeps old saves working.

**Rebuild (these were built to the v1 design and must be redone for v3):**
- **All UI/styling.** Dark navy + Cinzel/Bebas medieval fonts + jewel tones → warm cream (`#FAF8F5`), liquid-glass cards, Nunito/Plus Jakarta Sans/Fredoka, coral/amber/sky/mint palette, Lucide icons (no emoji as UI). Every screen in `src/screens/` and `src/components/` needs a visual rebuild against DESIGN-NOTES-v2.
- **Avatar system.** Net-new: SVG blob-creature builder (body/eyes/face/accessories) replacing the emoji avatar. Appears on profile cards, leaderboard, quest chips, level-up dance, champion screen.
- **Navigation.** Five tabs change: current Home · Quests · Kitchen · Guild · Me → v3 Home · Quests · Kitchen · **Calendar** · Guild (Me/profile folds in; Settings off Home). Lucide icons, no emoji.

**Net-new features (no current equivalent — build fresh per phases 5–6):**
- Grocery list with auto-categorization (v3 §10)
- Recipe library + recipe→grocery one-tap (v3 §9)
- Feelings check-in: 14 emotion blob creatures, breathing exercise, "I'm bored" → activity → parent approval (v3 §11)
- Shared family calendar, cooking rotation auto-populates it (v3 §12)
- Reward shop selling avatar accessories for `spendableXP` (v3 §6)
- Push notifications (Web Push) + PWA service worker (v3 §13)
- Weekly leaderboard reset + "Champion of the Week" dance (v3 §8)

**New dependencies v3 implies:** Tailwind CSS, Framer Motion (animation), Lucide React (icons), Google Fonts. None are currently installed.
