# FamilyQuest — The Family Game

> *"The whole of family life — chores, dinner, groceries, feelings, and the
> calendar — turned into a game the household actually wants to play."*

A tablet-first family household app with warm, modern "liquid glass" visuals
and chunky blob-creature avatars — not a chore tracker, not a medieval RPG.
Family members are **Adventurers** and **Guild Masters**; tasks are
**Quests** that earn **XP**, levels, skills, and badges; there's a daily
cooking rotation, a Reward Shop, a shared calendar, and a caring **Spoon
Theory** layer so the family can rally for whoever's running low today.

All data lives privately in the browser — no accounts, no internet sharing, no
ads, no payments. (The only secret is a local 4-digit **Guild Master PIN**.)

## Run it on your computer

You need [Node.js](https://nodejs.org) (any recent version). Then, in a terminal:

```bash
cd household-hero
npm install      # first time only
npm run dev      # starts the app
```

It will print a local address like `http://localhost:5173`. Open that in your
browser. On first launch you'll meet the **setup wizard** — name your guild, set
a PIN, and either load the example family or create your first Guild Master. To
stop the server, press `Ctrl + C`.

## Put it on the iPad / fridge tablet

1. Make sure your computer and the device are on the **same Wi-Fi**.
2. Run `npm run dev -- --host`. It prints a `Network:` address.
3. On the iPad, open that address in **Safari**.
4. Tap **Share** → **Add to Home Screen**. It opens full-screen, like a real app.

> Heads up: with this free "local-only" setup, each device keeps its **own** data.
> The code is structured (one JSON-serializable state object) so cloud sync can be
> added later without a rewrite.

## Build a shareable version

```bash
npm run build    # type-checks and creates a /dist folder
npm run preview  # preview the built version
```

The `dist/` folder is a plain static site you can drop onto a free host like
**Netlify** or **Vercel**, or this repo's own GitHub Pages workflow
(`.github/workflows/deploy-pages.yml`).

## How it's organized (for the curious)

- `src/types.ts` — the data model (family, people, quests, rewards, recipes, spoons…).
- `src/data/seed.ts` — the example family (Dad, Mom, Papa, Nezzie, Rowen) plus a
  blank starter state for the setup wizard. Editable in-app via Settings.
- `src/engine/` — the **fairness engine** (capability + capacity + buddy pairing),
  the **cooking rotation**, **spoons**, and the **game rules** (levels, titles,
  skills, badges).
- `src/store/AppStore.tsx` — one place that holds all state, persists it to the
  browser, and drives celebrations. Every action lives here.
- `src/screens/` — SetupWizard, ProfilePicker, and the tabs: Home · Quests ·
  Kitchen · Calendar · Guild · Me, plus Settings (Guild Masters).
- `src/components/` — shared pieces: the blob-creature `Avatar`/`Creature`
  system, progress bars, the spoon row, the PIN pad, the celebration overlay,
  the bottom nav.

## The guardrails (built in on purpose)

No shaming, no losing XP, no public "bottom of the leaderboard." The leaderboard
ranks by **% of your own fair share**, so everyone can win. Low spoons are never
framed as failure and never cost XP — they only ever **invite help, warmly**.
Acts of care earn a quiet 💛, never a loud transactional banner. No money, no ads,
no data leaves the device. And it never says the word "chores."
