// ── The Fairness Engine ──────────────────────────────────────────────────────
// Three layers from the PRD:
//   1. Capability — a HARD filter on what a person CAN do.
//   2. Capacity   — how MUCH they should carry (fair share).
//   3. Assistance — tasks that need a buddy get an adult auto-paired.
import {
  ABILITY_RANK,
  CAPACITY_TARGET,
  CAPACITY_ROTATION_WEIGHT,
} from "../types";
import type { AppState, Person, Task } from "../types";
import { toISODate } from "./game";

// Layer 1 — can this person even be offered this task?
export function canDo(person: Person, task: Pick<Task, "minAbility">): boolean {
  return ABILITY_RANK[person.ability] >= ABILITY_RANK[task.minAbility];
}

// The open "grab-it" pool a given person should see: open, capable, and dated
// today or earlier. Never shows tasks above their ability.
export function openPoolFor(person: Person, state: AppState): Task[] {
  const today = toISODate();
  return state.tasks.filter(
    (t) =>
      t.status === "open" &&
      t.assignedTo === null &&
      canDo(person, t) &&
      t.date <= today,
  );
}

// Tasks assigned directly to a person (or where they're the buddy).
export function assignedTo(person: Person, state: AppState): Task[] {
  return state.tasks.filter(
    (t) =>
      (t.assignedTo === person.id || t.buddyId === person.id) &&
      t.status !== "done",
  );
}

// Layer 3 — pick an available adult buddy for a task that needs one.
// Prefers an adult who isn't already the assignee, with the most spoons today
// (so we lean on whoever has energy). Falls back to any parent.
export function pickBuddy(
  state: AppState,
  excludePersonId: string,
): string | null {
  const today = toISODate();
  const adults = state.people.filter(
    (p) => p.role === "parent" && p.id !== excludePersonId,
  );
  if (adults.length === 0) return null;
  const spoonsFor = (id: string) =>
    state.spoons.find((s) => s.personId === id && s.date === today)?.count ??
    Infinity;
  return [...adults].sort((a, b) => spoonsFor(b.id) - spoonsFor(a.id))[0].id;
}

// ── Layer 2 — fair share & the leaderboard ───────────────────────────────────

export function fairShareTarget(person: Person): number {
  return CAPACITY_TARGET[person.capacity];
}

// Tasks a person completed within the current week (Sun..Sat).
export function tasksDoneThisWeek(person: Person, state: AppState): Task[] {
  const { start, end } = currentWeekRange();
  return state.tasks.filter(
    (t) =>
      t.status === "done" &&
      t.completedBy === person.id &&
      t.date >= start &&
      t.date <= end,
  );
}

export interface LeaderRow {
  person: Person;
  done: number;
  target: number;
  pct: number; // 0..1+, capped for display elsewhere
}

// The leaderboard ranks by % of one's OWN fair share — never raw points.
// Everyone can hit 100%. Toddlers finishing one tiny task stand with anyone.
export function leaderboard(state: AppState): LeaderRow[] {
  return state.people
    .map((person) => {
      const done = tasksDoneThisWeek(person, state).length;
      const target = fairShareTarget(person);
      return { person, done, target, pct: target > 0 ? done / target : 0 };
    })
    .sort((a, b) => b.pct - a.pct);
}

// "Hero of the Week" — whoever best hit their own target this week.
export function heroOfTheWeek(state: AppState): Person | null {
  const rows = leaderboard(state).filter((r) => r.done > 0);
  return rows.length ? rows[0].person : null;
}

// ── Dinner rotation (capacity-weighted, DAILY) ────────────────────────────────
// We expand the dinner order into a weighted cycle: heavier capacity appears
// more often, lighter less, toddlers/excluded never. Then we index into the
// cycle by day count so the cook rotates every day.
export function weightedDinnerCycle(state: AppState): string[] {
  const cycle: string[] = [];
  for (const id of state.dinnerOrder) {
    const p = state.people.find((x) => x.id === id);
    if (!p || !p.inDinnerRotation) continue;
    const weight = CAPACITY_ROTATION_WEIGHT[p.capacity];
    for (let i = 0; i < weight; i++) cycle.push(id);
  }
  return cycle;
}

// Day index since a fixed epoch, so "today" maps deterministically to a cook.
function dayNumber(date: string): number {
  return Math.floor(new Date(date + "T00:00:00").getTime() / 86_400_000);
}

// Who is scheduled to cook on a given date (before any spoon-driven swap).
export function scheduledCook(state: AppState, date = toISODate()): Person | null {
  const cycle = weightedDinnerCycle(state);
  if (cycle.length === 0) return null;
  const idx = ((dayNumber(date) % cycle.length) + cycle.length) % cycle.length;
  const id = cycle[idx];
  return state.people.find((p) => p.id === id) ?? null;
}

// ── current week helpers ──────────────────────────────────────────────────────
export function currentWeekRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: toISODate(start), end: toISODate(end) };
}
