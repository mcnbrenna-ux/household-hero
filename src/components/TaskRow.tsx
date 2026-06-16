// ── A single quest card with the big "I did it!" action (v3 hero component) ───
import {
  Sparkles,
  UtensilsCrossed,
  BookOpen,
  Heart,
  Star,
  ChefHat,
  Hourglass,
  Users,
  CheckCircle2,
  Hand,
} from "lucide-react";
import { useStore } from "../store/AppStore";
import type { Person, Task } from "../types";

// ── Category visuals: Lucide icon + tint, keyed off the quest's skill ────────
type Visual = { Icon: typeof Sparkles; color: string; bg: string };

function questVisual(task: Task): Visual {
  if (task.isDinner) return { Icon: ChefHat, color: "var(--coral)", bg: "var(--coral-light)" };
  switch (task.skillId) {
    case "cooking":
      return { Icon: UtensilsCrossed, color: "#c77f00", bg: "var(--amber-light)" };
    case "scholar":
      return { Icon: BookOpen, color: "#1f8ec4", bg: "var(--sky-light)" };
    case "wellbeing":
      return { Icon: Heart, color: "var(--mint-dark, #1f9e7e)", bg: "var(--mint-light)" };
    case "tidy":
      return { Icon: Sparkles, color: "var(--coral)", bg: "var(--coral-light)" };
    default:
      return { Icon: Star, color: "#7b61ff", bg: "rgba(123,97,255,0.12)" };
  }
}

export function TaskRow({ task, viewer }: { task: Task; viewer: Person }) {
  const { state, claimTask, completeTask } = useStore();
  const buddy = task.buddyId
    ? state.people.find((p) => p.id === task.buddyId)
    : null;
  const assignee = task.assignedTo
    ? state.people.find((p) => p.id === task.assignedTo)
    : null;

  const isMine = task.assignedTo === viewer.id || task.buddyId === viewer.id;
  const isOpen = task.status === "open";
  const isPending = task.status === "pending";
  // The doer is the assignee (or buddy) — points always go to them, never to a
  // bystander who happens to tap. Open tasks become "mine" the moment I grab.
  const doerId = task.assignedTo ?? viewer.id;

  const { Icon, color, bg } = questVisual(task);

  return (
    <div className={`quest-card${isPending ? " is-pending" : ""}`}>
      <div className="quest-ico" style={{ background: bg, color }}>
        <Icon size={26} strokeWidth={2.4} />
      </div>

      <div className="quest-main">
        <div className="quest-title">{task.title}</div>
        <div className="quest-chips">
          <span className="pill">
            <Star size={12} strokeWidth={2.6} />
            <span className="num">{task.points}</span> XP
          </span>
          {task.isDinner && (
            <span className="pill pill-approve">
              <ChefHat size={12} strokeWidth={2.6} /> Kitchen
            </span>
          )}
          {buddy && (
            <span className="pill pill-buddy">
              <Users size={12} strokeWidth={2.6} /> with {buddy.name}
            </span>
          )}
          {task.requiresApproval && !isPending && (
            <span className="pill pill-approve">
              <CheckCircle2 size={12} strokeWidth={2.6} /> needs check
            </span>
          )}
          {isOpen && <span className="task-meta">Open to grab</span>}
          {assignee && !isMine && !isOpen && (
            <span className="task-meta">for {assignee.name}</span>
          )}
        </div>
      </div>

      <div>
        {isPending ? (
          <span className="quest-wait">
            <Hourglass size={16} strokeWidth={2.4} /> Waiting
          </span>
        ) : isOpen ? (
          <button
            className="btn btn-ghost"
            onClick={() => claimTask(task.id, viewer.id)}
          >
            <Hand size={15} strokeWidth={2.4} /> Grab it
          </button>
        ) : isMine ? (
          <button
            className="btn btn-green"
            onClick={() => completeTask(task.id, doerId)}
          >
            <CheckCircle2 size={16} strokeWidth={2.6} /> Done!
          </button>
        ) : (
          <span className="task-meta">{assignee ? `${assignee.name}'s` : ""}</span>
        )}
      </div>
    </div>
  );
}
