// ── Guild (🏆) — rankings, champion, the Reward Shop, and the achievements wall.
import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/AppStore";
import { Header } from "../components/Header";
import { Avatar, ProgressBar } from "../components/ui";
import { leaderboard, heroOfTheWeek } from "../engine/fairness";
import { levelTitle, levelForPoints, BADGES, SKILLS, skillLevel } from "../engine/game";
import type { Reward } from "../types";

export function Guild() {
  const { state, currentUser, redeemReward, fulfillRedemption, deleteReward } =
    useStore();
  const [editing, setEditing] = useState<Reward | null>(null);
  if (!currentUser) return null;

  const isMaster = currentUser.role === "parent";
  const board = leaderboard(state);
  const champion = heroOfTheWeek(state);
  const allTime = [...state.people].sort(
    (a, b) => b.lifetimePoints - a.lifetimePoints,
  );
  const unfulfilled = state.redemptions.filter((r) => !r.fulfilled);
  const maxLifetime = Math.max(1, ...state.people.map((p) => p.lifetimePoints));

  return (
    <div className="app-shell">
      <Header title="Family 🏆" sub="The whole family grows stronger together." />

      {/* Champion of the week */}
      {champion && (
        <div className="dinner-banner">
          <div className="muted" style={{ color: "rgba(255,255,255,.85)" }}>
            👑 Champion of the Week
          </div>
          <h2>{champion.name} is leading this week!</h2>
        </div>
      )}

      {/* Weekly rankings — by % of one's own fair share, so everyone can win */}
      <h2 className="section-head" style={{ marginTop: 8 }}>
        This Week's Rankings
      </h2>
      <div className="card">
        {board.map((row, i) => (
          <motion.div
            key={row.person.id}
            className="row"
            style={{ marginBottom: 12 }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.28, ease: "easeOut" }}
          >
            <span className="num" style={{ fontSize: 22, width: 22, color: "var(--color-gold)" }}>
              {i + 1}
            </span>
            <Avatar person={row.person} size={40} />
            <div style={{ flex: 1 }}>
              <div className="between" style={{ marginBottom: 4 }}>
                <strong style={{ fontSize: 14 }}>{row.person.name}</strong>
                <span className="muted" style={{ fontSize: 13 }}>
                  {row.done}/{row.target} · {Math.round(row.pct * 100)}%
                </span>
              </div>
              <ProgressBar pct={row.pct} color={row.person.color} />
            </div>
          </motion.div>
        ))}
        <p className="muted" style={{ fontSize: 12, margin: "6px 2px 0" }}>
          Everyone races their own fair share — so everyone can win. 💛
        </p>
      </div>

      {/* All-time rankings — by lifetime XP */}
      <h2 className="section-head">All-Time Legends</h2>
      <div className="card">
        {allTime.map((p, i) => (
          <div key={p.id} className="row" style={{ marginBottom: 12 }}>
            <span className="num" style={{ fontSize: 22, width: 22, color: "var(--color-gold)" }}>
              {i + 1}
            </span>
            <Avatar person={p} size={40} />
            <div style={{ flex: 1 }}>
              <div className="between" style={{ marginBottom: 4 }}>
                <strong style={{ fontSize: 14 }}>{p.name}</strong>
                <span className="muted" style={{ fontSize: 13 }}>
                  Lv {levelForPoints(p.lifetimePoints)} ·{" "}
                  <span className="num">{p.lifetimePoints}</span> XP
                </span>
              </div>
              <ProgressBar pct={p.lifetimePoints / maxLifetime} color={p.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Reward Shop */}
      <h2 className="section-head">Reward Shop 🪙</h2>
      <div className="card">
        <div className="between">
          <strong>Your spendable XP</strong>
          <span className="chip chip-spend" style={{ fontSize: 16 }}>
            🪙 <span className="num">{currentUser.spendablePoints}</span>
          </span>
        </div>
        <p className="muted" style={{ margin: "8px 0 0", fontSize: 13 }}>
          Spending never lowers your level — that only ever goes up. ✨
        </p>
      </div>

      {/* Guild Master: redemptions waiting to be handed out */}
      {isMaster && unfulfilled.length > 0 && (
        <div className="card">
          <strong>To hand out 🎉</strong>
          {unfulfilled.map((r) => {
            const who = state.people.find((p) => p.id === r.personId);
            return (
              <div className="between" key={r.id} style={{ padding: "8px 0" }}>
                <span>
                  <strong>{who?.name}</strong> redeemed{" "}
                  <strong>{r.rewardTitle}</strong>
                </span>
                <button
                  className="btn btn-green"
                  style={{ minHeight: 44 }}
                  onClick={() => fulfillRedemption(r.id)}
                >
                  Done ✓
                </button>
              </div>
            );
          })}
        </div>
      )}

      {isMaster && (
        <button
          className="btn btn-block"
          style={{ marginBottom: 14 }}
          onClick={() =>
            setEditing({ id: `reward-${Date.now()}`, title: "", emoji: "🎁", cost: 50 })
          }
        >
          ➕ Add a reward
        </button>
      )}
      {editing && <RewardForm reward={editing} onDone={() => setEditing(null)} />}

      <div className="grid-2">
        {state.rewards.map((r) => {
          const afford = currentUser.spendablePoints >= r.cost;
          return (
            <div className="card" key={r.id} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 44 }}>{r.emoji}</div>
              <div style={{ fontWeight: 800, margin: "6px 0" }}>{r.title}</div>
              <div className="chip" style={{ marginBottom: 10 }}>
                🪙 <span className="num">{r.cost}</span>
              </div>
              <button
                className="btn btn-accent btn-block"
                disabled={!afford}
                onClick={() => redeemReward(r.id, currentUser.id)}
              >
                {afford
                  ? "Redeem"
                  : `Need ${r.cost - currentUser.spendablePoints} more`}
              </button>
              {isMaster && (
                <div
                  className="row"
                  style={{ justifyContent: "center", marginTop: 8, gap: 14 }}
                >
                  <button className="linklike" onClick={() => setEditing(r)}>
                    Edit
                  </button>
                  <button
                    className="linklike"
                    style={{ color: "var(--color-accent)" }}
                    onClick={() => deleteReward(r.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Achievements wall — every member's badges & top skills */}
      <h2 className="section-head">Hall of Achievements</h2>
      {state.people.map((p) => {
        const topSkills = SKILLS.filter((s) => (p.skills[s.id] ?? 0) > 0);
        return (
          <div className="card" key={p.id}>
            <div className="row" style={{ marginBottom: 10 }}>
              <Avatar person={p} size={44} />
              <div>
                <strong>{p.name}</strong>
                <div className="muted" style={{ fontSize: 12 }}>
                  {levelTitle(levelForPoints(p.lifetimePoints))}
                </div>
              </div>
            </div>
            <div className="row" style={{ flexWrap: "wrap", gap: 10 }}>
              {BADGES.map((b) => {
                const earned = p.badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    title={earned ? b.name : b.hint}
                    style={{
                      fontSize: 26,
                      opacity: earned ? 1 : 0.28,
                      filter: earned ? "none" : "grayscale(1)",
                    }}
                  >
                    {b.emoji}
                  </div>
                );
              })}
            </div>
            {topSkills.length > 0 && (
              <div className="row" style={{ flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {topSkills.map((s) => (
                  <span key={s.id} className="pill">
                    {s.emoji} {s.name} Lv {skillLevel(p.skills[s.id] ?? 0)}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RewardForm({ reward, onDone }: { reward: Reward; onDone: () => void }) {
  const { upsertReward } = useStore();
  const [title, setTitle] = useState(reward.title);
  const [emoji, setEmoji] = useState(reward.emoji);
  const [cost, setCost] = useState(reward.cost);
  return (
    <div className="card">
      <div className="field">
        <label>Reward</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Pick the movie"
        />
      </div>
      <div className="grid-2">
        <div className="field">
          <label>Emoji</label>
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} />
        </div>
        <div className="field">
          <label>Cost (XP)</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="grid-2">
        <button className="btn btn-ghost" onClick={onDone}>
          Cancel
        </button>
        <button
          className="btn btn-green"
          disabled={!title.trim()}
          onClick={() => {
            upsertReward({ ...reward, title: title.trim(), emoji, cost });
            onDone();
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
