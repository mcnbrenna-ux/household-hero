// ── Me — set today's spoons, see my level, skills, badges; peek family energy ─
import { useStore } from "../store/AppStore";
import { Header } from "../components/Header";
import { Avatar, ProgressBar, SpoonRow } from "../components/ui";
import {
  levelProgress,
  SKILLS,
  skillLevel,
  skillProgressPct,
  BADGES,
  currentStreak,
  levelTitle,
} from "../engine/game";
import { spoonsToday, lowThreshold } from "../engine/spoons";

export function Me() {
  const { state, currentUser, setSpoons } = useStore();
  if (!currentUser) return null;

  const lp = levelProgress(currentUser.lifetimePoints);
  const mySpoons = spoonsToday(state, currentUser.id);
  const streak = currentStreak(currentUser.id, state);
  const mySkills = SKILLS.filter((s) => (currentUser.skills[s.id] ?? 0) > 0);

  return (
    <div className="app-shell">
      <Header title="My Profile" />

      {/* Identity + level */}
      <div className="card">
        <div className="row" style={{ marginBottom: 14 }}>
          <Avatar person={currentUser} size={64} />
          <div>
            <h2 style={{ fontSize: 22 }}>{currentUser.name}</h2>
            <div className="muted">
              Lv {lp.level} · {levelTitle(lp.level)}
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              <span className="num">{currentUser.lifetimePoints}</span> lifetime XP
            </div>
            {streak > 0 && (
              <div className="chip" style={{ marginTop: 6 }}>
                🔥 {streak}-day streak
              </div>
            )}
          </div>
        </div>
        <ProgressBar pct={lp.pct} color={currentUser.color} />
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
          <span className="num">{lp.into}</span>/
          <span className="num">{lp.span}</span> XP to{" "}
          {levelTitle(lp.level + 1)}
        </div>
      </div>

      {/* Spoons — today's energy */}
      {currentUser.tracksSpoons && (
        <div className="card">
          <h2 className="section-head" style={{ marginTop: 0 }}>
            How are your spoons today? 🥄
          </h2>
          <p className="muted" style={{ margin: "0 0 12px", fontSize: 14 }}>
            Tap to set your energy. Your family can see it — that's the point,
            so they can help. No pressure, ever.
          </p>
          <SpoonRow
            max={currentUser.maxSpoons}
            value={mySpoons}
            onChange={(n) => setSpoons(currentUser.id, n)}
          />
          {mySpoons !== null && mySpoons <= lowThreshold(currentUser) && (
            <p style={{ color: "var(--brand-2)", fontWeight: 800, marginTop: 12 }}>
              Low-spoon day — let your family take care of you today. 💛
            </p>
          )}
        </div>
      )}

      {/* Skills */}
      <h2 className="section-head">My skills</h2>
      <div className="card">
        {mySkills.length === 0 ? (
          <div className="empty">
            Complete quests of the same kind to grow skills like 🍳 Master Chef!
          </div>
        ) : (
          mySkills.map((s) => {
            const xp = currentUser.skills[s.id] ?? 0;
            return (
              <div key={s.id} style={{ marginBottom: 14 }}>
                <div className="between" style={{ marginBottom: 4 }}>
                  <strong>
                    {s.emoji} {s.name}
                  </strong>
                  <span className="muted">Lv {skillLevel(xp)}</span>
                </div>
                <ProgressBar pct={skillProgressPct(xp)} color="var(--accent)" />
              </div>
            );
          })
        )}
      </div>

      {/* Badges */}
      <h2 className="section-head">Badges 🏅</h2>
      <div className="card">
        <div className="who-grid">
          {BADGES.map((b) => {
            const earned = currentUser.badges.includes(b.id);
            return (
              <div
                key={b.id}
                style={{
                  textAlign: "center",
                  opacity: earned ? 1 : 0.4,
                  filter: earned ? "none" : "grayscale(1)",
                }}
              >
                <div style={{ fontSize: 40 }}>{b.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{b.name}</div>
                <div className="muted" style={{ fontSize: 11 }}>
                  {earned ? "Earned!" : b.hint}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Family energy — everyone's spoons are visible */}
      <h2 className="section-head">Family energy today 🥄</h2>
      <div className="card">
        {state.people
          .filter((p) => p.tracksSpoons)
          .map((p) => {
            const c = spoonsToday(state, p.id);
            return (
              <div className="row" key={p.id} style={{ marginBottom: 10 }}>
                <Avatar person={p} size={36} />
                <strong style={{ width: 70 }}>{p.name}</strong>
                {c === null ? (
                  <span className="muted">Not set yet</span>
                ) : (
                  <span style={{ fontSize: 18 }}>
                    {"🥄".repeat(Math.min(c, 10))}
                    <span className="muted" style={{ fontSize: 13, marginLeft: 6 }}>
                      {c}
                    </span>
                  </span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
