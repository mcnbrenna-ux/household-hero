# 📜 Product Requirements Document
# FamilyQuest — v3.0

**Version:** 3.0 (full feature expansion + visual pivot)
**Date:** June 2026
**Prepared for:** Claude Code

---

## ⚠️ How to Use This Document

Hand to Claude Code and say:
*"Read family-quest-PRD-v3.md and DESIGN-NOTES-v2.md in full. Do not write any code yet. Give me your plan for Phase 1, then wait for my approval."*

Build one phase at a time. Review and approve before continuing.

---

## 1. What This App Is

FamilyQuest is a shared family tablet app that makes household life less chaotic and genuinely fun. It replaces arguments about chores and dinner with a game the whole family actually wants to play — including a 2-year-old and a 10-year-old.

It does five things:
1. **Quests** — assigns chores as quests, tracks completion, rewards with XP
2. **Dinner rotation** — whose week, what are we making, what do we need
3. **Grocery list** — shared, real-time, auto-categorized
4. **Feelings & Wellbeing** — kids check in emotionally, get suggestions, request parent approval
5. **Family calendar** — shared, centralized, everyone sees it

The glue: **gamification + avatar builder**. Everything earns XP. XP buys clothes for your custom creature character. The leaderboard is always visible. It feels like a game, not a to-do list.

### One-liner
> *"The family app that makes kids ask to do chores."*

### Success looks like
- Family uses it every day without being nagged
- Nobody asks "whose turn is it to cook?" or "what are we having tonight?"
- Chores get done more often
- Kids use the feelings check-in
- Grocery list is shared and shopping is faster
- Calendar is the family's one source of truth

---

## 2. Users & Roles

**Family size:** 5+ members, up to 8 profiles.

### Guild Master (Parent)
- Full access to everything
- Assigns quests, approves completions before XP awards
- Manages cooking rotation, recipes, reward shop
- Receives activity approval requests from kids via push notification
- Can see kids' feelings check-in history
- Protected by 4-digit PIN

### Adventurer (Kid)
- Sees own quests + family leaderboard
- Marks quests complete (pending parent approval)
- Uses feelings check-in + "I'm bored" feature
- Sends activity requests to parents
- Spends XP on avatar items in reward shop
- Cannot edit assignments or settings

### Age accommodation
- **Rowen (age 2):** 2–3 tiny tasks max. Giant tap targets. Pure celebration. No spoon tracking, no leaderboard pressure.
- **Nezzie (age 10):** Full kid view. Auto-paired with adult for cooking quests.
- **Adults:** Full parent view with PIN.

---

## 3. No Login — Profile Selection

No accounts, no email, no passwords. Lives on one shared tablet.

- App opens to Profile Selection — large creature character cards for every member
- Kids tap card → straight into dashboard
- Parents tap card → 4-digit PIN → parent dashboard

### First-time setup wizard
1. Name the family ("The Johnson Family HQ")
2. Add members: name, role, build avatar, age, capacity, buddy flag
3. Set parent PIN
4. Optional: seed with starter quests + cooking rotation
5. Enter the app

---

## 4. The Fairness Engine

**Layer 1 — Capability (hard filter)**
The app never offers a task someone can't do.
- Rowen: toddler-safe only. Never cooking.
- Nezzie: most tasks + cooking with a buddy.
- Adults: everything.

**Layer 2 — Capacity (fair share)**
Light / Normal / Heavy per profile.
- Mom (chronic illness, full-time) → Light. Fewer dinner turns, smaller quest load. By design.
- Dad (stay-at-home) → Heavy. Baseline daily load.

**Layer 3 — Buddy pairing**
Flagged tasks auto-pair a helper. Nezzie + cooking = adult buddy auto-assigned. Both earn XP.

---

## 5. Spoon Theory — Daily Energy

Based on Spoon Theory. Makes family energy visible so everyone can respond with care.

- Each adult (optionally older kids) taps a spoon row (1–10). One tap, updates anytime.
- Visible to everyone — kids can see "Mom's low today."

**When someone is at 3 spoons or fewer:**
1. Soft nudge to family: *"Mom's running low on energy today. Who'd like to cover dinner?"*
2. Care suggestions: *"Want to help? Fill her water bottle, give her a hug, take one thing off her list."*

