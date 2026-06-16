// ── Household Hero — domain types ────────────────────────────────────────────
// Everything the app knows lives in one AppState object (see store/).
// Designed to be JSON-serializable so it can persist to localStorage today and
// sync to a backend later without a rewrite.

export type Role = "parent" | "kid";

// Capability tiers — a HARD filter on what a person can be offered.
// Ranked so a person sees any task whose minAbility rank is <= their own.
// (v3 §15 names these toddler/child/teen/adult; we keep the engine's original
// toddler/kid/full and slot "teen" between kid and full — same ordering.)
export type Ability = "toddler" | "kid" | "teen" | "full";
export const ABILITY_RANK: Record<Ability, number> = {
  toddler: 0,
  kid: 1,
  teen: 2,
  full: 3,
};

// Capacity — how MUCH a person should carry (their fair share).
export type Capacity = "light" | "normal" | "heavy";

// Weekly fair-share target (number of tasks) per capacity level.
// Drives the leaderboard's "% of your own fair share" and rotation weighting.
export const CAPACITY_TARGET: Record<Capacity, number> = {
  light: 3,
  normal: 6,
  heavy: 10,
};

// How often a person comes up in the daily dinner rotation, by capacity.
// Higher weight = appears more often. Light cooks least; heavy carries baseline.
export const CAPACITY_ROTATION_WEIGHT: Record<Capacity, number> = {
  light: 1,
  normal: 2,
  heavy: 3,
};

// ── Avatar creature (v3 §6 / DESIGN-NOTES "Avatar Creature Design System") ───
// A chunky abstract blob, built programmatically from SVG so it renders at any
// size. NOT an emoji, NOT a human. Customizable body / color / eyes, plus
// accessories bought from the reward shop.
export type BodyShape = "round" | "tall" | "square" | "spiky" | "pudgy";
export type EyeStyle =
  | "googly"
  | "sleepy"
  | "sparkly"
  | "determined"
  | "starry"
  | "wide";
// Context-driven face — what the creature is "doing" right now.
export type FaceMood =
  | "happy"
  | "focused"
  | "excited"
  | "star"
  | "sleepy"
  | "calm";

export interface AvatarConfig {
  emoji: string;   // displayed emoji avatar
  color: string;   // background circle color
  equippedAccessories: string[];
  unlockedAccessories: string[];
  // Legacy shape fields kept so old localStorage saves don't crash on load
  bodyShape?: BodyShape;
  eyes?: EyeStyle;
}

export const FREE_ACCESSORIES: string[] = [];

export function defaultAvatar(color: string): AvatarConfig {
  return {
    emoji: "😊",
    color,
    equippedAccessories: [],
    unlockedAccessories: [],
  };
}

export interface Person {
  id: string;
  name: string;
  avatar: AvatarConfig; // structured blob creature (v3) — was an emoji string
  color: string; // hex — banner/card/progress color
  role: Role;
  age?: number;
  ability: Ability;
  capacity: Capacity;
  needsBuddyForCooking: boolean;
  inDinnerRotation: boolean;
  tracksSpoons: boolean; // toddlers hidden from spoons
  maxSpoons: number;
  lifetimePoints: number; // drives level — only ever goes up
  spendablePoints: number; // can be cashed in for rewards
  skills: Record<string, number>; // skillId -> xp
  badges: string[]; // earned badge ids
}

export type Recurrence = "once" | "daily" | "weekly";

// A chore template. Task instances are generated from these.
export interface Chore {
  id: string;
  title: string;
  emoji: string;
  points: number;
  skillId?: string; // builds this skill when completed
  minAbility: Ability; // capability gate
  needsBuddy: boolean; // forces an adult buddy to be paired
  requiresApproval: boolean; // parent must approve before points awarded
  recurrence: Recurrence;
  isDinner?: boolean; // the nightly cook task
}

export type TaskStatus = "open" | "claimed" | "pending" | "done";

// A concrete thing to do on a given day.
export interface Task {
  id: string;
  choreId: string;
  title: string;
  emoji: string;
  points: number;
  skillId?: string;
  needsBuddy: boolean;
  requiresApproval: boolean;
  minAbility: Ability;
  isDinner?: boolean;
  date: string; // YYYY-MM-DD
  assignedTo: string | null; // personId, or null for the open "grab-it" pool
  buddyId: string | null; // auto-paired helper
  status: TaskStatus;
  completedBy: string | null;
  approvedBy: string | null;
}

export interface Reward {
  id: string;
  title: string;
  emoji: string;
  cost: number;
}

export interface Redemption {
  id: string;
  rewardId: string;
  rewardTitle: string;
  personId: string;
  cost: number;
  date: string;
  fulfilled: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  emoji: string;
  ingredients: string[];
  steps: string[];
}

// Meal plan keyed by weekday index 0=Sun..6=Sat for the current week.
export interface MealPlanEntry {
  recipeId?: string;
  name?: string; // freeform "what's for dinner" if no recipe
}

// A daily spoon reading. Visible to the whole family.
export interface SpoonEntry {
  personId: string;
  date: string;
  count: number;
}

// A logged act of care — gentle, recognized AFTER the fact, never a loud task.
export interface CareAct {
  id: string;
  fromPersonId: string;
  forPersonId: string;
  kind: string; // e.g. "water", "hug", "took a task"
  date: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  emoji: string;
  date: string;         // YYYY-MM-DD
  time?: string;        // e.g. "3:30 PM" — optional
  forPersonId: string | null; // null = whole family
}

export interface AppState {
  familyName: string; // e.g. "The Johnson Quest"
  parentPIN: string | null; // 4-digit Guild Master PIN (null until setup)
  securityQuestion: string; // for PIN reset
  securityAnswer: string;
  setupComplete: boolean; // false on first launch → runs the setup wizard
  people: Person[];
  chores: Chore[];
  tasks: Task[];
  rewards: Reward[];
  redemptions: Redemption[];
  recipes: Recipe[];
  mealPlan: Record<number, MealPlanEntry>; // weekday -> entry
  spoons: SpoonEntry[];
  careActs: CareAct[];
  calendarEvents: CalendarEvent[];
  dinnerOrder: string[]; // ordered personIds for the rotation cycle
  currentUserId: string | null;
  lastTaskGenDate: string | null; // date we last spun up recurring tasks
}
