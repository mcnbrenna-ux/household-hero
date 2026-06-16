// ── Bottom tab bar (v3 §14 — Lucide icons, no emoji; big touch targets) ───────
import { NavLink } from "react-router-dom";
import {
  Home as HomeIcon,
  Swords,
  UtensilsCrossed,
  CalendarDays,
  Trophy,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useStore } from "../store/AppStore";

interface Tab {
  to: string;
  Icon: LucideIcon;
  label: string;
  end?: boolean;
  master?: boolean;
}

const TABS: Tab[] = [
  { to: "/", Icon: HomeIcon, label: "Home", end: true },
  { to: "/quests", Icon: Swords, label: "Quests" },
  { to: "/kitchen", Icon: UtensilsCrossed, label: "Kitchen" },
  { to: "/calendar", Icon: CalendarDays, label: "Calendar" },
  { to: "/guild", Icon: Trophy, label: "Family" },
  // Settings is Guild-Master only.
  { to: "/settings", Icon: Settings, label: "Settings", master: true },
];

export function Nav() {
  const { currentUser } = useStore();
  const isMaster = currentUser?.role === "parent";

  return (
    <nav className="nav">
      {TABS.filter((t) => !t.master || isMaster).map(({ to, Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <span className="nav-ico">
            <Icon size={23} strokeWidth={2.2} />
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