**Non-negotiable tone rules:**
- Never red, alarming, or urgent for low spoons
- Care XP is quiet and warm — never a loud transactional banner
- Low spoons never costs points, never implies failure

---

## 6. Avatar Builder (Signature Feature)

Each family member builds a custom **abstract blob/creature character** — not a human, not a generic RPG sprite. Think chunky weird little animals with googly eyes and big personality. Reference: the emotion creature cards and 3D clay characters from the Pinterest board.

### Customizable elements
- **Body shape:** round, tall, square, blobby, spiky (5–8 options)
- **Color:** full color picker or preset swatches
- **Eyes:** googly, sleepy, sparkly, determined, starry (6+ options)
- **Accessories:** hat, wings, bag, shoes, outfit (basic set free; more from reward shop)
- **Name tag:** always displayed under avatar

### Avatar appears everywhere
- Profile selection (large)
- Leaderboard (medium)
- Quest cards (small chip)
- Feelings check-in screen (reacts to chosen emotion)
- Level-up celebration (dances!)
- Weekly champion screen (dances bigger)

### Reward Shop — Avatar Items (XP costs set by parents)
Examples: astronaut helmet (50 XP), rainbow wings (75 XP), pizza slice hat (40 XP), sparkle trail (100 XP), tiny backpack (60 XP).

**Two XP balances — never conflate:**
- `lifetimeXP` → determines level, never decreases
- `spendableXP` → earns with quest approvals, spends on avatar items

---

## 7. Quests (Never call them chores in the UI)

### Two quest types

**Daily Quests** — reset every morning automatically
- Make bed, brush teeth, put dishes away
- Auto-assigned, low XP (10–15), build streaks

**Weekly Quests** — assigned by parents, reset Monday
- Vacuum, laundry, trash, bathroom
- Higher XP (20–50), require parent approval

### Quest categories & XP

| Category | Examples | XP |
|---|---|---|
| Household | Vacuum, dishes, laundry | 20–40 |
| Kitchen | Help with dinner, set table | 25 |
| Learning | Read 20 min, finish homework | 30 |
| Self-Care | Shower, tidy room, rest | 15 |
| Daily | Make bed, brush teeth | 10–15 |
| Bonus | Parent-defined specials | 10–100 |

### Completion flow
1. Kid taps "Done!"
2. Card enters pending state — shimmer, hourglass icon
3. Parent gets badge on dashboard + push notification
4. Parent approves → XP awarded, celebration animation plays
5. Parent sends back → returns to active with a note

---

## 8. XP, Levels & Gamification

### Level table

| Level | Title | XP Required |
|---|---|---|
| 1 | Tiny Helper | 0 |
| 2 | Quest Starter | 100 |
| 3 | Home Scout | 250 |
| 4 | House Pro | 500 |
| 5 | Quest Champion | 850 |
| 6 | Family Hero | 1,300 |
| 7 | Legendary Helper | 1,900 |
| 8 | Grand Champion | 2,700 |
| 9 | Family Legend | 3,700 |
| 10 | Quest Master | 5,000 |

Continues: +1,500 XP per level beyond 10. Levels never reset.

### Weekly leaderboard
Resets Monday. Prior week's winner gets a "Champion of the Week" celebration — avatar dances on home screen for the whole family to see.

### Skills (repeating quest types build skills)
- Kitchen Wizard, Tidy Champion, Learning Star, Self-Care Pro, Kind Heart (care — quiet, 3 levels)

### Badges
First Quest, Speed Star (3 quests in a day), 7-Day Streak, Big Week (200+ XP), Master Chef, Sous Chef, Learning Star, Rock Solid (all weeklies 4 weeks straight), Self-Care Hero, Weekly Champ, Kind Heart.

---

## 9. Dinner Rotation & Kitchen

- Capacity-weighted rotation (Mom appears less, Rowen never)
- Auto-advances Monday
- Cook logs meal name each night → shows on home screen hero card
- Recipe library: parents add recipes manually (title, description, ingredients)
- Linking a recipe to a night → one-tap add all ingredients to grocery list

