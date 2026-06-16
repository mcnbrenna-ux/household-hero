// ── Seed data — the example family + starter content from the PRD §9 ──────────
import type { AppState, Person, Chore, Reward, Recipe } from "../types";
import { defaultAvatar } from "../types";

function avatar(color: string, emoji: string): Person["avatar"] {
  return { ...defaultAvatar(color), emoji };
}

const people: Person[] = [
  {
    id: "dad",
    name: "Dad",
    avatar: avatar("#2DA9E1", "😎"),
    color: "#2DA9E1",
    role: "parent",
    ability: "full",
    capacity: "heavy", // stay-at-home; carries the baseline load
    needsBuddyForCooking: false,
    inDinnerRotation: true,
    tracksSpoons: true,
    maxSpoons: 10,
    lifetimePoints: 0,
    spendablePoints: 0,
    skills: {},
    badges: [],
  },
  {
    id: "mom",
    name: "Mom",
    avatar: avatar("#E84E8A", "🥰"),
    color: "#E84E8A",
    role: "parent",
    ability: "full",
    capacity: "light", // full-time work + chronic illness, by design
    needsBuddyForCooking: false,
    inDinnerRotation: true,
    tracksSpoons: true,
    maxSpoons: 10,
    lifetimePoints: 0,
    spendablePoints: 0,
    skills: {},
    badges: [],
  },
  {
    id: "papa",
    name: "Papa",
    avatar: avatar("#7B61FF", "🤩"),
    color: "#7B61FF",
    role: "parent",
    ability: "full",
    capacity: "normal", // grandparent, full adult in the rotation
    needsBuddyForCooking: false,
    inDinnerRotation: true,
    tracksSpoons: true,
    maxSpoons: 10,
    lifetimePoints: 0,
    spendablePoints: 0,
    skills: {},
    badges: [],
  },
  {
    id: "nezzie",
    name: "Nezzie",
    avatar: avatar("#FFA63D", "⭐"),
    color: "#FFA63D",
    role: "kid",
    age: 10,
    ability: "kid", // most chores + cooking WITH a helper
    capacity: "normal",
    needsBuddyForCooking: true,
    inDinnerRotation: true,
    tracksSpoons: true,
    maxSpoons: 8,
    lifetimePoints: 0,
    spendablePoints: 0,
    skills: {},
    badges: [],
  },
  {
    id: "rowen",
    name: "Rowen",
    avatar: avatar("#3DD68C", "🐸"),
    color: "#3DD68C",
    role: "kid",
    age: 2,
    ability: "toddler", // tiny, safe tasks only
    capacity: "light",
    needsBuddyForCooking: false,
    inDinnerRotation: false, // never in the dinner rotation
    tracksSpoons: false, // no spoon tracking for a toddler
    maxSpoons: 0,
    lifetimePoints: 0,
    spendablePoints: 0,
    skills: {},
    badges: [],
  },
];

const chores: Chore[] = [
  // Dinner — the nightly cook task. High value, builds Master Chef.
  {
    id: "dinner",
    title: "Cook tonight's dinner",
    emoji: "🍳",
    points: 30,
    skillId: "cooking",
    minAbility: "kid", // toddlers can't; kids can (with a buddy)
    needsBuddy: false, // buddy is decided per-person (Nezzie) at assign time
    requiresApproval: false,
    recurrence: "daily",
    isDinner: true,
  },
  // Everyday chores — open pool.
  {
    id: "dishes",
    title: "Do the dishes",
    emoji: "🍽️",
    points: 15,
    skillId: "dishes",
    minAbility: "kid",
    needsBuddy: false,
    requiresApproval: false,
    recurrence: "daily",
  },
  {
    id: "trash",
    title: "Take out the trash",
    emoji: "🗑️",
    points: 10,
    skillId: "tidy",
    minAbility: "kid",
    needsBuddy: false,
    requiresApproval: false,
    recurrence: "daily",
  },
  {
    id: "tidy-living",
    title: "Tidy the living room",
    emoji: "🛋️",
    points: 10,
    skillId: "tidy",
    minAbility: "kid",
    needsBuddy: false,
    requiresApproval: false,
    recurrence: "daily",
  },
  {
    id: "laundry",
    title: "Fold the laundry",
    emoji: "🧺",
    points: 15,
    skillId: "laundry",
    minAbility: "kid",
    needsBuddy: false,
    requiresApproval: true, // example of a parent-checked task
    recurrence: "weekly",
  },
  {
    id: "feed-pet",
    title: "Feed the pet",
    emoji: "🐾",
    points: 8,
    skillId: "pets",
    minAbility: "kid",
    needsBuddy: false,
    requiresApproval: false,
    recurrence: "daily",
  },
  {
    id: "water-plants",
    title: "Water the plants",
    emoji: "🪴",
    points: 8,
    skillId: "outdoor",
    minAbility: "kid",
    needsBuddy: false,
    requiresApproval: false,
    recurrence: "weekly",
  },
  // Toddler-safe — Rowen can grab these (and so can everyone).
  {
    id: "toys-bin",
    title: "Put toys in the bin",
    emoji: "🧸",
    points: 5,
    skillId: "tidy",
    minAbility: "toddler",
    needsBuddy: false,
    requiresApproval: false,
    recurrence: "daily",
  },
  {
    id: "books-shelf",
    title: "Put books on the shelf",
    emoji: "📚",
    points: 5,
    skillId: "tidy",
    minAbility: "toddler",
    needsBuddy: false,
    requiresApproval: false,
    recurrence: "daily",
  },
];

