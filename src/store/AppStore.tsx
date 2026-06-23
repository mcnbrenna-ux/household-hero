// ── App store ─────────────────────────────────────────────────────────────────
// One AppState object, persisted to localStorage. Exposes action helpers so
// components never mutate state directly. A separate (non-persisted) celebration
// channel drives confetti / level-up / badge popups.
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AppState,
  Person,
  Task,
  Chore,
  Reward,
  Recipe,
  MealPlanEntry,
  CalendarEvent,
} from "../types";
import { defaultAvatar } from "../types";
import { makeSeedState, makeEmptyState } from "../data/seed";
import {
  levelForPoints,
  newlyEarnedBadges,
  badgeDef,
  toISODate,
} from "../engine/game";
import { scheduledCook } from "../engine/fairness";
import { setSpoons as applySpoons, CARE_POINTS } from "../engine/spoons";

const STORAGE_KEY = "familyquest-state-v1";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const state: AppState = { ...makeEmptyState(), ...parsed };
      // Migrate avatars: ensure shape/eyes + array fields are always present
      // (older saves from the emoji-picker era won't have bodyShape/eyes).
      state.people = state.people.map((p) => {
        if (!p.avatar || typeof p.avatar !== "object") {
          return { ...p, avatar: defaultAvatar(p.color ?? "#aaaaaa") };
        }
        return {
          ...p,
          avatar: {
            ...p.avatar,
            bodyShape: p.avatar.bodyShape ?? "round",
            eyes: p.avatar.eyes ?? "googly",
            equippedAccessories: p.avatar.equippedAccessories ?? [],
            unlockedAccessories: p.avatar.unlockedAccessories ?? [],
          },
        };
      });
      return state;
    }
  } catch {
    /* ignore corrupt storage */
  }
  return makeEmptyState();
}

let idSeq = 0;
function uid(prefix: string): string {
  idSeq += 1;
  return `${prefix}-${Date.now().toString(36)}-${idSeq}`;
}

// ── Celebrations ────────────────────────────────────────────────────────────
export type Celebration =
  | { kind: "points"; points: number; title: string; person: Person }
  | { kind: "levelup"; level: number; person: Person }
  | { kind: "badge"; badgeId: string; person: Person }
  | { kind: "care"; person: Person };

interface Store {
  state: AppState;
  currentUser: Person | null;
  celebration: Celebration | null;
  clearCelebration: () => void;

  setCurrentUser: (id: string | null) => void;

  // First-time setup & Guild Master PIN
  completeSetup: (opts: {
    familyName: string;
    pin: string;
    securityQuestion: string;
    securityAnswer: string;
    seedExample: boolean;
    firstMaster?: Person;
  }) => void;
  verifyPin: (pin: string) => boolean;
  setFamilyName: (name: string) => void;
  setPin: (pin: string) => void;
  resetPinWithAnswer: (answer: string, newPin: string) => boolean;

  claimTask: (taskId: string, personId: string) => void;
  completeTask: (taskId: string, personId: string) => void;
  approveTask: (taskId: string, approverId: string) => void;
  assignTask: (taskId: string, personId: string | null) => void;
  addOneTimeChore: (
    chore: Omit<Chore, "id" | "recurrence">,
    assignedTo: string | null,
  ) => void;

  upsertChore: (chore: Chore) => void;
  deleteChore: (id: string) => void;

  coverDinner: (taskId: string, volunteerId: string) => void;
  setSpoons: (personId: string, count: number) => void;
  logCare: (fromId: string, forId: string, kind: string) => void;

  redeemReward: (rewardId: string, personId: string) => void;
  fulfillRedemption: (id: string) => void;
  upsertReward: (reward: Reward) => void;
  deleteReward: (id: string) => void;

  upsertRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  setMealPlan: (weekday: number, entry: MealPlanEntry) => void;

  upsertPerson: (person: Person) => void;
  deletePerson: (id: string) => void;
  setDinnerOrder: (order: string[]) => void;

  upsertCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;

  resetAll: () => void;
}