**XP for cooking:**
- Full dinner: +50 XP
- Logging meal name in advance: +10 XP bonus
- 5 dinners lifetime: Master Chef badge

---

## 10. Grocery List

Shared, real-time. Anyone adds, everyone sees immediately.

- Type to add items (voice input if browser supports it)
- **Auto-categorization** — items sort into: Produce, Dairy, Meat, Pantry, Frozen, Household, Other
- Tap to check off while shopping. Checked items move to bottom (not deleted).
- "Clear checked" after shopping trip
- Recipe → grocery list: one tap adds all ingredients, auto-categorized
- Weekly reset with confirmation prompt

---

## 11. Feelings Check-In (Kids Feature)

### Emotion creature picker
1. Kid taps "How are you feeling?" from dashboard
2. Full-screen grid of emotion creatures — each emotion is a unique blob with a face (see Pinterest Image 11 — the "curious/angry/nervous/shy" card grid)
3. Kid taps their creature
4. App responds warmly with 2–3 options: breathing exercise, activity suggestion, sensory activity

**Emotions to include:** happy, excited, calm, curious, silly, tired, sad, nervous, frustrated, angry, bored, proud, shy, brave

**Creature design:** Each is a unique blob shape + color + simple line-drawn face. Even "angry" is a little funny, never scary.

### Breathing exercise
- Blob character animates: expands on inhale, contracts on exhale
- Simple text: "Breathe in... hold... breathe out..."
- Kid's own avatar follows along

### "I'm bored, what should I do?" flow
1. Kid taps "I'm bored"
2. App shows activity ideas (bike ride, bake something, read, draw, play outside, watch a show)
3. Kid picks one
4. If needs parent approval → **push notification** to parent: *"Nezzie wants to go for a bike ride. Yes or No?"*
5. Parent taps Yes/No on notification or in-app
6. Kid sees answer immediately on screen

### Privacy
- Parents can view child's feelings history (date, emotion, activity)
- Kids cannot see each other's check-ins
- Fully optional — no pressure to check in

---

## 12. Shared Family Calendar

Simple shared calendar. Not a Google Calendar replacement — family-focused and clean.

- Monthly and weekly view
- Anyone can add events (parents can restrict kids)
- Events: name, time, member assignment, color (matches avatar color)
- Cooking rotation auto-populates (who cooks which night)
- Push notification reminders (opt-in per event)
- School events, appointments, outings, birthdays

---

## 13. Push Notifications

All opt-in. Helpful, never nagging.

| Notification | Who Gets It |
|---|---|
| "It's your week to cook!" (Monday) | That week's cook |
| "You have X quests today" (morning) | Each member with active quests |
| "[Kid] wants to [activity]. Yes or No?" | Parents |
| "Quest approved! You earned X XP" | The kid who completed it |
| "[Event] is tomorrow" | Relevant members |
| "You're in 1st place this week!" | That family member |

All configurable per member in Settings.

---

## 14. Navigation

### Bottom nav bar (icon + label, no emoji)
```
Home  |  Quests  |  Kitchen  |  Calendar  |  Guild
```

Settings accessible from home screen (parent PIN for admin sections).

---

## 15. Data Model

All data in localStorage / IndexedDB. No backend, no cloud, no accounts.

