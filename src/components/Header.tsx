// ── Top header: who's active, their level, profile, switch user, admin ────────
import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { useStore } from "../store/AppStore";
import { Avatar } from "./ui";
import { levelForPoints, levelTitle } from "../engine/game";

export function Header({ title, sub }: { title: string; sub?: string }) {
  const { currentUser, setCurrentUser } = useStore();
  const nav = useNavigate();
  if (!currentUser) return null;

  const iconBtn: React.CSSProperties = {
    minHeight: 44,
    width: 44,
    padding: 0,
    borderRadius: 100,
  };

  return (
    <div className="between" style={{ marginBottom: 16 }}>
      <div>
        <h1 className="screen-title">{title}</h1>
        {sub && <p className="screen-sub" style={{ margin: 0 }}>{sub}</p>}
      </div>
      <div className="row" style={{ gap: 8 }}>
        {currentUser.role === "parent" && (
          <button
            className="btn btn-ghost"
            style={iconBtn}
            onClick={() => nav("/settings")}
            aria-label="Guild settings"
          >
            <Settings size={20} />
          </button>
        )}
        <button
          className="btn btn-ghost"
          style={iconBtn}
          onClick={() => {
            setCurrentUser(null);
            nav("/who");
          }}
          aria-label="Switch user"
        >
          <LogOut size={20} />
        </button>
        {/* tap the creature to open your profile (the Me screen) */}
        <button
          className="row"
          style={{ background: "none", gap: 8, padding: 0 }}
          onClick={() => nav("/me")}
          aria-label="My profile"
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
              {currentUser.name}
            </div>
            <div className="muted" style={{ fontSize: 12 }}>
              {levelTitle(levelForPoints(currentUser.lifetimePoints))}
            </div>
          </div>
          <Avatar person={currentUser} size={46} idle />
        </button>
      </div>
    </div>
  );
}
