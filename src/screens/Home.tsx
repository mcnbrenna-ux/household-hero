// ── Home — Family HQ, everything at a glance (v3 §"Home Dashboard") ───────────
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, UtensilsCrossed, Crown, Star, Coins } from "lucide-react";
import { useStore } from "../store/AppStore";
import { Header } from "../components/Header";
import { Avatar, ProgressBar } from "../components/ui";
import { TaskRow } from "../components/TaskRow";
import {
  scheduledCook,
  assignedTo,
  openPoolFor,
  leaderboard,
  heroOfTheWeek,
} from "../engine/fairness";
import { levelProgress, toISODate } from "../engine/game";
import { lowPeopleToday, spoonsToday } from "../engine/spoons";

export function Home() {
  const { state, currentUser } = useStore();
  if (!currentUser) return null;

  const isMaster = currentUser.role === "parent";
  const today = toISODate();
  const pendingCount = state.tasks.filter((t) => t.status === "pending").length;
  const spoonFolk = state.people.filter((p) => p.tracksSpoons);
  const cook = scheduledCook(state, today);
  const dinnerTask = state.tasks.find((t) => t.isDinner && t.date === today);
  const actualCook = dinnerTask?.assignedTo
    ? state.people.find((p) => p.id === dinnerTask.assignedTo)
    : cook;
  const buddy = dinnerTask?.buddyId
    ? state.people.find((p) => p.id === dinnerTask.buddyId)
    : null;

  const lowFolks = lowPeopleToday(state).filter((p) => p.id !== currentUser.id);
  const mine = assignedTo(currentUser, state).filter(
    (t) => t.date <= today && t.status !== "done",
  );
  const open = openPoolFor(currentUser, state).slice(0, 3);
  const lp = levelProgress(currentUser.lifetimePoints);
  const board = leaderboard(state);
  const hero = heroOfTheWeek(state);

  const card = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay, duration: 0.3, ease: "easeOut" as const } },
  });

  return (
    <div className="app-shell">
      <Header title={`Hi, ${currentUser.name}!`} sub={state.familyName} />

      {/* Pending approvals — Guild Masters only */}
      {isMaster && pendingCount > 0 && (
        <Link
          to="/quests"
          className="btn btn-accent btn-block"
          style={{ marginBottom: 16 }}
        >
          <Clock size={18} /> {pendingCount} quest{pendingCount > 1 ? "s" : ""}{" "}
          waiting for your thumbs up
        </Link>
      )}

      {/* Today's energy — everyone's spoons, visible to all (v3 §5) */}
      {spoonFolk.length > 0 && (
        <Link to="/me" style={{ textDecoration: "none" }}>
          <motion.div className="card" {...card(0.05)}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 10 }}>
              Today's energy
            </div>
            <div className="row" style={{ flexWrap: "wrap", gap: 14 }}>
              {spoonFolk.map((p) => {
                const c = spoonsToday(state, p.id);
                const max = Math.min(p.maxSpoons, 10);
                return (
                  <div key={p.id} style={{ textAlign: "center", minWidth: 52 }}>
                    <Avatar person={p} size={40} mood={c !== null && c <= 3 ? "sleepy" : "happy"} />
                    <div style={{ marginTop: 6 }}>
                      {c === null ? (
                        <span className="muted" style={{ fontSize: 11 }}>—</span>
                      ) : (
                        <>
                          <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 2 }}>
                            {Array.from({ length: max }, (_, i) => (
                              <div
                                key={i}
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: "50%",
                                  background: i < c ? "var(--sky)" : "var(--text-light)",
                                  transition: "background 0.2s",
                                }}
                              />
                            ))}
                          </div>
                          <span className="num" style={{ color: "var(--sky)", fontSize: 11 }}>
                            {c}/{max}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </Link>
      )}

      {/* Tonight's Dinner */}
      <Link to="/kitchen" style={{ textDecoration: "none" }}>
        <motion.div className="dinner-banner" {...card(0.12)}>
          <div className="between">
            <div>
              <div className="row" style={{ gap: 6, color: "var(--text-muted)" }}>
                <UtensilsCrossed size={16} />
                <span style={{ fontWeight: 600, fontSize: 13 }}>
                  Tonight's Dinner
                </span>
              </div>
              {actualCook ? (
                <>
                  <h2 style={{ marginTop: 6 }}>{actualCook.name}'s Kitchen Night</h2>
                  {buddy && (
                    <div className="sub">🤝 {buddy.name} is buddying up</div>
                  )}
                </>
              ) : (
                <h2 style={{ marginTop: 6 }}>What's cooking tonight?</h2>
              )}
            </div>
            {actualCook && <Avatar person={actualCook} size={56} mood="happy" />}
          </div>
        </motion.div>
      </Link>

      {/* Low-spoon care nudges (gentle, opt-in invitations) */}
      {lowFolks.map((p) => {
        const theirDinner =
          dinnerTask && dinnerTask.assignedTo === p.id ? dinnerTask : null;
        return (
          <div className="care-nudge" key={p.id}>
            <div className="row" style={{ marginBottom: 8 }}>
              <Avatar person={p} size={42} mood="sleepy" />
              <h3>{p.name}'s running a little low today 💛</h3>
            </div>
            <p className="muted" style={{ margin: "0 0 12px" }}>
              {theirDinner
                ? `It's ${p.name}'s night to cook. Want to pick it up?`
                : `A small kindness would mean a lot right now.`}
            </p>
            <Link to="/kitchen" className="btn btn-pink btn-block">
              See how to help
            </Link>
          </div>
        );
      })}

      {/* My level */}
      <motion.div className="card" {...card(0.18)}>
        <div className="between" style={{ marginBottom: 10 }}>
          <strong style={{ fontWeight: 800 }}>
            Lv {lp.level} · {lp.title}
          </strong>
          <span className="muted">
            <span className="num">{lp.into}</span>/
            <span className="num">{lp.span}</span> XP to next
          </span>
        </div>
        <ProgressBar pct={lp.pct} color={currentUser.color} />
        <div className="row" style={{ marginTop: 12, gap: 12 }}>
          <span className="chip">
            <Star size={13} /> <span className="num">{currentUser.lifetimePoints}</span> XP
          </span>
          <span className="chip chip-spend">
            <Coins size={13} /> <span className="num">{currentUser.spendablePoints}</span> to spend
          </span>
        </div>
      </motion.div>

      {/* My active quests */}
      <div className="between">
        <h2 className="section-head" style={{ margin: "8px 0" }}>
          My Quests
        </h2>
        <Link to="/quests" className="linklike">
          See all
        </Link>
      </div>
      {mine.length === 0 && open.length === 0 ? (
        <div className="card empty">
          All clear! Rest up, or grab a bonus quest in the{" "}
          <Link to="/quests">Quests</Link> tab 🌟
        </div>
      ) : (
        <div className="card">
          {mine.map((t) => (
            <TaskRow key={t.id} task={t} viewer={currentUser} />
          ))}
          {open.map((t) => (
            <TaskRow key={t.id} task={t} viewer={currentUser} />
          ))}
        </div>
      )}

      {/* Leaderboard peek — by % of own fair share */}
      <div className="between">
        <h2 className="section-head" style={{ margin: "8px 0" }}>
          This Week
        </h2>
        {hero && (
          <span className="chip">
            <Crown size={14} /> {hero.name}
          </span>
        )}
      </div>
      <div className="card">
        {board.map((row) => (
          <div key={row.person.id} className="row" style={{ marginBottom: 12 }}>
            <Avatar person={row.person} size={40} />
            <div style={{ flex: 1 }}>
              <div className="between" style={{ marginBottom: 4 }}>
                <strong style={{ fontSize: 14 }}>{row.person.name}</strong>
                <span className="muted" style={{ fontSize: 13 }}>
                  {Math.round(row.pct * 100)}% of their share
                </span>
              </div>
              <ProgressBar pct={row.pct} color={row.person.color} />
            </div>
          </div>
        ))}
        <p className="muted" style={{ fontSize: 12, margin: "6px 2px 0" }}>
          Everyone races their own goal — so everyone can win. 💛
        </p>
      </div>
    </div>
  );
}
