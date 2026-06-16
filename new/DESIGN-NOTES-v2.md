# FamilyQuest — DESIGN-NOTES v2
# Complete visual redesign. Based on Pinterest inspiration board reviewed June 2026.
# Claude Code: read this in full before touching ANY UI. Everything here overrides what was built before.

---

## The New Direction — One Paragraph

**Liquid glass surfaces + chunky abstract creature avatars + bold joyful color.**

Think Apple's liquid glass UI (iridescent, frosted, layered) married to the clay/blob creature energy of the Habitz and Clay apps. The interface is modern and premium — glassy surfaces, soft depth, refined typography. The characters are weird little blobs with googly eyes and huge personality — not humans, not RPG sprites, not generic animals. The color is bold and saturated but warm, not neon. The whole thing should feel like it was designed by a creative studio that also makes beautiful things for kids.

---

## What We're Leaving Behind — Do Not Recreate

- ❌ Dark navy / deep space background
- ❌ Medieval / fantasy RPG aesthetic — gone completely
- ❌ Cinzel / Bebas Neue / medieval display fonts
- ❌ Jewel tone color scheme (teal/purple/ruby)
- ❌ Parchment textures, dungeon language, sword/shield icons
- ❌ Generic emoji used as navigation or UI icons
- ❌ Cold, corporate "dark mode" feel
- ❌ Anything that looks like a finance app or productivity dashboard

---

## Visual References — What Each Image Tells Us

**Images 1 & 2 (Liquid Glass UI Kit):**
This is the structural language. Frosted pill buttons with iridescent sheen. Layered glass panels. Inner highlight bands. Elevation shadows. Outer shells with refracted light. This is how ALL interactive surfaces should feel.

**Image 3 (Emotion Shapes):**
The graphic vocabulary. Bold abstract shapes with personality. These inform the avatar body shapes — round, spiky, blobby — and the illustration style used throughout.

**Image 4 (Habitz app):**
The closest overall app reference. Light/airy backgrounds, chunky blob mascots, card-based layout, friendly rounded typography. Note that it uses a **light background** — we're taking this direction (or a very soft warm background, not harsh dark).

**Image 5 (Glowing blob character):**
The emotional register for care/spoon moments. Soft gradient glow, minimal face, floating on a blue wash. This is how warmth and gentleness look visually — not particles and confetti.

**Image 6 (3D clay animal characters):**
The avatar style. Each character is 3D-ish, chunky, with a solid bold background color per card. Each has its own personality. The character IS the card — big, prominent, takes up most of the screen when selected.

**Image 7 (Cyber pastel / iridescent):**
The iridescent/holographic accent. Used sparingly — special moments, achievement unlocks, premium accessories in the avatar shop. Not everywhere.

**Image 8 (TikTok wellbeing screens):**
DIRECTLY references the feelings check-in. Full-bleed color background per emotion. Simple bold headline. Abstract blob character that changes color/pose per mood. This is exactly how each emotion card and the breathing exercise screen should look.

**Image 9 (Teen Talk branding):**
The graphic/typographic energy. Bold type, abstract squiggle shapes as decoration, bright flat accent colors. Used for illustration elements, category headers, empty states, and celebration moments.

**Image 10 (Clay app):**
The complete synthesis. 3D clay characters, bold type, light card backgrounds, green/blue/yellow/pink accents. The navigation is clean and icon-based. Cards have rounded corners and feel almost physical.

**Image 11 (Emotion creature cards):**
DIRECTLY what the feelings check-in grid looks like. Each emotion = a unique blob creature in a specific color, with a simple drawn face, on a cream card with the emotion word below. Build these exactly like this.

---

## Background & Overall Feel

**Go light, not dark.** Based on the reference images (especially Habitz, Clay app), use a **warm off-white / cream background** as the base — not dark navy, not pure white.

```css
--bg-base:      #FAF8F5;   /* Warm cream — main background */
--bg-surface:   #FFFFFF;   /* Pure white — card surfaces */
--bg-muted:     #F0EDE8;   /* Slightly warm gray — secondary areas */
--bg-overlay:   rgba(255, 255, 255, 0.85); /* Glass overlay */
```

**Atmosphere:** Add very subtle colored radial gradients behind key screens (not visible as gradients, just as a warm/cool tint that gives the page life). Example: a faint coral glow at top right of the home screen.

---

## Color System

Bold, saturated accents on a light neutral base. Each color has a purpose.

