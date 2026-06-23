// ── Small shared UI pieces ────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import type { FaceMood, Person } from "../types";
import { Creature } from "./Creature";

export function Avatar({
  person,
  size = 44,
  mood = "happy",
  idle = false,
}: {
  person: Person;
  size?: number;
  mood?: FaceMood;
  idle?: boolean;
}) {
  return (
    <Creature
      avatar={person.avatar}
      size={size}
      mood={mood}
      idle={idle}
      title={person.name}
    />
  );
}

// A single custom SVG spoon (DESIGN-NOTES: no emoji as UI icons).
export function SpoonIcon({ size = 24, filled = false }: { size?: number; filled?: boolean }) {
  const color = filled ? "var(--sky)" : "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="6" rx="4.5" ry="5.5" fill={color} stroke={color} strokeWidth="1.4" />
      <path d="M12 11.5 L12 21" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function ProgressBar({
  pct,
  color = "var(--brand)",
}: {
  pct: number;
  color?: string;
}) {
  return (
    <div className="bar">
      <span
        style={{
          width: `${Math.min(100, Math.max(0, pct * 100))}%`,
          background: color,
        }}
      />
    </div>
  );
}

// A tappable row of spoon icons — one tap sets the count. Low-friction by design.
export function SpoonRow({
  max,
  value,
  onChange,
  readOnly = false,
}: {
  max: number;
  value: number | null;
  onChange?: (n: number) => void;
  readOnly?: boolean;
}) {
  const filled = value ?? 0;
  return (
    <div className="spoon-row" role="group" aria-label="Energy spoons">
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const on = n <= filled;
        return (
          <button
            key={n}
            type="button"
            className={`spoon${on ? " full" : ""}`}
            disabled={readOnly}
            aria-label={`${n} spoon${n > 1 ? "s" : ""}`}
            onClick={() => onChange?.(n)}
          >
            <SpoonIcon size={26} filled={on} />
          </button>
        );
      })}
    </div>
  );
}

// ── Celebration overlay (confetti + popup) ────────────────────────────────────
import { useStore, type Celebration } from "../store/AppStore";
import { badgeDef, levelTitle } from "../engine/game";

const CONFETTI_COLORS = [
  "#FF6B6B", // coral
  "#FFAB2E", // amber
  "#5BC4F5", // sky
  "#3ECFAB", // mint
  "#F472B6", // pink
];

function Confetti() {
  const pieces = Array.from({ length: 36 }, (_, i) => i);
  return (
    <>
      {pieces.map((i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: `${(i / 36) * 100}%`,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDuration: `${1.6 + (i % 5) * 0.25}s`,
            animationDelay: `${(i % 7) * 0.06}s`,
          }}
        />
      ))}
    </>
  );
}

function celebrationContent(c: Celebration): {
  emoji: string;
  title: string;
  sub: string;
  confetti: boolean;
} {
  switch (c.kind) {
    case "points":
      return {
        emoji: "🎉",
        title: `+${c.points} XP!`,
        sub: c.title,
        confetti: true,
      };
    case "levelup":
      return {
        emoji: "⚡",
        title: "YOU LEVELED UP!",
        sub: `${c.person.name} is now a ${levelTitle(c.level)}!`,
        confetti: true,
      };
    case "badge": {
      const b = badgeDef(c.badgeId);
      return {
        emoji: b?.emoji ?? "🏅",
        title: b?.name ?? "New badge!",
        sub: `${c.person.name} earned a badge`,
        confetti: true,
      };
    }
    case "care":
      // Gentle on purpose — kindness first, XP is a quiet side effect.
      return {
        emoji: "💛",
        title: "That was so kind",
        sub: "+ a little XP",
        confetti: false,
      };
  }
}

export function CelebrationOverlay() {
  const { celebration, clearCelebration } = useStore();
  const [content, setContent] = useState<ReturnType<
    typeof celebrationContent
  > | null>(null);

  useEffect(() => {
    if (!celebration) {
      setContent(null);
      return;
    }
    setContent(celebrationContent(celebration));
    const ms = celebration.kind === "care" ? 1900 : 1700;
    const t = setTimeout(clearCelebration, ms);
    return () => clearTimeout(t);
  }, [celebration, clearCelebration]);

  if (!celebration || !content) return null;
  // Level-up & care moments star the person's own creature (it "dances" via the
  // idle bob); a level-up gets the iridescent treatment (DESIGN-NOTES).
  const showCreature =
    celebration.kind === "levelup" || celebration.kind === "care";
  const cardClass = [
    "cel-card",
    celebration.kind === "care" ? "care" : "",
    celebration.kind === "levelup" ? "iridescent" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="cel-overlay" onClick={clearCelebration}>
      {content.confetti && <Confetti />}
      <div className={cardClass}>
        {showCreature ? (
          <div style={{ display: "grid", placeItems: "center", marginBottom: 4 }}>
            <Avatar
              person={celebration.person}
              size={104}
              idle
              mood={celebration.kind === "levelup" ? "star" : "calm"}
            />
          </div>
        ) : (
          <div className="cel-emoji">{content.emoji}</div>
        )}
        <div className="cel-title">{content.title}</div>
        <div className="muted">{content.sub}</div>
      </div>
    </div>
  );
}
