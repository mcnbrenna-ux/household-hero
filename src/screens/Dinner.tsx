// ── Dinner — whose turn, cover-the-shift, acts of care, meal plan, recipes ────
import { useState } from "react";
import { useStore } from "../store/AppStore";
import { Header } from "../components/Header";
import { Avatar } from "../components/ui";
import { TaskRow } from "../components/TaskRow";
import { scheduledCook, canDo } from "../engine/fairness";
import { toISODate } from "../engine/game";
import {
  isLow,
  lowPeopleToday,
  CARE_SUGGESTIONS,
  spoonsToday,
} from "../engine/spoons";
import type { Recipe } from "../types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Dinner() {
  const { state, currentUser, coverDinner, logCare } = useStore();
  if (!currentUser) return null;
  const today = toISODate();

  const dinnerTask = state.tasks.find((t) => t.isDinner && t.date === today);
  const cook =
    (dinnerTask?.assignedTo &&
      state.people.find((p) => p.id === dinnerTask.assignedTo)) ||
    scheduledCook(state, today);
  const cookLow = cook ? isLow(state, cook) : false;

  // Who could cover dinner: capable of cooking, not the current cook.
  const coverers = state.people.filter(
    (p) =>
      cook &&
      p.id !== cook.id &&
      canDo(p, { minAbility: "kid" }) &&
      p.inDinnerRotation,
  );

  const lowFolks = lowPeopleToday(state);

  return (
    <div className="app-shell">
      <Header title="Kitchen 🍲" sub="Whose Kitchen Duty is it tonight?" />

      <div className="dinner-banner">
        <div className="muted" style={{ color: "rgba(255,255,255,.85)" }}>
          Tonight's Kitchen Duty
        </div>
        {cook ? (
          <>
            <h2>It's {cook.name}'s turn! 🍲</h2>
            {dinnerTask?.buddyId && (
              <div className="sub">
                🤝{" "}
                {
                  state.people.find((p) => p.id === dinnerTask.buddyId)?.name
                }{" "}
                is buddying up
              </div>
            )}
          </>
        ) : (
          <h2>No cook scheduled</h2>
        )}
      </div>

      {/* Mark dinner cooked (the cook or their buddy) */}
      {dinnerTask && dinnerTask.status !== "done" && (
        <div className="card">
          <TaskRow task={dinnerTask} viewer={currentUser} />
        </div>
      )}
      {dinnerTask && dinnerTask.status === "done" && (
        <div className="card empty">Dinner's done — thank you! 💛</div>
      )}

      {/* Spoon-aware: offer to cover tonight's shift, warmly */}
      {cook && cookLow && dinnerTask && dinnerTask.status !== "done" && (
        <div className="care-nudge">
          <h3>Heads up — {cook.name}'s running low on spoons today 🥄</h3>
          <p className="muted" style={{ margin: "6px 0 12px" }}>
            No pressure at all — who'd like to pick up dinner tonight? The XP
            flows to whoever covers it. 💛
          </p>
          <div className="stack">
            {coverers.map((p) => (
              <button
                key={p.id}
                className="btn btn-pink btn-block"
                onClick={() => coverDinner(dinnerTask.id, p.id)}
              >
                <Avatar person={p} size={26} /> {p.name} can cover tonight
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Acts of care for anyone low today */}
      {lowFolks.length > 0 && (
        <>
          <h2 className="section-head">Little ways to help 💛</h2>
          {lowFolks.map((p) => (
            <div className="card" key={p.id}>
              <div className="row" style={{ marginBottom: 10 }}>
                <Avatar person={p} size={40} />
                <div>
                  <strong>{p.name} is low today</strong>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {spoonsToday(state, p.id)} spoons left
                  </div>
                </div>
              </div>
              {p.id === currentUser.id ? (
                <p className="muted" style={{ margin: 0 }}>
                  Rest up — your family's got you. 🤗
                </p>
              ) : (
                <div className="stack">
                  {CARE_SUGGESTIONS.map((c) => (
                    <button
                      key={c.kind}
                      className="btn btn-ghost btn-block"
                      style={{ justifyContent: "flex-start" }}
                      onClick={() => logCare(currentUser.id, p.id, c.kind)}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Weekly meal plan */}
      <h2 className="section-head">This week's meals 📅</h2>
      <div className="card">
        {WEEKDAYS.map((day, i) => {
          const entry = state.mealPlan[i];
          const recipe = entry?.recipeId
            ? state.recipes.find((r) => r.id === entry.recipeId)
            : null;
          const label = recipe ? `${recipe.emoji} ${recipe.title}` : entry?.name;
          return (
            <div className="between" key={i} style={{ padding: "8px 0" }}>
              <span style={{ fontWeight: 800, width: 46 }}>{day}</span>
              {currentUser.role === "parent" ? (
                <MealPicker weekday={i} />
              ) : (
                <span className="muted">{label || "—"}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Recipe box */}
      <h2 className="section-head">Recipe box 📖</h2>
      <RecipeBox />
    </div>
  );
}

function MealPicker({ weekday }: { weekday: number }) {
  const { state, setMealPlan } = useStore();
  const [open, setOpen] = useState(false);
  const entry = state.mealPlan[weekday];
  const recipe = entry?.recipeId
    ? state.recipes.find((r) => r.id === entry.recipeId)
    : null;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          minHeight: 36,
          padding: "0 14px",
          borderRadius: 10,
          border: "1.5px solid var(--line)",
          background: recipe ? "var(--coral-light)" : "var(--bg-muted)",
          color: recipe ? "var(--coral)" : "var(--text-muted)",
          fontWeight: recipe ? 700 : 500,
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          gap: 6,
          whiteSpace: "nowrap",
        }}
      >
        {recipe ? `${recipe.emoji} ${recipe.title}` : "+ Add meal"}
      </button>
      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 9 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 42,
              zIndex: 10,
              background: "var(--bg-surface)",
              border: "1.5px solid var(--line)",
              borderRadius: 14,
              boxShadow: "var(--shadow)",
              padding: 6,
              minWidth: 180,
            }}
          >
            {recipe && (
              <button
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  background: "none",
                  fontSize: 13,
                  color: "var(--text-muted)",
                  borderRadius: 8,
                }}
                onClick={() => {
                  setMealPlan(weekday, {});
                  setOpen(false);
                }}
              >
                — clear —
              </button>
            )}
            {state.recipes.map((r) => (
              <button
                key={r.id}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  background:
                    entry?.recipeId === r.id ? "var(--coral-light)" : "none",
                  color:
                    entry?.recipeId === r.id
                      ? "var(--coral)"
                      : "var(--text-body)",
                  fontWeight: entry?.recipeId === r.id ? 700 : 400,
                  fontSize: 13,
                  borderRadius: 8,
                }}
                onClick={() => {
                  setMealPlan(weekday, { recipeId: r.id });
                  setOpen(false);
                }}
              >
                {r.emoji} {r.title}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RecipeBox() {
  const { state, currentUser, deleteRecipe } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [editing, setEditing] = useState<Recipe | null>(null);

  if (editing) {
    return <RecipeForm recipe={editing} onDone={() => setEditing(null)} />;
  }

  return (
    <>
      {currentUser?.role === "parent" && (
        <button
          className="btn btn-block"
          style={{ marginBottom: 12 }}
          onClick={() =>
            setEditing({
              id: `recipe-${Date.now()}`,
              title: "",
              emoji: "🍽️",
              ingredients: [],
              steps: [],
            })
          }
        >
          ➕ Add a recipe
        </button>
      )}
      {state.recipes.map((r) => (
        <div className="card" key={r.id}>
          <button
            className="between"
            style={{ background: "none", width: "100%" }}
            onClick={() => setOpen(open === r.id ? null : r.id)}
          >
            <span style={{ fontWeight: 800, fontSize: 17 }}>
              {r.emoji} {r.title}
            </span>
            <span className="muted">{open === r.id ? "▲" : "▼"}</span>
          </button>
          {open === r.id && (
            <div style={{ marginTop: 12 }}>
              <strong>Ingredients</strong>
              <ul style={{ margin: "6px 0 14px", paddingLeft: 20 }}>
                {r.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
              <strong>Steps</strong>
              <ol style={{ margin: "6px 0 0", paddingLeft: 20 }}>
                {r.steps.map((s, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>
                    {s}
                  </li>
                ))}
              </ol>
              {currentUser?.role === "parent" && (
                <div className="grid-2" style={{ marginTop: 14 }}>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setEditing(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ color: "var(--brand-2)" }}
                    onClick={() => deleteRecipe(r.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function RecipeForm({
  recipe,
  onDone,
}: {
  recipe: Recipe;
  onDone: () => void;
}) {
  const { upsertRecipe } = useStore();
  const [title, setTitle] = useState(recipe.title);
  const [emoji, setEmoji] = useState(recipe.emoji);
  const [ingredients, setIngredients] = useState(recipe.ingredients.join("\n"));
  const [steps, setSteps] = useState(recipe.steps.join("\n"));

  return (
    <div className="card">
      <div className="grid-2">
        <div className="field">
          <label>Emoji</label>
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} />
        </div>
        <div className="field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label>Ingredients (one per line)</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </div>
      <div className="field">
        <label>Steps (one per line)</label>
        <textarea value={steps} onChange={(e) => setSteps(e.target.value)} />
      </div>
      <div className="grid-2">
        <button className="btn btn-ghost" onClick={onDone}>
          Cancel
        </button>
        <button
          className="btn btn-green"
          disabled={!title.trim()}
          onClick={() => {
            upsertRecipe({
              ...recipe,
              title: title.trim(),
              emoji: emoji || "🍽️",
              ingredients: ingredients
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
              steps: steps
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
            });
            onDone();
          }}
        >
          Save recipe
        </button>
      </div>
    </div>
  );
}