const rewards: Reward[] = [
  { id: "screen-30", title: "30 min extra screen time", emoji: "📱", cost: 50 },
  { id: "movie-pick", title: "Pick the movie", emoji: "🎬", cost: 100 },
  { id: "dessert", title: "Choose dessert", emoji: "🍨", cost: 40 },
  { id: "stay-up", title: "Stay up 30 min later", emoji: "🌙", cost: 80 },
  { id: "day-trip", title: "Pick a weekend outing", emoji: "🎡", cost: 250 },
];

const recipes: Recipe[] = [
  {
    id: "spaghetti",
    title: "Family Spaghetti",
    emoji: "🍝",
    ingredients: [
      "Spaghetti (1 box)",
      "Jar of marinara",
      "Ground beef or lentils",
      "Parmesan",
      "Garlic bread",
    ],
    steps: [
      "Boil a big pot of salted water.",
      "Brown the beef (or warm the lentils) in a pan.",
      "Add the marinara and simmer 10 minutes.",
      "Cook the spaghetti until just tender, then drain.",
      "Toss together, top with parmesan, serve with garlic bread.",
    ],
  },
  {
    id: "tacos",
    title: "Taco Night",
    emoji: "🌮",
    ingredients: [
      "Tortillas",
      "Protein of choice",
      "Lettuce, tomato, cheese",
      "Salsa & sour cream",
    ],
    steps: [
      "Cook the protein with taco seasoning.",
      "Chop the toppings.",
      "Warm the tortillas.",
      "Set everything out and let everyone build their own.",
    ],
  },
];

// The example family from PRD §13 — loaded when the setup wizard offers to
// "seed with example quests and a starter cooking rotation".
export function makeSeedState(): AppState {
  return {
    familyName: "The Johnson Quest",
    parentPIN: null,
    securityQuestion: "",
    securityAnswer: "",
    setupComplete: true, // the seeded family is ready to play
    people,
    chores,
    tasks: [],
    rewards,
    redemptions: [],
    recipes,
    mealPlan: { 0: { recipeId: "spaghetti" }, 3: { recipeId: "tacos" } },
    spoons: [],
    careActs: [],
    calendarEvents: [],
    // Rowen excluded automatically (inDinnerRotation = false).
    dinnerOrder: ["dad", "papa", "mom", "nezzie"],
    currentUserId: null,
    lastTaskGenDate: null,
  };
}

// A blank realm — first launch runs the setup wizard against this.
export function makeEmptyState(): AppState {
  return {
    familyName: "",
    parentPIN: null,
    securityQuestion: "",
    securityAnswer: "",
    setupComplete: false,
    people: [],
    chores, // keep the starter quest templates available
    tasks: [],
    rewards,
    redemptions: [],
    recipes,
    mealPlan: {},
    spoons: [],
    careActs: [],
    calendarEvents: [],
    dinnerOrder: [],
    currentUserId: null,
    lastTaskGenDate: null,
  };
}
