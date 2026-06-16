// ── Spoon Theory helpers ──────────────────────────────────────────────────────
// Spoons = how someone feels TODAY (vs capacity, the long-term baseline).
// Sensitive, personal info. Surfaced ONLY to invite help, warmly. Never a
// failure, never lowers fair share, never costs points, never alarmed language.
import type { AppState, Person, SpoonEntry } from "../types";
import { toISODate } from "./game";

// A person is "low" at or below 30% of their own max (min 3). Gentle threshold.
export function lowThreshold(person: Person): number {
  return Math.max(3, Math.round(person.maxSpoons * 0.3));
}

export function spoonsToday(
  state: AppState,
  personId: string,
): number | null {
  const e = state.spoons.find(
    (s) => s.personId === personId && s.date === toISODate(),
  );
  return e ? e.count : null;
}

export function isLow(state: AppState, person: Person): boolean {
  if (!person.tracksSpoons) return false;
  const c = spoonsToday(state, person.id);
  return c !== null && c <= lowThreshold(person);
}

// People (who track spoons) running low today — the family can rally for them.
export function lowPeopleToday(state: AppState): Person[] {
  return state.people.filter((p) => isLow(state, p));
}

// Kid-friendly, concrete acts of care. Recognition comes AFTER, gently.
export interface CareSuggestion {
  kind: string;
  label: string;
  emoji: string;
}
export const CARE_SUGGESTIONS: CareSuggestion[] = [
  { kind: "water", label: "Fill their water bottle", emoji: "💧" },
  { kind: "hug", label: "Give them a hug", emoji: "🤗" },
  { kind: "task", label: "Take one thing off their list", emoji: "✅" },
  { kind: "tea", label: "Make them a warm drink", emoji: "🍵" },
  { kind: "note", label: "Leave a kind note", emoji: "💌" },
];

// The tiny, quiet bonus for an act of care. Small on purpose — kindness first.
export const CARE_POINTS = 3;

export function setSpoons(
  spoons: SpoonEntry[],
  personId: string,
  count: number,
): SpoonEntry[] {
  const date = toISODate();
  const without = spoons.filter(
    (s) => !(s.personId === personId && s.date === date),
  );
  return [...without, { personId, date, count }];
}