const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used within <AppProvider>");
  return s;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() =>
    ensureTasksForToday(loadState()),
  );
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const queue = useRef<Celebration[]>([]);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable — app still works in-session */
    }
  }, [state]);

  function pushCelebrations(events: Celebration[]) {
    if (events.length === 0) return;
    queue.current.push(...events);
    if (!celebration) {
      const next = queue.current.shift()!;
      setCelebration(next);
    }
  }
  function clearCelebration() {
    const next = queue.current.shift() ?? null;
    setCelebration(next);
  }

  const currentUser =
    state.people.find((p) => p.id === state.currentUserId) ?? null;

  // ── helpers that build the next state ──────────────────────────────────────
  const update = (fn: (s: AppState) => AppState) => setState((s) => fn(s));

  // Award points + skill xp to a person, then collect celebration events
  // (points popup, level-up, newly-earned badges).
  function awardTo(
    s: AppState,
    personId: string,
    points: number,
    skillId: string | undefined,
    title: string,
    events: Celebration[],
  ): AppState {
    const people = s.people.map((p) => {
      if (p.id !== personId) return p;
      const beforeLevel = levelForPoints(p.lifetimePoints);
      const skills = skillId
        ? { ...p.skills, [skillId]: (p.skills[skillId] ?? 0) + points }
        : p.skills;
      const updated: Person = {
        ...p,
        lifetimePoints: p.lifetimePoints + points,
        spendablePoints: p.spendablePoints + points,
        skills,
      };
      const afterLevel = levelForPoints(updated.lifetimePoints);
      if (points > 0)
        events.push({ kind: "points", points, title, person: updated });
      if (afterLevel > beforeLevel)
        events.push({ kind: "levelup", level: afterLevel, person: updated });
      return updated;
    });
    let next = { ...s, people };
    // Re-check badges for that person against the freshly-updated state.
    next = awardBadges(next, personId, events);
    return next;
  }

  function awardBadges(
    s: AppState,
    personId: string,
    events: Celebration[],
  ): AppState {
    const person = s.people.find((p) => p.id === personId);
    if (!person) return s;
    const newOnes = newlyEarnedBadges(person, s);
    if (newOnes.length === 0) return s;
    const people = s.people.map((p) =>
      p.id === personId ? { ...p, badges: [...p.badges, ...newOnes] } : p,
    );
    newOnes.forEach((badgeId) =>
      events.push({ kind: "badge", badgeId, person }),
    );
    return { ...s, people };
  }

  // ── actions ─────────────────────────────────────────────────────────────────
  const store: Store = {
    state,
    currentUser,
    celebration,
    clearCelebration,

    setCurrentUser: (id) => update((s) => ({ ...s, currentUserId: id })),

    completeSetup: ({
      familyName,
      pin,
      securityQuestion,
      securityAnswer,
      seedExample,
      firstMaster,
    }) =>
      update((s) => {
        // Either start from the example family, or a blank realm + one master.
        const base = seedExample ? makeSeedState() : s;
        const people =
          !seedExample && firstMaster ? [...base.people, firstMaster] : base.people;
        const dinnerOrder =
          !seedExample && firstMaster && firstMaster.inDinnerRotation
            ? [...base.dinnerOrder, firstMaster.id]
            : base.dinnerOrder;
        // Generate today's recurring quests + tonight's cook right away.
        return ensureTasksForToday({
          ...base,
          people,
          dinnerOrder,
          familyName: familyName.trim() || "Our Quest",
          parentPIN: pin,
          securityQuestion,
          securityAnswer: securityAnswer.trim().toLowerCase(),
          setupComplete: true,
          currentUserId: null,
          lastTaskGenDate: null, // force generation against the new family
        });
      }),

    verifyPin: (pin) => state.parentPIN === null || state.parentPIN === pin,

    setFamilyName: (name) =>
      update((s) => ({ ...s, familyName: name.trim() || s.familyName })),

    setPin: (pin) => update((s) => ({ ...s, parentPIN: pin })),

    resetPinWithAnswer: (answer, newPin) => {
      if (
        state.securityAnswer &&
        answer.trim().toLowerCase() === state.securityAnswer
      ) {
        update((s) => ({ ...s, parentPIN: newPin }));
        return true;
      }
      return false;
    },

    claimTask: (taskId, personId) =>
      update((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? { ...t, assignedTo: personId, status: "claimed" }
            : t,
        ),
      })),

    completeTask: (taskId, personId) =>
      update((s) => {
        const task = s.tasks.find((t) => t.id === taskId);
        if (!task || task.status === "done") return s;
        const events: Celebration[] = [];

        if (task.requiresApproval) {
          // Goes to the parent's approval queue — no points yet.
          return {
            ...s,
            tasks: s.tasks.map((t) =>
              t.id === taskId
                ? { ...t, status: "pending", completedBy: personId }
                : t,
            ),
          };
        }

        let next: AppState = {
          ...s,
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, status: "done", completedBy: personId }
              : t,
          ),
        };
        // Cook earns the points + Master Chef; an auto-paired buddy also earns.
        next = awardTo(next, personId, task.points, task.skillId, task.title, events);
        if (task.buddyId && task.buddyId !== personId) {
          next = awardTo(
            next,
            task.buddyId,
            task.points,
            task.skillId,
            task.title,
            events,
          );
        }
        queueMicrotask(() => pushCelebrations(events));
        return next;
      }),

    approveTask: (taskId, approverId) =>
      update((s) => {
        const task = s.tasks.find((t) => t.id === taskId);
        if (!task || task.status !== "pending" || !task.completedBy) return s;
        const events: Celebration[] = [];
        let next: AppState = {
          ...s,
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, status: "done", approvedBy: approverId }
              : t,
          ),
        };
        next = awardTo(
          next,
          task.completedBy,
          task.points,
          task.skillId,
          task.title,
          events,
        );
        if (task.buddyId && task.buddyId !== task.completedBy) {
          next = awardTo(
            next,
            task.buddyId,
            task.points,
            task.skillId,
            task.title,
            events,
          );
        }
        queueMicrotask(() => pushCelebrations(events));
        return next;
      }),

    assignTask: (taskId, personId) =>
      update((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                assignedTo: personId,
                status: personId ? "claimed" : "open",
                buddyId:
                  personId &&
                  needsBuddyFor(s, personId, t)
                    ? pickAdultBuddy(s, personId)
                    : null,
              }
            : t,
        ),
      })),

    addOneTimeChore: (chore, assignedTo) =>
      update((s) => {
        const task: Task = {
          id: uid("task"),
          choreId: uid("chore"),
          title: chore.title,
          emoji: chore.emoji,
          points: chore.points,
          skillId: chore.skillId,
          needsBuddy: chore.needsBuddy,
          requiresApproval: chore.requiresApproval,
          minAbility: chore.minAbility,
          isDinner: chore.isDinner,
          date: toISODate(),
          assignedTo,
          buddyId:
            assignedTo && needsBuddyFor(s, assignedTo, chore)
              ? pickAdultBuddy(s, assignedTo)
              : null,
          status: assignedTo ? "claimed" : "open",
          completedBy: null,
          approvedBy: null,
        };
        return { ...s, tasks: [...s.tasks, task] };
      }),

    upsertChore: (chore) =>
      update((s) => ({
        ...s,
        chores: s.chores.some((c) => c.id === chore.id)
          ? s.chores.map((c) => (c.id === chore.id ? chore : c))
          : [...s.chores, chore],
      })),
    deleteChore: (id) =>
      update((s) => ({ ...s, chores: s.chores.filter((c) => c.id !== id) })),

    coverDinner: (taskId, volunteerId) =>
      update((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                assignedTo: volunteerId,
                buddyId: needsBuddyFor(s, volunteerId, t)
                  ? pickAdultBuddy(s, volunteerId)
                  : null,
                status: "claimed",
              }
            : t,
        ),
      })),

    setSpoons: (personId, count) =>
      update((s) => ({
        ...s,
        spoons: applySpoons(s.spoons, personId, count),
      })),

    logCare: (fromId, forId, kind) =>
      update((s) => {
        const events: Celebration[] = [];
        let next: AppState = {
          ...s,
          careActs: [
            ...s.careActs,
            { id: uid("care"), fromPersonId: fromId, forPersonId: forId, kind, date: toISODate() },
          ],
        };
        // Quiet bonus — recognized AFTER the fact, never a loud reward.
        next = awardTo(next, fromId, CARE_POINTS, "caring", "act of care", events);
        // Replace the loud "points" popup with a gentle "care" one.
        const gentle = events.filter((e) => e.kind !== "points");
        const fromPerson = next.people.find((p) => p.id === fromId)!;
        gentle.unshift({ kind: "care", person: fromPerson });
        queueMicrotask(() => pushCelebrations(gentle));
        return next;
      }),

    redeemReward: (rewardId, personId) =>
      update((s) => {
        const reward = s.rewards.find((r) => r.id === rewardId);
        const person = s.people.find((p) => p.id === personId);
        if (!reward || !person || person.spendablePoints < reward.cost) return s;
        return {
          ...s,
          people: s.people.map((p) =>
            p.id === personId
              ? { ...p, spendablePoints: p.spendablePoints - reward.cost }
              : p,
          ),
          redemptions: [
            ...s.redemptions,
            {
              id: uid("redeem"),
              rewardId,
              rewardTitle: reward.title,
              personId,
              cost: reward.cost,
              date: toISODate(),
              fulfilled: false,
            },
          ],
        };
      }),
    fulfillRedemption: (id) =>
      update((s) => ({
        ...s,
        redemptions: s.redemptions.map((r) =>
          r.id === id ? { ...r, fulfilled: true } : r,
        ),
      })),
    upsertReward: (reward) =>
      update((s) => ({
        ...s,
        rewards: s.rewards.some((r) => r.id === reward.id)
          ? s.rewards.map((r) => (r.id === reward.id ? reward : r))
          : [...s.rewards, reward],
      })),
    deleteReward: (id) =>
      update((s) => ({ ...s, rewards: s.rewards.filter((r) => r.id !== id) })),

    upsertRecipe: (recipe) =>
      update((s) => ({
        ...s,
        recipes: s.recipes.some((r) => r.id === recipe.id)
          ? s.recipes.map((r) => (r.id === recipe.id ? recipe : r))
          : [...s.recipes, recipe],
      })),
    deleteRecipe: (id) =>
      update((s) => ({ ...s, recipes: s.recipes.filter((r) => r.id !== id) })),
    setMealPlan: (weekday, entry) =>
      update((s) => ({
        ...s,
        mealPlan: { ...s.mealPlan, [weekday]: entry },
      })),

    upsertPerson: (person) =>
      update((s) => ({
        ...s,
        people: s.people.some((p) => p.id === person.id)
          ? s.people.map((p) => (p.id === person.id ? person : p))
          : [...s.people, person],
      })),
    deletePerson: (id) =>
      update((s) => ({
        ...s,
        people: s.people.filter((p) => p.id !== id),
        dinnerOrder: s.dinnerOrder.filter((x) => x !== id),
        currentUserId: s.currentUserId === id ? null : s.currentUserId,
      })),
    setDinnerOrder: (order) => update((s) => ({ ...s, dinnerOrder: order })),

    upsertCalendarEvent: (event) =>
      update((s) => ({
        ...s,
        calendarEvents: s.calendarEvents.some((e) => e.id === event.id)
          ? s.calendarEvents.map((e) => (e.id === event.id ? event : e))
          : [...s.calendarEvents, event],
      })),
    deleteCalendarEvent: (id) =>
      update((s) => ({
        ...s,
        calendarEvents: s.calendarEvents.filter((e) => e.id !== id),
      })),

    resetAll: () => {
      localStorage.removeItem(STORAGE_KEY);
      setState(ensureTasksForToday(makeSeedState()));
    },
  };

  const value = useMemo(() => store, [state, celebration]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// ── task generation (runs once per day on load) ───────────────────────────────
function ensureTasksForToday(s: AppState): AppState {
  const today = toISODate();
  if (s.lastTaskGenDate === today) return s;

  const tasks = [...s.tasks];
  const hasFor = (choreId: string, date: string) =>
    tasks.some((t) => t.choreId === choreId && t.date === date);
  const hasThisWeek = (choreId: string) => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const startISO = toISODate(start);
    return tasks.some((t) => t.choreId === choreId && t.date >= startISO);
  };

  for (const chore of s.chores) {
    if (chore.isDinner) {
      // The nightly cook task — assigned to the scheduled (capacity-weighted) cook.
      if (hasFor(chore.id, today)) continue;
      const cook = scheduledCook(s, today);
      if (!cook) continue;
      const buddyId = needsBuddyFor(s, cook.id, chore)
        ? pickAdultBuddy(s, cook.id)
        : null;
      tasks.push(
        makeTask(chore, today, cook.id, buddyId, "claimed"),
      );
      continue;
    }
    if (chore.recurrence === "daily" && !hasFor(chore.id, today)) {
      tasks.push(makeTask(chore, today, null, null, "open"));
    } else if (chore.recurrence === "weekly" && !hasThisWeek(chore.id)) {
      tasks.push(makeTask(chore, today, null, null, "open"));
    }
  }

  return { ...s, tasks, lastTaskGenDate: today };
}