```javascript
// Member
{
  id: "uuid",
  name: "Nezzie",
  role: "adventurer" | "guild_master",
  age: 10,
  abilityLevel: "toddler" | "child" | "teen" | "adult",
  capacity: "light" | "normal" | "heavy",
  needsBuddy: ["kitchen"],
  spoonsEnabled: true,
  spoonsToday: 8,
  avatar: {
    bodyShape: "round",
    color: "#FF6B6B",
    eyes: "sparkly",
    equippedAccessories: ["rainbow_wings"],
    unlockedAccessories: ["rainbow_wings", "pizza_hat"]
  },
  lifetimeXP: 0,
  spendableXP: 0,
  weeklyXP: 0,
  level: 1,
  badges: [],
  skills: { kitchenWizard: 0, tidyChampion: 0, learningStar: 0, selfCarePro: 0, kindHeart: 0 },
  feelingsHistory: [{ date: "2026-06-03", emotion: "nervous", activity: "breathing" }]
}

// Quest
{
  id: "uuid",
  title: "Vacuum the living room",
  category: "household" | "kitchen" | "learning" | "selfcare" | "daily" | "bonus",
  isDaily: false,
  assignedTo: "member_id" | "anyone",
  assignedBy: "member_id",
  buddyId: "member_id" | null,
  xpValue: 30,
  status: "active" | "pending_approval" | "approved" | "sent_back",
  dueDate: "2026-06-08",
  isRecurring: false,
  parentNote: ""
}

// Grocery Item
{
  id: "uuid",
  text: "pasta",
  category: "pantry" | "produce" | "dairy" | "meat" | "frozen" | "household" | "other",
  checked: false,
  addedBy: "member_id"
}

// Activity Request
{
  id: "uuid",
  requestedBy: "member_id",
  activity: "go for a bike ride",
  status: "pending" | "approved" | "declined",
  requestedAt: timestamp
}

// Calendar Event
{
  id: "uuid",
  title: "Soccer practice",
  date: "2026-06-05",
  time: "3:30 PM",
  forMember: "member_id" | "all",
  memberColor: "#FF6B6B",
  reminderEnabled: true
}

// Feeling Check-In
{
  id: "uuid",
  memberId: "member_id",
  emotion: "nervous",
  activitySuggested: "breathing exercise",
  timestamp: timestamp
}

// Reward Shop Item
{
  id: "uuid",
  name: "Rainbow Wings",
  avatarAccessoryId: "rainbow_wings",
  xpCost: 75,
  createdBy: "member_id"
}
```

---

## 16. Animations

| Interaction | Animation |
|---|---|
| Quest marked done | Card shimmer, hourglass appears |
| Quest approved | Confetti from avatar, XP counts up with spring |
| Level up | Avatar dances, title reveals, chime — skippable |
| Skill up | Small glow, quiet toast |
| Badge earned | Badge flips in, shine sweep |
| Care XP | Soft warm pulse, no confetti |
| Emotion creature tap | Creature bounces, color ripple |
| Breathing exercise | Avatar expands (inhale) / contracts (exhale) with timing cues |
| Activity request sent | Paper airplane flies off screen |
| Activity approved | Green check + avatar cheers |
| Avatar item unlocked | Item floats onto avatar with sparkles |
| Profile card tap | Card lifts with spring physics |
| Weekly champion | Avatar dances full-width Monday morning |
| Grocery item added | Item slides into its category with a satisfying pop |

---

## 17. Copy & Tone

### Game voice (energetic, warm)
- Quest list empty: "All clear! Rest up or grab a bonus quest 🌟"
- Quest pending: "Nice work! Waiting on the thumbs up ⏳"
- Quest sent back: "Almost! Check the note and give it another go."
- Level up: "YOU LEVELED UP! Welcome, [Title]!"

### Feelings voice (gentle, child-appropriate)
- Feeling picker: "Hey [Name] — how are you feeling right now?"
- After selection: "Thanks for sharing 💛 Here are some things that might help:"
- Breathing: "Let's breathe together. Follow [their avatar]..."
- Request sent: "Sent! [Parent] will let you know soon 📨"
- Approved: "[Parent] said YES! Have fun 🎉"
- Declined: "Not right now — maybe ask again later 💛"

### Spoon voice (soft, never alarming)
- Low nudge: "[Name]'s running a little low on energy today 🥄"
- Cover shift: "Who'd like to take over dinner tonight?"
- After care: "That was so thoughtful 💛 +a little XP"

---

## 18. Hard Rules — Never Violate

- ❌ Never call tasks "chores" in the UI
- ❌ No accounts, email, passwords
- ❌ No ads, ever
- ❌ No in-app purchases or real money
- ❌ No shaming — missing a quest = 0 XP, never negative XP
- ❌ No alarming language around low spoons
- ❌ No loud transactional care XP
- ❌ No pressure on the feelings check-in
- ❌ Rowen's experience = pure celebration only

---

## 19. Tech Stack