```css
/* Primary actions & XP */
--coral:        #FF6B6B;   /* Warm red-coral — primary CTA, XP, energy */
--coral-light:  #FFE5E5;   /* Coral tint — backgrounds for coral elements */

/* Rewards & achievements */
--amber:        #FFAB2E;   /* Rich amber/gold — badges, rewards, stars */
--amber-light:  #FFF3D6;   /* Amber tint */

/* Calm / info / spoons */
--sky:          #5BC4F5;   /* Bright sky blue — spoons, calm states */
--sky-light:    #E3F6FF;   /* Sky tint */

/* Success / completion */
--mint:         #3ECFAB;   /* Teal mint — approved, complete, success */
--mint-light:   #E0FBF4;   /* Mint tint */

/* Feelings accents (full-bleed per emotion — see feelings section) */
--feelings-happy:     #FFD93D;
--feelings-calm:      #74C7EC;
--feelings-nervous:   #A78BFA;
--feelings-angry:     #FF6B6B;
--feelings-sad:       #93C5FD;
--feelings-excited:   #FB923C;
--feelings-tired:     #CBD5E1;
--feelings-proud:     #34D399;
--feelings-bored:     #FCD34D;
--feelings-silly:     #F472B6;

/* Neutrals */
--text-primary:   #1A1A1A;   /* Near-black — headlines, key text */
--text-body:      #3D3D3D;   /* Dark gray — body copy */
--text-muted:     #9CA3AF;   /* Medium gray — secondary info */
--text-light:     #D1D5DB;   /* Light gray — placeholders, disabled */

/* Liquid glass components */
--glass-bg:       rgba(255, 255, 255, 0.7);
--glass-border:   rgba(255, 255, 255, 0.9);
--glass-shadow:   0 8px 32px rgba(0, 0, 0, 0.08);
--glass-blur:     blur(16px);
```

---

## Typography

Modern, rounded, joyful. Not medieval. Not corporate.

```css
/* Display / Hero — bold, geometric, personality */
font-family: 'Nunito', sans-serif;
/* Weights: 800 (hero titles), 700 (section headers) */
/* Use for: screen titles, level-up text, welcome screens, big numbers */

/* Body / UI — clean, warm, readable */
font-family: 'Plus Jakarta Sans', sans-serif;
/* Weights: 600 (labels, buttons), 400 (body) */
/* Use for: quest titles, descriptions, labels, body copy */

/* Numbers / XP / Stats — clear, distinct */
font-family: 'Fredoka', sans-serif;
/* Weight: 600 */
/* Use for: XP counts, leaderboard numbers, level numbers */
```

### Type scale
```
Hero title:    48px / Nunito 800      — level up screen, welcome
Display:       32px / Nunito 800      — screen titles
Heading:       22px / Nunito 700      — section headers, card titles
Subhead:       17px / Plus Jakarta 600 — labels, quest titles, names
Body:          15px / Plus Jakarta 400 — descriptions, body copy
Small:         13px / Plus Jakarta 400 — timestamps, secondary info
XP number:     36px / Fredoka 600     — XP displays, scores
Stat:          24px / Fredoka 600     — leaderboard, smaller numbers
```

Minimum body text on tablet: **16px**. Minimum tap target: **56px**.

---

## The Liquid Glass Component System

Every interactive surface uses the liquid glass treatment. This is the core visual language.