function makeTask(
  chore: Chore,
  date: string,
  assignedTo: string | null,
  buddyId: string | null,
  status: Task["status"],
): Task {
  return {
    id: `task-${chore.id}-${date}`,
    choreId: chore.id,
    title: chore.title,
    emoji: chore.emoji,
    points: chore.points,
    skillId: chore.skillId,
    needsBuddy: chore.needsBuddy,
    requiresApproval: chore.requiresApproval,
    minAbility: chore.minAbility,
    isDinner: chore.isDinner,
    date,
    assignedTo,
    buddyId,
    status,
    completedBy: null,
    approvedBy: null,
  };
}

// Does this person need a buddy for this task? (Cooking + person flagged, or a
// task globally flagged needsBuddy assigned to a kid.)
function needsBuddyFor(
  s: AppState,
  personId: string,
  task: Pick<Chore, "isDinner" | "needsBuddy">,
): boolean {
  const person = s.people.find((p) => p.id === personId);
  if (!person) return false;
  if (task.isDinner && person.needsBuddyForCooking) return true;
  if (task.needsBuddy && person.role === "kid") return true;
  return false;
}

function pickAdultBuddy(s: AppState, excludeId: string): string | null {
  const today = toISODate();
  const adults = s.people.filter(
    (p) => p.role === "parent" && p.id !== excludeId,
  );
  if (adults.length === 0) return null;
  const spoonsFor = (id: string) =>
    s.spoons.find((sp) => sp.personId === id && sp.date === today)?.count ??
    Infinity;
  return [...adults].sort((a, b) => spoonsFor(b.id) - spoonsFor(a.id))[0].id;
}

export { badgeDef };
