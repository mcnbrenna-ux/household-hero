// ── Game rules: levels, skills, badges ───────────────────────────────────────
import type { AppState, Person, Task } from "../types";

// ── Levels (PRD §8.3) ───────────────────────────────────────────────────────
// Levels track LIFETIME XP and only ever go up. Spending never lowers them.
// Cumulative XP thresholds for levels 1–10, then +1,500 XP per level after.
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2700, 3700, 5000];
// v3 §8 title table — friendly, non-medieval. Caps at "Quest Master" past Lv10.
const LEVEL_TITLES = [
  "Tiny Helper",
  "Quest Starter",
  "Home Scout",
  "House Pro",
  "Quest Champion",
  "Family Hero",
  "Legendary Helper",
  "Grand Champion",
  "Family Legend",
  "Quest Master",
];

// Cumulative XP required to *reach* a given level (1-based).
function thresholdFor(level: number): number {
  if (level <= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[level - 1];
  return (
    LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] +
    1500 * (level - LEVEL_THRESHOLDS.length)
  );
}

export function levelForPoints(lifetimePoints: number): number {
  let level = 1;
  while (lifetimePoints >= thresholdFor(level + 1)) level += 1;
  return level;
}

// PRD title for a level (titles cap at "Grand Master" past level 10).
export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1];
}

// Progress within the current level, for the progress bar (0..1).
export function levelProgress(lifetimePoints: number): {
  level: number;
  title: string;
  into: number; // XP earned into the current level
  span: number; // XP needed to span the current level
  pct: number;
} {
  const level = levelForPoints(lifetimePoints);
  const base = thresholdFor(level);
  const next = thresholdFor(level + 1);
  const span = next - base;
  const into = lifetimePoints - base;
  return {
    level,
    title: levelTitle(level),
    into,
    span,
    pct: span > 0 ? into / span : 1,
  };
}

// ── Skills ──────────────────────────────────────────────────────────────────
export interface SkillDef {
  id: string;
  name: string;
  emoji: string;
}

export const SKILLS: SkillDef[] = [
  { id: "cooking", name: "Master Chef", emoji: "🍳" },
  { id: "tidy", name: "Tidy Titan", emoji: "🧹" },
  { id: "scholar", name: "Scholar", emoji: "📚" },
  { id: "wellbeing", name: "Wellbeing Warrior", emoji: "🌿" },
  { id: "dishes", name: "Dish Dynamo", emoji: "🍽️" },
  { id: "outdoor", name: "Yard Ranger", emoji: "🌳" },
  { id: "pets", name: "Critter Keeper", emoji: "🐾" },
  { id: "laundry", name: "Laundry Legend", emoji: "🧺" },
  { id: "caring", name: "Caring Heart", emoji: "💛" },
];

export function skillDef(id: string): SkillDef | undefined {
  return SKILLS.find((s) => s.id === id);
}

// Skills level independently of overall points. Every 100 xp = +1 skill level.
export function skillLevel(xp: number): number {
  return 1 + Math.floor(xp / 100);
}
export function skillProgressPct(xp: number): number {
  return (xp % 100) / 100;
}

// ── Badges ────────────────────────────────────────────────────────────────
export interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  hint: string;
  // earned(person, state) — pure check against current state.
  earned: (p: Person, state: AppState) => boolean;
}

function doneTasksFor(personId: string, state: AppState): Task[] {
  return state.tasks.filter(
    (t) => t.status === "done" && t.completedBy === personId,
  );
}

export const BADGES: BadgeDef[] = [
  {
    id: "first-chore",
    name: "First Quest",
    emoji: "🌟",
    hint: "Complete your very first quest",
    earned: (p, s) => doneTasksFor(p.id, s).length >= 1,
  },
  {
    id: "points-100",
    name: "Century",
    emoji: "💯",
    hint: "Earn 100 lifetime points",
    earned: (p) => p.lifetimePoints >= 100,
  },
  {
    id: "points-500",
    name: "High Five Hundred",
    emoji: "🚀",
    hint: "Earn 500 lifetime points",
    earned: (p) => p.lifetimePoints >= 500,
  },
  {
    id: "ten-tasks",
    name: "Ten Strong",
    emoji: "🔟",
    hint: "Complete 10 tasks",
    earned: (p, s) => doneTasksFor(p.id, s).length >= 10,
  },
  {
    id: "chef",
    name: "In the Kitchen",
    emoji: "👨‍🍳",
    hint: "Cook dinner for the family",
    earned: (p, s) =>
      doneTasksFor(p.id, s).some((t) => t.isDinner) ||
      (p.skills.cooking ?? 0) > 0,
  },
  {
    id: "caring-heart",
    name: "Caring Heart",
    emoji: "💛",
    hint: "Do something kind for someone running low",
    earned: (p, s) => s.careActs.some((c) => c.fromPersonId === p.id),
  },
  {
    id: "streak-7",
    name: "7-Day Streak",
    emoji: "🔥",
    hint: "Complete a task 7 days in a row",
    earned: (p, s) => currentStreak(p.id, s) >= 7,
  },
];

export function badgeDef(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}

// Count consecutive days (ending today or yesterday) with at least one done task.
export function currentStreak(personId: string, state: AppState): number {
  const days = new Set(
    state.tasks
      .filter((t) => t.status === "done" && t.completedBy === personId)
      .map((t) => t.date),
  );
  if (days.size === 0) return 0;
  let streak = 0;
  const d = new Date();
  // Allow the streak to count from today or yesterday.
  if (!days.has(toISODate(d))) d.setDate(d.getDate() - 1);
  while (days.has(toISODate(d))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// Returns newly-earned badge ids for a person (not yet in p.badges).
export function newlyEarnedBadges(p: Person, state: AppState): string[] {
  return BADGES.filter((b) => !p.badges.includes(b.id) && b.earned(p, state)).map(
    (b) => b.id,
  );
}

// ── date helpers ────────────────────────────────────────────────────────────
export function toISODate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