### Glass card (base)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  padding: 20px 24px;
}
```

### Glass pill button (primary)
```css
.btn-primary {
  background: linear-gradient(135deg, var(--coral) 0%, #FF8E53 100%);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 100px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
  color: white;
  font-family: 'Plus Jakarta Sans';
  font-weight: 600;
  height: 56px;
  padding: 0 28px;
}
```

### Glass pill button (secondary / ghost)
```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 100px;
  height: 56px;
  color: var(--text-body);
}
```

### Iridescent highlight (for special moments)
```css
.iridescent {
  background: linear-gradient(135deg,
    rgba(255, 182, 255, 0.4),
    rgba(130, 220, 255, 0.4),
    rgba(255, 220, 130, 0.4));
  border: 1.5px solid rgba(255, 255, 255, 0.8);
}
/* Use for: avatar shop items, badge unlocks, level-up card, weekly champion */
```

---

## Avatar Creature Design System

The creatures are the heart of the app's personality. They must feel handmade and weird, not generic.

### Body shapes (CSS/SVG based — not image files)
Build avatars programmatically from SVG shapes so they render at any size:
- **Round blob** — slightly irregular circle (not perfect)
- **Tall blob** — elongated oval with slight wobble
- **Chunky square** — rounded square with soft corners
- **Spiky** — blob with small spikes around perimeter
- **Pudgy** — wide, low, stable-looking blob

### Eyes (SVG, overlaid on body)
- **Googly** — classic: two circles, small pupils that can "look" in a direction
- **Sleepy** — half-closed, droopy lids
- **Sparkly** — stars instead of pupils
- **Determined** — angled brows, focused pupils
- **Starry** — literal star shapes for pupils
- **Wide** — very large, surprised-looking

### Face expressions (driven by context)
- Default: neutral happy (small smile)
- Doing a quest: focused/determined brows
- Quest complete: big grin, excited eyes
- Level up: stars in eyes, huge smile
- Low energy: droopy eyes, small mouth
- Breathing exercise: calm closed eyes

### Avatar animation states
- **Idle:** subtle breathing bob (up 3px, down 3px, 2s loop)
- **Tap response:** quick squash and stretch spring
- **Celebrating:** full bounce with arm-wiggle (SVG path animation)
- **Dancing (level up / champion):** exaggerated bounce, side to side
- **Breathing exercise:** slow expand and contract in sync with breath timing

### Accessories (CSS/SVG overlaid on avatar)
Designed as simple flat SVG elements that sit on top of the creature:
- Hats: party hat, astronaut helmet, flower crown, beanie, chef hat
- Wings: rainbow wings, butterfly wings, angel wings
- Items: tiny backpack, sandwich, water bottle, book
- Effects: sparkle trail (CSS particles), glow ring (CSS radial)

---

## Feelings Check-In Screen Design

Reference: Image 8 (TikTok wellbeing) + Image 11 (emotion creature cards).

### Emotion creature grid
- 4-column grid of cream-colored cards
- Each card: unique blob creature + emotion name below in Nunito 700
- Each creature: distinct color + distinct shape + distinct face expression
- Card background: warm cream (#FFF8F0)
- Card border-radius: 16px
- Cards have a subtle drop shadow — feel like physical tiles

### When an emotion is selected
- Full-bleed background transitions to that emotion's color (smooth cross-fade)
- Selected creature animates to center of screen, scales up
- Two or three response options slide up from bottom
- The whole screen feels immersive — not a modal, a full experience

### Breathing exercise screen
- Solid background in the emotion's color (calming blue for "nervous", etc.)
- Avatar blob in center — slowly expands (3s inhale) and contracts (3s exhale)
- Gentle text: "Breathe in..." / "Hold..." / "Breathe out..."
- Progress dots at bottom (3–4 breath cycles)
- Tap anywhere to end early

---

## Screen-by-Screen Direction

### Profile Selection (Family HQ Entrance)
- Warm cream background with soft colored radial glow per avatar's color
- Each profile: large creature card — the avatar takes up 60% of the card, name below
- Cards in a 2-column grid (or horizontal scroll for 5+)
- On tap: card scales up with spring physics, then cross-fades to dashboard
- Parent cards: subtle amber border glow (not labeled "ADMIN" — just visually distinct)

### Home Dashboard (Family HQ)
- **Tonight's Dinner** — full-width glass card, coral gradient left border accent, large text
- **This Week's Cook** — small avatar chip + name next to dinner card
- **Spoon status** — compact horizontal row, custom SVG spoon icons in sky blue
- **My Quests** — 2–3 glass cards, left border colored by quest category
- **How are you feeling?** — soft pill button, always visible for kids
- **Leaderboard snapshot** — 3 entries, avatar + name + XP in Fredoka
- Generous spacing — this screen should breathe

### Quest Cards
- Left border accent (4px, category color: coral=household, amber=kitchen, mint=learning, sky=self-care)
- Quest title: Plus Jakarta SemiBold 17px, dark
- XP badge: top right, coral pill, Fredoka bold — first thing kids see
- "Mark Done!" button: full-width, coral gradient pill, 56px tall, bottom of card
- Pending state: card background shifts to amber-light, hourglass icon, "Waiting for a thumbs up" in muted text
- Approved state: card background shifts to mint-light, checkmark, XP counted up

### Leaderboard
- 1st place: iridescent glass card, larger, amber star icon
- 2nd: glass card, silver accent
- 3rd: glass card, coral-amber accent
- Others: standard glass cards, no diminishment of anyone
- Avatar visible left, name + level center, XP right (Fredoka)

### Grocery List
- Clean list, grouped by category with a category pill header (e.g. "🥦 Produce" in mint)
- Each item: glass pill row, tap to check, checked items get strikethrough + muted
- Add item: floating glass pill input at bottom of screen
- Category pills are color-coded: Produce=mint, Dairy=sky, Meat=coral, Pantry=amber

### Reward Shop
- Grid of avatar item cards — iridescent glass treatment
- Item name + XP cost prominent
- "Owned" badge if already unlocked
- "Equip" if unlocked but not wearing
- Locked items show XP needed: "75 more XP to unlock"
- Unlocking: item floats onto the avatar preview with sparkle burst

---

## Animation Principles

**Springy, not linear.** All motion uses spring physics or ease-out curves.
**Fast UI, slow celebration.** Navigation: 200ms. Quest completion: 400ms. Level up: 800ms max.
**Physical feel.** Cards should feel like they have weight. Taps create a satisfying squash/stretch.
**Care moments are quiet.** Spoon/care animations are always 50% as intense as game animations.

### Key curves
```css
--spring: cubic-bezier(0.34, 1.56, 0.64, 1);   /* Pop-in, bouncy */
--smooth: cubic-bezier(0.4, 0, 0.2, 1);          /* Smooth transitions */
--ease-out: cubic-bezier(0, 0, 0.2, 1);          /* Settling */
```

### DO animate
- Card mount (fade up from 8px, staggered 40ms per card)
- Button press (scale 0.96 → 1.0, spring back)
- Quest completion (shimmer → slide → checkmark draws)
- XP number counting up
- Avatar idle breathing
- Emotion creature tap response
- Level up (full sequence, skippable)

### DO NOT animate
- Things the user didn't trigger
- Looping effects (no pulsing borders)
- Text content changes unless counting up

---

## Icon System

No emoji as UI icons. Use **Lucide React** (outline style) throughout.

All icons: outline, 20–24px, colored with context:
- Active/primary: `--coral`
- Navigation active: `--coral`
- Navigation inactive: `--text-muted`
- Success: `--mint`
- Warning/pending: `--amber`
- Info: `--sky`

Custom SVG icons needed (not in Lucide):
- Spoon (for spoon theory UI)
- Blob creature shapes (avatar builder)
- Each emotion creature (14 unique blobs)

---

## Spacing & Layout

```css
--space-xs:  4px
--space-sm:  8px
--space-md:  16px
--space-lg:  24px
--space-xl:  32px
--space-2xl: 48px
--space-3xl: 64px
```

- Card internal padding: 20–24px
- Section gaps: 32px
- Screen edge margin: 16–20px
- Bottom nav height: 72px (leave room above it)
- Never let content touch card edges

---

## Active Tweaks to Make

*(Check off as Claude Code applies. Add new ones anytime.)*

- [ ] Swap dark background for warm cream (#FAF8F5)
- [ ] Apply liquid glass card system across all screens
- [ ] Replace Cinzel/Bebas/medieval fonts with Nunito + Plus Jakarta Sans + Fredoka
- [ ] Replace emoji nav icons with Lucide React icons
- [ ] Build avatar creature system (SVG-based blob shapes)
- [ ] Build emotion creature grid (14 emotions, each unique blob)
- [ ] Apply category color accent system to quest cards (left border)
- [ ] Redesign grocery list with category pill headers
- [ ] Apply iridescent treatment to reward shop + achievement moments
- [ ] Redesign level-up screen (avatar dances, iridescent card, warm not dark)
- [ ] Build breathing exercise screen (full-bleed emotion color + avatar animates)
- [ ] Add card mount animations (fade-up stagger)

---

## Hard Rules — Never Violate

- ❌ No dark navy or charcoal backgrounds — warm cream is the base
- ❌ No solid opaque cards — everything is glass or tinted
- ❌ No medieval fonts or language in the UI
- ❌ No emoji used as navigation or interface icons
- ❌ No perfectly circular avatars — always slightly irregular blobs
- ❌ No animations longer than 1s (except level-up, skippable)
- ❌ No looping/auto-playing animations (except avatar idle breath)
- ❌ No red for spoon/care UI — ever
- ❌ No harsh dark mode — this app is warm and light
- ❌ No linear easing — always spring or ease-out curves
- ❌ Care/spoon moments must be visually quieter than quest/game moments

---

## What "Fun and Premium" Means Here

**Fun:** The creatures have personality. Tapping things feels satisfying. The level-up moment is genuinely exciting. The emotion creatures are weird and lovable. Kids want to open it.

**Premium:** The glass surfaces feel real. The spacing is generous and intentional. The type is clean and legible. Nothing looks like a free template. Adults don't feel embarrassed using it.

**The combination:** It looks like a beautiful app that was designed specifically for a family who takes fun seriously.

---

*Last updated: June 2026 — Complete redesign based on Pinterest inspiration board*
*Replaces all previous design direction. Drop in project folder alongside PRD v3.*