```
Framework:     React + hooks
Styling:       Tailwind CSS + custom CSS
Storage:       localStorage / IndexedDB
Fonts:         Google Fonts (see DESIGN-NOTES-v2.md)
Icons:         Lucide React (no emoji as UI icons)
Animation:     Framer Motion
PWA:           manifest.json + service worker
Notifications: Web Push API
```

---

## 20. Starter Profiles (Seed Data)

| Name | Age | Role | Ability | Capacity | Buddy | Spoons |
|---|---|---|---|---|---|---|
| Dad | — | Guild Master | Full | Heavy | No | 10 |
| Mom | — | Guild Master | Full | Light | No | Varies |
| Papa | — | Guild Master | Full | Normal | No | 10 |
| Nezzie | 10 | Adventurer | Most + cooking w/ buddy | Normal | Kitchen | 8 |
| Rowen | 2 | Adventurer | Toddler only | Light | n/a | Off |

---

## 21. Build Phases

### Phase 1 — Foundation
- [ ] App shell + bottom nav
- [ ] Profile selection screen
- [ ] First-time setup wizard
- [ ] Avatar builder (body, color, eyes, basic accessories)
- [ ] Home dashboard skeleton
- [ ] localStorage persistence

**Checkpoint:** Can you build an avatar and enter a dashboard?

### Phase 2 — Quests
- [ ] Daily quests (auto-reset each morning)
- [ ] Weekly quests (parent assigns, capability-filtered)
- [ ] Quest completion → approval flow
- [ ] XP awarding (both balances)
- [ ] Buddy auto-pairing

**Checkpoint:** Full quest loop end-to-end?

### Phase 3 — Gamification
- [ ] Level system + avatar level-up dance animation
- [ ] Skills system
- [ ] Badges
- [ ] Leaderboard (weekly + all-time)
- [ ] Reward shop + avatar accessories unlock
- [ ] Weekly champion celebration

**Checkpoint:** Does leveling up feel exciting? Can a kid buy a hat for their avatar?

### Phase 4 — Spoon Theory
- [ ] Spoon-setting UI
- [ ] Spoon display on home screen
- [ ] Low-spoon nudge + cover-shift flow
- [ ] Care suggestions + quiet XP
- [ ] Kind Heart skill

**Checkpoint:** Set Mom to 2 spoons — does the nudge appear?

### Phase 5 — Kitchen & Grocery
- [ ] Cooking rotation (capacity-weighted)
- [ ] Tonight's Dinner hero card
- [ ] Recipe library
- [ ] Grocery list — shared, auto-categorized
- [ ] Recipe → grocery one-tap flow

**Checkpoint:** Does pasta auto-categorize under Pantry?

### Phase 6 — Feelings & Calendar
- [ ] Emotion creature grid (14 emotions, each a unique blob)
- [ ] Breathing exercise animation (avatar-guided)
- [ ] Activity suggestion flow
- [ ] "I'm bored" → activity picker → parent push notification
- [ ] Parent approve/decline flow
- [ ] Shared family calendar (monthly + weekly)
- [ ] Cooking rotation auto-populates calendar

**Checkpoint:** Can Nezzie pick "nervous," do a breathing exercise, ask to bike, and have Mom get a notification?

### Phase 7 — Polish
- [ ] All animations (Section 16)
- [ ] Sound effects (level-up chime, completion, gentle care sounds)
- [ ] PWA + service worker
- [ ] Tablet layout optimization
- [ ] Empty states
- [ ] Rowen's simplified view
- [ ] Final DESIGN-NOTES-v2.md polish pass

---

## 22. Out of Scope for v1
Recipe web scraping, Google Calendar sync, multiple households, barcode scanning, voice assistant, photo upload for avatars/recipes.

---

## 23. Glossary

| Real Word | In-App Word |
|---|---|
| Chore / task | Quest |
| Points | XP |
| Parent | Guild Master |
| Kid | Adventurer |
| Profile | Character |
| Achievement | Badge |
| Leaderboard | Guild Rankings |
| Cooking turn | Kitchen Night |
| Home screen | Family HQ |
| Daily energy | Spoons |
| Kindness | Act of Care |

---

*End of PRD — FamilyQuest v3.0*
*Built for the whole family, including the ones who need a breathing exercise first. 💛*
