// ── Tasks — my tasks, the grab-it pool, and (for parents) the approval queue ──
import { useState } from "react";
import { useStore } from "../store/AppStore";
import { Header } from "../components/Header";
import { TaskRow } from "../components/TaskRow";
import { assignedTo, openPoolFor } from "../engine/fairness";
import { toISODate } from "../engine/game";

export function Tasks() {
  const { state, currentUser, approveTask } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  if (!currentUser) return null;
  const today = toISODate();

  const mine = assignedTo(currentUser, state).filter((t) => t.date <= today);
  const open = openPoolFor(currentUser, state);
  const pending =
    currentUser.role === "parent"
      ? state.tasks.filter((t) => t.status === "pending")
      : [];

  return (
    <div className="app-shell">
      <Header title="Quests" sub="Do what you can — every quest counts." />

      {currentUser.role === "parent" && (
        <button
          className="btn btn-block"
          style={{ marginBottom: 14 }}
          onClick={() => setShowAdd((v) => !v)}
        >
          ➕ Assign New Quest
        </button>
      )}
      {showAdd && <AddTaskForm onDone={() => setShowAdd(false)} />}

      {/* Guild Master approval queue */}
      {pending.length > 0 && (
        <>
          <h2 className="section-head">Needs your approval</h2>
          <div className="card">
            {pending.map((t) => {
              const who = state.people.find((p) => p.id === t.completedBy);
              return (
                <div className="task-row" key={t.id}>
                  <div className="task-emoji">{t.emoji}</div>
                  <div className="task-main">
                    <div className="task-title">{t.title}</div>
                    <div className="task-meta">
                      {who ? `${who.name} says it's done` : "Done"} · ⭐{" "}
                      <span className="num">{t.points}</span> XP
                    </div>
                  </div>
                  <button
                    className="btn btn-green"
                    onClick={() => approveTask(t.id, currentUser.id)}
                  >
                    ✅ Approve
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <h2 className="section-head">My Active Quests</h2>
      {mine.length === 0 ? (
        <div className="card empty">
          All done! Rest up, or pick something from Open Quests. 🌟
        </div>
      ) : (
        <div className="card">
          {mine.map((t) => (
            <TaskRow key={t.id} task={t} viewer={currentUser} />
          ))}
        </div>
      )}

      <h2 className="section-head">Open Quests 🙋</h2>
      {open.length === 0 ? (
        <div className="card empty">
          No open quests for you to claim yet. Nice and tidy!
        </div>
      ) : (
        <div className="card">
          {open.map((t) => (
            <TaskRow key={t.id} task={t} viewer={currentUser} />
          ))}
        </div>
      )}
    </div>
  );
}

// Quest types (PRD §8.2) → emoji, the skill they build, and a base XP value.
const QUEST_TYPES = [
  { id: "household", label: "🏠 Household", emoji: "🏠", skillId: "tidy", xp: 30 },
  { id: "kitchen", label: "🍲 Kitchen", emoji: "🍲", skillId: "cooking", xp: 25 },
  { id: "learning", label: "📚 Learning", emoji: "📚", skillId: "scholar", xp: 30 },
  { id: "selfcare", label: "🌿 Self-Care", emoji: "🌿", skillId: "wellbeing", xp: 15 },
  { id: "bonus", label: "⭐ Bonus", emoji: "⭐", skillId: undefined, xp: 20 },
] as const;

// Guild Master only: assign a one-time quest, optionally to a specific adventurer.
function AddTaskForm({ onDone }: { onDone: () => void }) {
  const { state, addOneTimeChore } = useStore();
  const [title, setTitle] = useState("");
  const [typeId, setTypeId] = useState<string>("household");
  const type = QUEST_TYPES.find((t) => t.id === typeId)!;
  const [points, setPoints] = useState<number>(type.xp);
  const [assignee, setAssignee] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(false);

  return (
    <div className="card">
      <div className="field">
        <label>What's the quest?</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Vacuum the living room"
        />
      </div>
      <div className="grid-2">
        <div className="field">
          <label>Quest type</label>
          <select
            value={typeId}
            onChange={(e) => {
              setTypeId(e.target.value);
              const t = QUEST_TYPES.find((q) => q.id === e.target.value)!;
              setPoints(t.xp);
            }}
          >
            {QUEST_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>XP value</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="field">
        <label>Assign to (or leave open for anyone)</label>
        <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
          <option value="">Open to anyone capable</option>
          {state.people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <label className="row" style={{ marginBottom: 12, fontWeight: 800 }}>
        <input
          type="checkbox"
          checked={requiresApproval}
          onChange={(e) => setRequiresApproval(e.target.checked)}
          style={{ width: 20, height: 20 }}
        />
        Needs parent approval before XP
      </label>
      <div className="grid-2">
        <button className="btn btn-ghost" onClick={onDone}>
          Cancel
        </button>
        <button
          className="btn btn-green"
          disabled={!title.trim()}
          onClick={() => {
            const who = state.people.find((p) => p.id === assignee);
            addOneTimeChore(
              {
                title: title.trim(),
                emoji: type.emoji,
                points,
                skillId: type.skillId,
                minAbility: who ? who.ability : "toddler",
                needsBuddy: false,
                requiresApproval,
              },
              assignee || null,
            );
            onDone();
          }}
        >
          Assign Quest
        </button>
      </div>
    </div>
  );
}
