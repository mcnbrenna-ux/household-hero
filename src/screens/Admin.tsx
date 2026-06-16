// ── Admin — the fairness engine setup (parents only) ──────────────────────────
// Family members + ability/capacity/buddy flags, the dinner rotation order,
// and a reset. This governs how every other feature filters & weights tasks.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/AppStore";
import { Avatar } from "../components/ui";
import { AvatarBuilder, CREATURE_COLORS } from "../components/AvatarBuilder";
import { defaultAvatar } from "../types";
import type { Ability, Capacity, Person, Role } from "../types";

const COLORS = CREATURE_COLORS;

export function Admin() {
  const { state, currentUser, setDinnerOrder, resetAll } = useStore();
  const nav = useNavigate();
  const [editing, setEditing] = useState<Person | null>(null);

  if (!currentUser || currentUser.role !== "parent") {
    return (
      <div className="app-shell">
        <div className="card empty">Only Parents can open settings.</div>
      </div>
    );
  }

  const move = (id: string, dir: -1 | 1) => {
    const order = [...state.dinnerOrder];
    const i = order.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    setDinnerOrder(order);
  };

  if (editing) {
    return <PersonForm person={editing} onDone={() => setEditing(null)} />;
  }

  return (
    <div className="app-shell">
      <div className="between" style={{ marginBottom: 16 }}>
        <h1 className="screen-title">Settings ⚙️</h1>
        <button className="btn btn-ghost" style={{ minHeight: 44 }} onClick={() => nav("/")}>
          Done
        </button>
      </div>

      <FamilySettings />

      <h2 className="section-head" style={{ marginTop: 0 }}>
        Family Members
      </h2>
      {state.people.map((p) => (
        <div className="card" key={p.id}>
          <div className="between">
            <div className="row">
              <Avatar person={p} size={48} />
              <div>
                <strong>{p.name}</strong>
                <div className="muted" style={{ fontSize: 13 }}>
                  {p.role === "parent" ? "Parent" : "Kid"} ·{" "}
                  {abilityLabel(p.ability)} · {capLabel(p.capacity)}
                  {p.needsBuddyForCooking ? " · 🤝 buddy to cook" : ""}
                </div>
              </div>
            </div>
            <button className="btn btn-ghost" style={{ minHeight: 42 }} onClick={() => setEditing(p)}>
              Edit
            </button>
          </div>
        </div>
      ))}
      <button
        className="btn btn-block"
        onClick={() =>
          setEditing({
            id: `person-${Date.now()}`,
            name: "",
            avatar: defaultAvatar(COLORS[0]),
            color: COLORS[0],
            role: "kid",
            ability: "kid",
            capacity: "normal",
            needsBuddyForCooking: false,
            inDinnerRotation: true,
            tracksSpoons: true,
            maxSpoons: 10,
            lifetimePoints: 0,
            spendablePoints: 0,
            skills: {},
            badges: [],
          })
        }
      >
        ➕ Add a Family Member
      </button>

      {/* Cooking rotation order */}
      <h2 className="section-head">Cooking Rotation 🍲</h2>
      <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>
        Rotates daily. Lighter capacity comes up less often; toddlers and anyone
        not in the rotation are skipped automatically.
      </p>
      <div className="card">
        {state.dinnerOrder
          .map((id) => state.people.find((p) => p.id === id))
          .filter((p): p is Person => !!p && p.inDinnerRotation)
          .map((p, idx, arr) => (
            <div className="between" key={p.id} style={{ padding: "8px 0" }}>
              <div className="row">
                <span className="muted" style={{ width: 20 }}>
                  {idx + 1}
                </span>
                <Avatar person={p} size={36} />
                <strong>{p.name}</strong>
                <span className="chip">{capLabel(p.capacity)}</span>
              </div>
              <div className="row" style={{ gap: 6 }}>
                <button
                  className="btn btn-ghost"
                  style={{ minHeight: 40, padding: "0 14px" }}
                  disabled={idx === 0}
                  onClick={() => move(p.id, -1)}
                >
                  ↑
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ minHeight: 40, padding: "0 14px" }}
                  disabled={idx === arr.length - 1}
                  onClick={() => move(p.id, 1)}
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
      </div>

      <h2 className="section-head">Danger zone</h2>
      <div className="card">
        <p className="muted" style={{ marginTop: 0 }}>
          Reset everything back to the example family and clear all XP, quests,
          and history.
        </p>
        <button
          className="btn btn-danger btn-block"
          onClick={() => {
            if (confirm("Reset all family data? This can't be undone.")) {
              resetAll();
              nav("/who");
            }
          }}
        >
          Reset all data
        </button>
      </div>
    </div>
  );
}

// Family name + Parent PIN (PRD §7 Settings).
function FamilySettings() {
  const { state, setFamilyName, setPin } = useStore();
  const [name, setName] = useState(state.familyName);
  const [pin, setLocalPin] = useState("");

  return (
    <div className="card">
      <div className="field">
        <label>Family name</label>
        <div className="row" style={{ gap: 8 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-ghost"
            style={{ minHeight: 48 }}
            disabled={!name.trim() || name.trim() === state.familyName}
            onClick={() => setFamilyName(name)}
          >
            Save
          </button>
        </div>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label>Change Parent PIN</label>
        <div className="row" style={{ gap: 8 }}>
          <input
            inputMode="numeric"
            maxLength={4}
            placeholder="New 4-digit PIN"
            value={pin}
            onChange={(e) => setLocalPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-ghost"
            style={{ minHeight: 48 }}
            disabled={pin.length !== 4}
            onClick={() => {
              setPin(pin);
              setLocalPin("");
              alert("PIN updated.");
            }}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

function abilityLabel(a: Ability) {
  return a === "full" ? "All quests" : a === "kid" ? "Most quests" : "Toddler-safe";
}
function capLabel(c: Capacity) {
  return c[0].toUpperCase() + c.slice(1);
}

function PersonForm({ person, onDone }: { person: Person; onDone: () => void }) {
  const { state, upsertPerson, deletePerson, setDinnerOrder } = useStore();
  const [p, setP] = useState<Person>(person);
  const exists = state.people.some((x) => x.id === person.id);
  const set = <K extends keyof Person>(k: K, v: Person[K]) =>
    setP((cur) => ({ ...cur, [k]: v }));

  return (
    <div className="app-shell">
      <h1 className="screen-title" style={{ marginBottom: 16 }}>
        {exists ? `Edit ${person.name}` : "New family member"}
      </h1>

      <div className="card">
        <div className="field">
          <label>Name</label>
          <input value={p.name} onChange={(e) => set("name", e.target.value)} />
        </div>

        <div className="field">
          <label>Character</label>
          <AvatarBuilder
            value={p.avatar}
            onChange={(next) =>
              // Keep the banner color in step with the creature's color.
              setP((cur) => ({ ...cur, avatar: next, color: next.color }))
            }
          />
        </div>

        <div className="grid-2">
          <div className="field">
            <label>Role</label>
            <select value={p.role} onChange={(e) => set("role", e.target.value as Role)}>
              <option value="parent">Parent (admin)</option>
              <option value="kid">Kid (member)</option>
            </select>
          </div>
          <div className="field">
            <label>Age (optional)</label>
            <input
              type="number"
              value={p.age ?? ""}
              onChange={(e) =>
                set("age", e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>
        </div>

        <div className="field">
          <label>Ability — what they CAN do</label>
          <select
            value={p.ability}
            onChange={(e) => set("ability", e.target.value as Ability)}
          >
            <option value="toddler">Toddler-safe quests only</option>
            <option value="kid">Most quests + cooking with a helper</option>
            <option value="full">Everything</option>
          </select>
        </div>

        <div className="field">
          <label>Capacity — how MUCH they should carry</label>
          <select
            value={p.capacity}
            onChange={(e) => set("capacity", e.target.value as Capacity)}
          >
            <option value="light">Light (smaller fair share)</option>
            <option value="normal">Normal</option>
            <option value="heavy">Heavy (carries the baseline)</option>
          </select>
        </div>

        <label className="row" style={{ fontWeight: 800, marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={p.needsBuddyForCooking}
            onChange={(e) => set("needsBuddyForCooking", e.target.checked)}
            style={{ width: 20, height: 20 }}
          />
          🤝 Needs an adult buddy to cook
        </label>
        <label className="row" style={{ fontWeight: 800, marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={p.inDinnerRotation}
            onChange={(e) => set("inDinnerRotation", e.target.checked)}
            style={{ width: 20, height: 20 }}
          />
          🍳 In the dinner rotation
        </label>
        <label className="row" style={{ fontWeight: 800, marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={p.tracksSpoons}
            onChange={(e) => set("tracksSpoons", e.target.checked)}
            style={{ width: 20, height: 20 }}
          />
          🥄 Tracks spoons (daily energy)
        </label>

        {p.tracksSpoons && (
          <div className="field">
            <label>Max spoons per day</label>
            <input
              type="number"
              value={p.maxSpoons}
              onChange={(e) => set("maxSpoons", Number(e.target.value))}
            />
          </div>
        )}
      </div>

      <div className="grid-2">
        <button className="btn btn-ghost" onClick={onDone}>
          Cancel
        </button>
        <button
          className="btn btn-green"
          disabled={!p.name.trim()}
          onClick={() => {
            upsertPerson({ ...p, name: p.name.trim() });
            // Keep dinner order in sync when adding someone new.
            if (!exists && p.inDinnerRotation) {
              setDinnerOrder([...state.dinnerOrder, p.id]);
            }
            onDone();
          }}
        >
          Save
        </button>
      </div>

      {exists && state.people.length > 1 && (
        <button
          className="btn btn-block"
          style={{ background: "var(--brand-2)", marginTop: 12 }}
          onClick={() => {
            if (confirm(`Remove ${p.name}?`)) {
              deletePerson(p.id);
              onDone();
            }
          }}
        >
          Remove {p.name}
        </button>
      )}
    </div>
  );
}
