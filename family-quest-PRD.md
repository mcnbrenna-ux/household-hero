# 📜 Product Requirements Document
# FamilyQuest — The Household RPG

**Version:** 2.0 (merged)
**Date:** June 2026
**Prepared for:** Claude Code
**Prepared by:** Vibe Coding Assistant

---

## ⚠️ How to Use This Document (Read First)

This PRD is written to be handed directly to Claude Code, the AI coding assistant. If you have never built an app before, here is what to do:

1. Install Claude Code (it runs in your computer's terminal)
2. Create a new empty folder on your computer called `family-quest`
3. Open Claude Code inside that folder
4. Paste this entire document and say: *"Build this app exactly as described in this PRD. Start with Phase 1 only. Ask me before making any decisions not covered here."*
5. Claude Code will build it step by step. Review after each phase before asking it to continue.

---

## 1. Project Overview

### What Is This?

FamilyQuest is a tablet-first family household management app that feels like a fantasy RPG game — not a boring chore tracker. It lives on a shared family tablet and requires no login. Every family member has a profile they tap to enter. The app solves four real family problems:

- **Dinner chaos:** Nobody knows whose turn it is to cook or what's being made tonight
- **Chore arguments:** Kids don't do chores because there's no reason to
- **Fairness:** Tasks don't account for each person's actual energy and capacity
- **Household admin burden:** Parents carry all the mental load — and one parent may carry far more than is sustainable

It solves these by making household participation feel like playing a video game — earning XP, leveling up characters, collecting badges, competing on a family leaderboard — while building in genuine care for each family member's real daily energy through **Spoon Theory**.

### One-Line Description

> *"A fantasy RPG for your household — where doing dishes earns you XP, cooking dinner makes you a legendary chef, and the whole guild rallies when someone's running low on spoons."*

### Success Criteria

The app is working correctly when:
- The family uses it every single day without being prompted
- Kids ask to do chores because they want the XP
- Nobody argues about whose turn it is to cook
- The "Tonight's Dinner" card on the home screen is always filled in
- The family responds to each other's low-spoon days — shifts get covered and small acts of care happen because the app surfaced the need, not because someone had to ask
- Parents spend less than 2 minutes per day administering it

---

## 2. Users & Roles

### Family Size
5 or more family members. The app must support up to 8 profiles.

### Two Role Types

#### 🛡️ Guild Master (Parent / Admin)
- Full access to all screens
- Can create, edit, and delete quest assignments
- Can approve or reject completed quests before XP is awarded
- Can edit the cooking rotation schedule
- Can add recipes and grocery lists
- Can create and manage all family member profiles (including ability, capacity, buddy flags)
- Can define redeemable rewards and their XP costs
- Can set which family members can track daily spoons
- Protected by a 4-digit Parent PIN (set during first-time setup)

#### ⚔️ Adventurer (Kid / Member)
- Can see their own profile, their assigned quests, and the family leaderboard
- Cannot see other kids' quest lists in detail (only leaderboard scores)
- Can mark quests as complete (pending Guild Master approval)
- Can set their own daily spoon count (if enabled by a parent for their profile)
- Can see the home screen dashboard (cooking rotation, tonight's dinner, family spoon status)
- Can spend XP on rewards from the Reward Shop
- Cannot edit any assignments or settings

### Age Consideration
Kids range from very young (Rowen, age 2) to older (Nezzie, age 10). The UI must:
- Use large, legible text (minimum 18px body, 28px+ for key elements)
- Use icons alongside all text labels
- Keep interactions to single taps — no complex gestures
- Use color and imagery heavily (not text-heavy interfaces)
- For the youngest member, show only a handful of simple, toddler-friendly tasks with celebration — no pressure, no spoon tracking

---

## 3. No Login / Profile Selection

There are no accounts, passwords, or email addresses. The app lives on one shared tablet.

### How It Works
- The app opens directly to a **Profile Selection Screen**
- All family profiles are displayed as large illustrated character cards
- Tapping your character card enters the app as that person
- **Adventurers (Kids):** Tap their card → straight into their dashboard, no barrier
- **Guild Masters (Parents):** Tap their card → prompted for 4-digit Parent PIN → enter dashboard
- The PIN protects admin features only. If a parent forgets their PIN, a reset option requires answering a security question set during setup.

### First-Time Setup
On first launch (no profiles exist), a setup wizard runs:
1. Name the family (e.g., "The Johnson Quest")
2. Add family members one by one:
   - Name
   - Role: Guild Master or Adventurer
   - Character avatar (choose from 8 fantasy types)
   - Age
   - Ability level (auto-suggested from age, parent fine-tunes)
   - Capacity: Light / Normal / Heavy
   - "Needs a buddy" flag (optional)
   - Enable spoon tracking: Yes / No (optional per member)
3. Set Parent PIN
4. Optionally seed with example quests and a starter cooking rotation
5. Done — enters the app

---

## 4. The Fairness Engine (How the App Knows What's Fair)

This is foundational — it governs how every task and cooking rotation is assigned. Without it, the app is just a to-do list. With it, it's a system that genuinely fits your family.

It works in three layers set up once during profile creation and adjustable anytime by a Guild Master:

### Layer 1 — Capability (What a person CAN do — a hard filter)

Each profile has an **ability level**. The app suggests a starting ability from age, and a parent fine-tunes it. **The app will never offer someone a task they can't do.**

- **Rowen, age 2:** Toddler-safe tasks only (e.g. "put toys in the bin"). Never offered dinner duty or anything unsafe.
- **Nezzie, age 10:** Can do most quests and cooking, but cooking is flagged "needs a helper" (see Layer 3).
- **Adults:** Full access to all tasks.

### Layer 2 — Capacity (How MUCH a person should carry — a slider)

Each profile has a **capacity setting: Light / Normal / Heavy.** This sets their fair share — their target number of quests and dinner turns — even among tasks they're capable of.

- **Mom:** Works full-time and manages a chronic illness → **Light** capacity. Fewer dinners in the rotation, smaller quest target. This is by design, not a penalty.
- **Dad:** Stay-at-home parent → **Heavy** capacity. Carries the baseline daily load.
- **Kids:** Start at Normal, adjustable by parents anytime.

The cooking rotation and the open-quest pool both respect capacity — e.g. Mom comes up in the rotation less often than Dad; Rowen never comes up at all.

### Layer 3 — Assistance (Tasks that need a buddy)

Some tasks, or some people, require a helper. When **Nezzie is assigned to cook**, the app **automatically pairs an available adult with her**, and both earn XP (full XP for each, or split — parent's choice per task). This keeps "Nezzie can cook but needs help" true in practice.

> **For Claude Code:** Capability and capacity filter the quest suggestion pool and cooking rotation automatically. The "needs buddy" flag triggers an auto-pairing prompt when that person is assigned to a qualifying task.

---

## 5. Spoon Theory — Daily Energy & Family Care ✨

> *This is the heart of what makes this app fit THIS family. It's not a productivity feature — it's a care feature.*

**Capacity (Section 4) is the long-term baseline.** Spoons are how someone feels *today*. Based on Spoon Theory — a framework used by people with chronic illness to describe limited daily energy — the app lets the whole family see, respect, and respond to each other's real energy in the moment.

### Setting Your Spoons

- Each adult (and optionally older kids, parent's choice per profile) sets a **daily spoon count** with a low-friction tap — a small row of spoon icons (🥄) numbered 1–10. One tap, no forms.
- Spoons can be updated anytime as the day changes.
- A person's spoon count is **visible to the whole family**, including kids — so even young ones can notice "Mom's low today" and choose to help. Visibility is the point.
- **For Rowen (age 2):** spoon tracking is hidden/disabled. It doesn't apply.

### When Someone Is Low on Spoons

The app gently surfaces low-spoon situations to the family in two warm, **opt-in, never-demanding** ways. The tone is always *invitation*, never alarm or guilt.

**1. Offer to cover a demanding duty.**
If a low-spoon person is on the hook for something draining (e.g. it's Mom's dinner night but she's at 2 spoons), a soft nudge appears for the family:

> *"Heads up — Mom's running low on spoons today. Who'd like to pick up dinner tonight?"*

One tap lets someone volunteer. The cooking shift swaps, and the XP for that duty flows to whoever covers it.

**2. Suggest small acts of care.**
A gentle prompt offers concrete, kid-friendly ways to help:

> *"Mom's low on spoons right now. Want to help? You could: fill her water bottle 💧, give her a hug 🤗, take one thing off her list, or just check in with her."*

### Acts of Care & XP — Critical Tone Requirement

- Caring for a low-spoon family member earns a **small, quiet bonus** — a soft "thank you," never a loud transactional reward.
- **DO NOT** frame care as a hard quest with a big XP banner (*"COMPLETE CARE TASK: +10 XP!"*). That teaches kids to help for points, which defeats the purpose.
- **DO** frame it as recognition after the fact: a gentle *"That was so kind 💛 +a little XP"*. The XP is a side effect of kindness, never the motivation.
- Acts of care accumulate toward the **"Caring Heart" badge** — warmth is celebrated the way effort is, just more quietly.

### Spoon Guardrails (Hard Rules — Do Not Violate)

- ❌ Low spoons **never** treats a person as failing
- ❌ Low spoons **never** lowers anyone's fair-share percentage or costs XP
- ❌ Low spoons **never** appears with negative, alarmed, or urgent language
- ❌ The family-facing prompts are **invitations**, never pressure, never a public "Mom can't cope" framing
- ✅ Low spoons is warm, private-feeling information that invites care — nothing more

### Spoon Display on the Home Screen

A small, glanceable "Guild Status" section on the home screen shows each family member's spoon count as a row of icons (filled = available, empty = used). Parents and kids can both see this at a glance.

---

## 6. Visual Design Direction

### Overall Aesthetic
**Fantasy RPG meets cozy home.** Think: a warm tavern in a magical kingdom. Rich jewel-tone colors, parchment textures, glowing effects, playful fantasy iconography — but never dark or scary. It should feel warm, safe, and exciting.

### Color Palette (CSS Variables)
```css
--color-primary:     #1B6B8A   /* Deep teal */
--color-secondary:   #7B2D8B   /* Royal purple */
--color-accent:      #C0392B   /* Ruby red */
--color-gold:        #F0C040   /* XP gold / coins */
--color-spoon:       #E8A87C   /* Warm amber — used only for spoon UI */
--color-care:        #F9C6D0   /* Soft rose — used only for care/kindness moments */
--color-bg:          #1A1A2E   /* Deep navy — main background */
--color-surface:     #16213E   /* Card backgrounds */
--color-surface-alt: #0F3460   /* Slightly lighter surface */
--color-text:        #E8E8F0   /* Off-white text */
--color-text-muted:  #9999BB   /* Secondary text */
--color-success:     #2ECC71   /* Green for completions */
--color-warning:     #F39C12   /* Orange for pending */
```

> **Note:** The spoon and care colors are intentionally warm and soft — distinct from the bold game colors. They signal a different emotional register: gentle, not competitive.

### Typography
- **Display / Headings:** `Cinzel` (Google Fonts) — fantasy gravitas
- **Body / UI text:** `Nunito` — round, friendly, highly legible at small sizes
- **Numbers / XP / Points:** `Bebas Neue` — chunky and impactful for scores
- **Care / spoon copy:** Use `Nunito` in italics, softer size — distinct from quest copy

### Iconography & Illustration
- All family member profiles have selectable fantasy character avatars: wizard, knight, ranger, healer, bard, mage, rogue, paladin — illustrated in a friendly cartoon style
- Fantasy-themed icons for quest categories: ⚔️ household quests, 🍲 kitchen quests, 📜 learning quests, 🌿 self-care quests, ⭐ bonus quests
- **Spoon icon:** 🥄 — used consistently throughout the app for all spoon-related UI
- **Care icon:** 💛 — used for acts of kindness and the Caring Heart badge
- Completion animations: particle burst of gold coins/stars when a quest is approved
- Level-up animation: full-screen flash with character leveling up, fanfare text

### Layout Principles
- **Tablet-first** — designed for a shared tablet in portrait orientation
- Large tap targets (minimum 56px height for all interactive elements)
- Cards with slight glow/border effects, not flat boxes
- Heavy use of iconography alongside text
- Bottom navigation bar for main sections (no hamburger menus)
- Dashboard-first — the home screen answers "what's happening today?" at a glance

---

## 7. App Structure & Navigation

### Bottom Navigation Bar (Always Visible)
```
🏰 Home  |  ⚔️ Quests  |  🍲 Kitchen  |  🏆 Guild  |  ⚙️ Settings (Guild Masters only)
```

### Screen Map

```
App Launch
  └── Profile Selection Screen
        ├── Adventurer Profile → Adventurer Dashboard
        └── Guild Master Profile → PIN Entry → Guild Master Dashboard

Home Dashboard (The Realm)
  ├── Family name + crest
  ├── Guild Status (spoon counts for all members)
  ├── Tonight's Dinner card
  ├── This Week's Cook
  ├── My Active Quests (top 2–3)
  ├── Low-spoon nudge (if applicable today)
  └── Pending Approvals badge (Guild Masters only)

Quests Screen (⚔️)
  ├── My Active Quests
  ├── Pending Approval (my submitted quests)
  ├── Completed Quests (this week)
  └── [Guild Master only] Assign New Quest

Kitchen Screen (🍲)
  ├── Cooking Rotation Calendar
  ├── Tonight's Dinner card
  ├── Recipe Library
  └── Grocery List

Guild Screen (🏆)
  ├── Weekly Leaderboard
  ├── All-Time Leaderboard
  ├── Weekly Champion display
  ├── Badges / Achievements Wall
  ├── Skills Wall (per member)
  └── Reward Shop (spend XP)

Settings Screen (⚙️) [Guild Master PIN required]
  ├── Manage Profiles (ability, capacity, buddy flags, spoons toggle)
  ├── Quest Templates (recurring quests)
  ├── Reset Weekly Quests
  ├── Cooking Rotation Editor
  ├── Manage Rewards
  └── Family Name / PIN settings
```

---

## 8. Feature Specifications

### 8.1 Home Dashboard (The Realm)

The home screen is the emotional heart of the app. It should immediately answer: *"What's happening in our household today?"*

**Elements:**
- **Family name header** with a small crest/emblem (e.g., "⚔️ The Johnson Quest")
- **Guild Status bar** — a compact row showing each family member's avatar + spoon count (🥄🥄🥄 = 3 spoons). Tapping a member's spoons opens their full spoon detail. Visible to everyone.
- **Low-spoon nudge card** — appears only when someone is at ≤3 spoons and has a demanding duty today. Warm, dismissible, never alarming. (See Section 5 for exact copy.)
- **Tonight's Dinner card** — large, prominent. Shows meal name, cook's avatar, and a recipe link if set. If empty: *"What's the quest tonight, [Cook Name]?"*
- **This Week's Cook** — character portrait + name + crown icon
- **My Active Quests** — top 2–3 quests for the logged-in user, XP values shown
- **Pending Approvals** — (Guild Masters only) badge with count of tasks awaiting review
- **Weekly Leaderboard Snapshot** — mini top-3 with avatars

---

### 8.2 Quests (Chores & Tasks)

**"Quests"** is the in-app name for all tasks. Never use the word "chores" in the UI.

#### Quest Types

| Quest Type | Icon | Examples | Base XP |
|---|---|---|---|
| Household Quest | ⚔️ | Vacuum, dishes, laundry, trash | 20–40 XP |
| Kitchen Quest | 🍲 | Help with dinner, set table, pack lunches | 25 XP |
| Learning Quest | 📜 | Read for 20 mins, finish homework | 30 XP |
| Self-Care Quest | 🌿 | Take a shower, tidy room, get dressed, low-energy self-care | 15 XP |
| Bonus Quest | ⭐ | Parent-defined special tasks | Custom XP |

> **Self-Care Quests** are the in-app home for low-spoon care tasks. These should feel gentle and supportive. The language should never imply these are lesser — completing them earns full XP and counts toward the "Self-Care Hero" badge.

#### Quest Assignment Rules
- Only Guild Masters can create and assign quests
- Quests can be assigned to: one specific person, or "anyone" (first to claim it)
- The app only shows quests to members whose **capability level** allows it (hard filter)
- Quests have a due date (today, this week, or a specific date)
- Guild Masters can create **Quest Templates** (recurring weekly quests that auto-reset Monday)
- When a quest is assigned to someone with a "needs buddy" flag for that task type, the app automatically prompts the Guild Master to assign a buddy — both earn XP

#### Quest Completion Flow
1. Adventurer taps **"Complete Quest!"**
2. Quest moves to "Pending Approval" — grayed out with ⏳
3. Guild Master sees a notification badge on dashboard
4. Guild Master taps → sees member name, quest, XP value
5. Guild Master taps **✅ Approve** or **❌ Send Back**
   - Approve → XP awarded instantly, completion animation plays
   - Send Back → quest returns to active with an optional note (*"Try again — the dishes need re-rinsing!"*)

#### Skills System

Repeating a **type** of quest builds a named skill that visibly grows on a member's profile:

| Quest Type | Skill Name | Levels |
|---|---|---|
| Kitchen Quest | 🍳 Master Chef | 5 levels (cook 2, 5, 10, 20, 40 times) |
| Household Quest | 🧹 Tidy Titan | 5 levels (complete 5, 15, 30, 60, 100) |
| Learning Quest | 📚 Scholar | 5 levels |
| Self-Care Quest | 🌿 Wellbeing Warrior | 5 levels |
| Acts of Care | 💛 Caring Heart | 3 levels (quiet, not competitive) |

Skills are displayed on each member's character card in the Guild screen. They level up independently of overall XP. A small animated "skill up!" notification appears when a skill levels — smaller than the full level-up animation, just a brief glow.

---

### 8.3 XP, Levels & Gamification

#### XP Values

| Quest Type | XP |
|---|---|
| Self-Care Quest | 15 XP |
| Household Quest (small) | 20 XP |
| Household Quest (medium) | 30 XP |
| Household Quest (large) | 40 XP |
| Kitchen/Cooking assist | 25 XP |
| Cooking a full dinner | 50 XP |
| Learning Quest | 30 XP |
| Act of Care (gentle bonus) | 5–10 XP, shown softly |
| Bonus Quest | 10–100 XP (parent-set) |

#### Level System

| Level | Title | XP Required |
|---|---|---|
| 1 | Village Apprentice | 0 XP |
| 2 | Guild Initiate | 100 XP |
| 3 | Scout | 250 XP |
| 4 | Adventurer | 500 XP |
| 5 | Ranger | 850 XP |
| 6 | Knight | 1,300 XP |
| 7 | Champion | 1,900 XP |
| 8 | Hero | 2,700 XP |
| 9 | Legend | 3,700 XP |
| 10 | Grand Master | 5,000 XP |

Levels continue beyond 10: add 1,500 XP per level. Levels track **lifetime XP** and never reset.

**Level-Up Experience:** Full-screen animated celebration — character portrait glows, particles burst, new title text animates in, short fanfare chime plays. Tap anywhere to dismiss.

#### Redeemable Rewards (Reward Shop)

XP can be **spent** on real-world rewards that Guild Masters define. Spending XP does **not** lower your level — levels track lifetime XP *earned*, not current balance.

**How it works:**
- Guild Masters create rewards in Settings → Manage Rewards (e.g. "30 min extra screen time = 50 XP," "Pick the movie = 100 XP," "Dessert of your choice = 75 XP")
- Members see the Reward Shop in the Guild screen
- Member taps a reward → sends a "reward request" to a Guild Master to fulfill
- Guild Master approves the request → XP is deducted from the member's spendable balance
- The member's level is untouched

> **Two XP balances to track per member:**
> - `lifetimeXP` — never decreases, determines level
> - `spendableXP` — increases with approvals, decreases when rewards are redeemed

#### Weekly XP & Leaderboard

Weekly XP resets every Monday. The prior week's top earner is the **Champion of the Week** — celebrated Monday morning with a brief congratulatory screen before the dashboard loads.

---

### 8.4 Badges & Achievements

Badges are permanent, displayed on each member's character card. Unearned badges appear grayed out with a hint (adds mystery and motivation).

| Badge | Name | How to Earn |
|---|---|---|
| 🌿 | First Quest | Complete your very first quest |
| ⚡ | Speed Demon | Complete 3 quests in one day |
| 🔥 | Quest Streak | Complete at least 1 quest every day for 7 days |
| 🌟 | Overachiever | Earn 200+ XP in a single week |
| 🍳 | Legendary Chef | Cook dinner 5 times (lifetime) |
| 🍽️ | Sous Chef | Help with dinner (Kitchen Quest) 10 times |
| 📚 | Scholar | Complete 20 Learning Quests |
| 🛡️ | Reliable | Complete all assigned weekly quests 4 weeks in a row |
| 💪 | Self-Care Hero | Complete 15 Self-Care Quests |
| 👑 | Weekly Champion | Win the weekly leaderboard |
| 💛 | Caring Heart | Respond to 5 low-spoon care invitations |

> **Note on Caring Heart:** This badge should feel earned quietly. No big animation — a warm glow and a soft *"Your kindness doesn't go unnoticed 💛"* message.

---

### 8.5 Cooking Rotation

- Guild Masters set up a rotating weekly cook schedule (e.g. Week 1: Papa, Week 2: Mom, Week 3: Dad...)
- The rotation **respects capacity** — Light capacity members appear less frequently; Rowen never appears
- Rotation advances automatically each Monday
- The current week's cook is displayed prominently on the home screen and kitchen screen
- The cook for any given day can tap their day slot to add/edit the meal name

**XP for Cooking:**
- Completing a cooking night: +50 XP
- Adding meal name to the app beforehand: +10 XP bonus
- Cooking 5 nights lifetime: earns **"Legendary Chef"** badge

---

### 8.6 Recipes & Grocery List

**Recipe Library:** Guild Masters (and optionally older members) can add recipes manually — title, description, ingredients list. Recipes are stored in the app.

**Weekly Meal Plan:** Assign a recipe (or just a meal name) to each day of the week, shown alongside who's cooking.

**Grocery List:** When a recipe is selected for a night, its ingredients can be added to the grocery list with one tap. Simple checked list — tap to check off. Resets weekly with a confirmation prompt.

> **Keep it simple.** No web-scraping, no external recipe APIs, no barcode scanning, no store integration. Just a family recipe box and a checklist.

---

## 9. Data Model

> **For Claude Code:** Use `localStorage` or `IndexedDB` for all data. No backend server, no cloud sync, no accounts. All data lives on the device.

```javascript
// Family
{
  familyName: "The Johnson Quest",
  parentPIN: "hashed_pin",
  members: [Member],
  cookingRotation: CookingRotation,
  currentWeekCookId: "member_id",
  weekStartDate: "2026-06-02",
  rewards: [Reward]
}

// Member
{
  id: "uuid",
  name: "Mom",
  role: "guild_master" | "adventurer",
  avatarId: "wizard" | "knight" | "ranger" | "healer" | "bard" | "mage" | "rogue" | "paladin",
  age: null | number,
  abilityLevel: "toddler" | "child" | "teen" | "adult",
  capacity: "light" | "normal" | "heavy",
  needsBuddy: false,            // or array of quest types that need a buddy
  spoonsEnabled: true,          // parent sets per profile
  spoonsToday: 8,               // null if spoonsEnabled is false
  spoonsLastUpdated: timestamp,
  lifetimeXP: 0,                // never decreases
  spendableXP: 0,               // decreases when rewards redeemed
  level: 1,
  weeklyXP: 0,                  // resets each Monday
  badges: ["first_quest"],
  skills: {
    masterChef: 0,              // 0–5
    tidyTitan: 0,
    scholar: 0,
    wellbeingWarrior: 0,
    caringHeart: 0
  },
  joinedDate: "2026-06-02"
}

// Quest
{
  id: "uuid",
  title: "Vacuum the living room",
  type: "household" | "kitchen" | "learning" | "selfcare" | "bonus",
  assignedTo: "member_id" | "anyone",
  assignedBy: "member_id",
  buddyId: "member_id" | null,  // auto-assigned if needsBuddy
  xpValue: 30,
  xpSplitBuddy: false,          // true = split XP; false = both earn full
  status: "active" | "pending_approval" | "approved" | "sent_back",
  dueDate: "2026-06-08",
  isRecurring: false,
  templateId: "uuid" | null,
  completedAt: null | timestamp,
  approvedAt: null | timestamp,
  parentNote: ""
}

// Quest Template (recurring)
{
  id: "uuid",
  title: "Take out trash",
  type: "household",
  assignedTo: "member_id",
  xpValue: 25,
  resetDay: "monday"
}

// Recipe
{
  id: "uuid",
  title: "Pasta Bolognese",
  description: "A hearty family favorite",
  createdBy: "member_id",
  ingredients: ["pasta", "ground beef", "tomato sauce", "onion"]
}

// Cooking Rotation
{
  rotation: ["member_id_1", "member_id_2"],   // capacity-filtered, repeating
  weeklyMealPlan: {
    "2026-06-02": { cookId: "member_id", mealName: "Pasta Night", recipeId: null },
    "2026-06-03": { cookId: "member_id", mealName: "", recipeId: null }
  }
}

// Grocery List
{
  items: [{ id: "uuid", text: "pasta", checked: false }],
  weekOf: "2026-06-02"
}

// Reward
{
  id: "uuid",
  title: "30 min extra screen time",
  xpCost: 50,
  createdBy: "member_id"
}

// Reward Request
{
  id: "uuid",
  rewardId: "uuid",
  requestedBy: "member_id",
  status: "pending" | "approved" | "declined",
  requestedAt: timestamp
}
```

---

## 10. Animations & Interactions

These are not optional — the animations ARE the product for kids.

| Interaction | Animation |
|---|---|
| Quest completed (before approval) | Card flips, shows ⏳ shimmer state |
| Quest approved by Guild Master | Gold coin particle burst, XP counter animates up |
| Level up | Full-screen flash, character glow, title reveal, chime |
| Skill level up | Small glow pulse on skill icon, brief "*Skill Up!*" toast |
| Badge earned | Badge unlocks with a shine sweep effect |
| Caring Heart XP | Soft warm glow, no coins — a quiet 💛 animation |
| Weekly champion announcement | Confetti, crown, champion's avatar zooms in |
| Profile tap on selection screen | Character avatar bounces/wobbles |
| Leaderboard load | Entries animate in from bottom, one by one |
| Navigation tab switch | Smooth slide transition |
| Spoon count updated | Spoon icons fill/empty with a gentle ripple |
| Low-spoon nudge appears | Soft slide-in from top, warm amber color, not urgent |

> Keep all animations under 1.5 seconds. Always allow tap-to-skip for level-up and champion animations. Caring Heart and spoon animations should be noticeably softer and quieter than quest completion animations — different emotional register.

---

## 11. What the App Must NEVER Do

Hard constraints. Do not build these, even if they seem like improvements.

- ❌ No user accounts, email addresses, or passwords (except the local Parent PIN)
- ❌ No internet connection required for core functionality
- ❌ No advertisements of any kind
- ❌ No in-app purchases or real money features
- ❌ No push notifications
- ❌ No social sharing (this is a private family app)
- ❌ No barcode scanner or store integration
- ❌ No external API calls or AI-generated content
- ❌ No dark patterns (fake urgency, guilt messaging, manipulation)
- ❌ No data collection or analytics
- ❌ No shaming or punishment mechanics — missing a quest means no XP earned, never XP lost
- ❌ Never frame low spoon count as failure, weakness, or a problem to fix
- ❌ Never treat acts of care as a transactional chore with a big XP reward banner
- ❌ Do not use the word "chores" anywhere in the UI — always "quests"

---

## 12. Technical Specifications

### Platform
- **Web app** (React) — runs in the tablet's browser, bookmarked to home screen as a PWA
- No app store required
- **Target device:** Shared family tablet (iPad or Android), portrait orientation primary

### Tech Stack
```
Framework:     React (with hooks)
Styling:       Tailwind CSS + custom CSS for animations
Data storage:  localStorage or IndexedDB
Fonts:         Google Fonts — Cinzel + Nunito + Bebas Neue
Icons:         Lucide React + custom emoji-style SVGs
Animations:    Framer Motion or CSS keyframes
PWA:           manifest.json + service worker for offline support
```

### Performance
- Initial load under 3 seconds on WiFi
- All interactions respond within 100ms
- Animations at 60fps
- Works offline after first load

### Browser Support
- Chrome/Chromium (primary)
- Safari (iPad)
- Firefox (secondary)

---

## 13. Starter Profiles (Seed Data for Testing)

Claude Code should seed the app with these profiles so there's real data to build and test against. These are starting examples — a Guild Master can edit them in-app at any time.

| Name | Age | Role | Ability | Capacity | Buddy? | Spoons | Notes |
|---|---|---|---|---|---|---|---|
| Dad | — | Guild Master | Full | Heavy | No | 10 default | Stay-at-home; carries the baseline daily load |
| Mom | — | Guild Master | Full | Light | No | Varies | Works full-time + chronic illness; fewer dinners & smaller quest target by design. **Spoons matter most here.** |
| Papa | — | Guild Master | Full | Normal | No | 10 default | Grandparent, lives with family, very involved; full adult in rotation |
| Nezzie | 10 | Adventurer | Most tasks + cooking **with buddy** | Normal | Yes — cooking only | 8 default | Can cook but auto-pairs with adult; great for Master Chef skill |
| Rowen | 2 | Adventurer | Toddler-safe only | Light | n/a | Disabled | Only sees tiny tasks (e.g. "put toys in the bin"); never in cooking rotation; no spoon tracking; lots of celebration, zero pressure |

---

## 14. Build Phases

Build in phases. Complete and review each phase before starting the next.

### Phase 1 — Foundation
- [ ] App shell with bottom navigation
- [ ] Profile Selection screen with avatar system
- [ ] First-time setup wizard (name, role, ability, capacity, buddy flags, spoon toggle)
- [ ] Parent PIN protection
- [ ] Basic home dashboard layout
- [ ] Data persistence (localStorage/IndexedDB)
- [ ] Seed with starter profiles from Section 13

**Checkpoint:** Can you tap a profile and enter a dashboard? Does the PIN work for Guild Masters?

### Phase 2 — Quests & Fairness Engine
- [ ] Quest list screen (Adventurer view, filtered by capability)
- [ ] Quest assignment (Guild Master view, capacity-weighted suggestions)
- [ ] Buddy auto-pairing on assignment
- [ ] Quest completion flow (mark done → Guild Master approves)
- [ ] Quest Templates (recurring weekly)
- [ ] XP awarding on approval (lifetimeXP + spendableXP + weeklyXP)

**Checkpoint:** Can a Guild Master assign a filtered quest, a kid complete it, and the master approve it with XP awarded to both if buddied?

### Phase 3 — Gamification
- [ ] XP and Level system (lifetime + spendable + weekly)
- [ ] Level-up animation + chime
- [ ] Skills system (per quest type, 5 levels each)
- [ ] Badge/Achievement system
- [ ] Reward Shop (Guild Masters create rewards, members redeem)
- [ ] Family Leaderboard (weekly + all-time)
- [ ] Weekly champion announcement

**Checkpoint:** Does leveling up feel exciting? Are skills tracking? Can a member redeem a reward?

### Phase 4 — Spoon Theory
- [ ] Daily spoon-setting UI (tap row of 🥄 icons, per member, if enabled)
- [ ] Spoon count display on home screen (Guild Status bar)
- [ ] Low-spoon detection logic (≤3 spoons + demanding duty today)
- [ ] "Cover the shift" nudge card (cooking swap with XP transfer)
- [ ] "Acts of care" suggestion card (warm prompts, kid-friendly)
- [ ] Care XP (soft, quiet — not a chore banner)
- [ ] Caring Heart skill/badge tracking

**Checkpoint:** Set Mom to 2 spoons. Does the nudge appear? Can Dad volunteer to cover dinner? Does the XP transfer correctly?

### Phase 5 — Kitchen
- [ ] Cooking rotation calendar (capacity-weighted, auto-advances Monday)
- [ ] Tonight's Dinner card on home screen
- [ ] Recipe library
- [ ] Grocery list with weekly reset

**Checkpoint:** Does the cooking rotation exclude Mom more than Dad? Does it show tonight's dinner on the home screen?

### Phase 6 — Polish
- [ ] All animations and micro-interactions (per Section 10)
- [ ] Sound effects (level-up chime, completion sound)
- [ ] PWA manifest + service worker (offline support)
- [ ] Tablet layout optimization (portrait + landscape)
- [ ] Empty states for new users
- [ ] Final visual polish

---

## 15. Copy & Tone Guide

The app has two emotional registers. Get both right.

### Quest & Game Copy — Friendly Dungeon Master
Encouraging, playful, a little dramatic. Never corporate, never guilt-inducing.

| Context | Say... |
|---|---|
| Quest list empty | "Your quest log is clear, adventurer. Rest well… or seek glory!" |
| Awaiting approval | "Quest submitted! Awaiting the Guild Master's seal of approval ⏳" |
| Quest sent back | "The Guild Master has returned this quest — check the note and try again, brave one." |
| Level up | "⚡ YOU HAVE ASCENDED! Welcome, [Title]!" |
| First login | "Welcome to the [Family Name] Quest! Your adventure begins NOW." |
| Low quest XP week | "The guild grows stronger together. Complete a quest today!" |

### Spoon & Care Copy — Warm and Human
Soft, warm, never urgent, never alarming. Written for the whole family including young kids.

| Context | Say... |
|---|---|
| Someone is low on spoons | "[Name]'s running a little low on spoons today 🥄" |
| Cover the shift nudge | "Heads up — [Name]'s running low on spoons today. Who'd like to pick up dinner tonight?" |
| Acts of care prompt | "[Name]'s low on spoons right now. Want to help? You could: fill their water bottle 💧, give them a hug 🤗, or take one thing off their list." |
| After an act of care | "That was so kind 💛 +a little XP" |
| Caring Heart badge earned | "Your kindness doesn't go unnoticed 💛" |
| Spoons set to full | "Ready for the day! 🥄🥄🥄🥄🥄" |

---

## 16. Out of Scope (Future Ideas — Do Not Build Now)

- Photo upload for recipe thumbnails (use emoji for v1)
- Meal rating / family voting on recipes
- Chore difficulty voting by kids
- Seasonal / holiday quest themes
- Notifications / push reminders (great v2 feature)
- Calendar integrations
- Multiple households / family sharing
- Guest profiles (grandparents visiting, babysitters)
- Streaks and daily login bonuses

---

## 17. Glossary (In-App Terms)

| Real World | In-App Name |
|---|---|
| Chore / Task / To-do | Quest |
| Points | XP (Experience Points) |
| User / Person | Guild Member / Adventurer |
| Admin / Parent | Guild Master |
| Profile | Character |
| Achievement | Badge |
| Leaderboard | Guild Rankings |
| Cooking turn | Kitchen Duty |
| Home screen | The Realm |
| Daily energy level | Spoons 🥄 |
| Act of kindness | Act of Care |

---

*End of PRD — FamilyQuest v2.0*
*Built with love, for the whole family — including the ones running low on spoons. 🏰💛*
