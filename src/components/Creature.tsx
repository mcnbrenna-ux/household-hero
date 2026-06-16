// ── Creature — the SVG blob avatar (DESIGN-NOTES "Avatar Creature Design") ────
// A chunky, slightly-irregular abstract blob with googly personality. Built
// entirely from SVG so it renders crisp at any size, from a 20px quest chip to
// a full-screen level-up dance. NOT an emoji, NOT a human, NEVER a perfect
// circle (a hard rule). Body shape + eyes come from the saved AvatarConfig;
// the face MOOD is driven by context (idle, doing a quest, levelling up…).
import type { AvatarConfig, BodyShape, EyeStyle, FaceMood } from "../types";

// ── color helpers ────────────────────────────────────────────────────────────
function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function shade(hex: string, amt: number): string {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const f = (c: number) =>
    clamp(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)
      .toString(16)
      .padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`;
}

// ── body silhouettes ─────────────────────────────────────────────────────────
// Fixed wobbly paths (never perfectly round) on a 100×100 canvas. The "spiky"
// body is generated so its bumps stay smooth at any size.
const BODY_PATHS: Record<Exclude<BodyShape, "spiky">, string> = {
  round:
    "M50 10 C73 9 88 27 87 50 C86 73 71 91 50 90 C29 91 13 72 14 49 C15 27 27 11 50 10 Z",
  tall:
    "M50 5 C68 5 79 22 79 44 C79 64 75 95 50 94 C25 95 21 64 21 44 C21 22 32 5 50 5 Z",
  square:
    "M31 15 H69 Q89 15 89 37 V65 Q89 89 65 89 H35 Q11 89 11 65 V37 Q11 15 31 15 Z",
  pudgy:
    "M50 20 C77 20 93 35 93 56 C93 77 74 89 50 89 C26 89 7 77 7 56 C7 35 23 20 50 20 Z",
};

function spikyPath(): string {
  const cx = 50;
  const cy = 51;
  const spikes = 11;
  const outer = 44;
  const inner = 35;
  const pts: [number, number][] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  // Smooth the star into soft bumps with quadratic midpoints.
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % pts.length];
    const mx = (cur[0] + next[0]) / 2;
    const my = (cur[1] + next[1]) / 2;
    d += ` Q${cur[0].toFixed(1)} ${cur[1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  return d + " Z";
}

// ── eyes ─────────────────────────────────────────────────────────────────────
// Each eye is drawn around a center point; pupils can "look" slightly down so
// the creature reads as friendly and present.
function Eye({ cx, cy, style }: { cx: number; cy: number; style: EyeStyle }) {
  const ink = "#1A1A1A";
  switch (style) {
    case "sleepy":
      return (
        <g>
          <path
            d={`M${cx - 7} ${cy} a7 7 0 0 1 14 0`}
            fill="#fff"
            stroke={ink}
            strokeWidth={2}
          />
          <path
            d={`M${cx - 7} ${cy} h14`}
            stroke={ink}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        </g>
      );
    case "sparkly":
      return (
        <g>
          <circle cx={cx} cy={cy} r={8} fill="#fff" stroke={ink} strokeWidth={2} />
          <path
            d={`M${cx} ${cy - 6} L${cx + 1.8} ${cy - 1.8} L${cx + 6} ${cy} L${cx + 1.8} ${cy + 1.8} L${cx} ${cy + 6} L${cx - 1.8} ${cy + 1.8} L${cx - 6} ${cy} L${cx - 1.8} ${cy - 1.8} Z`}
            fill={ink}
          />
        </g>
      );
    case "determined":
      return (
        <g>
          <circle cx={cx} cy={cy + 1} r={8} fill="#fff" stroke={ink} strokeWidth={2} />
          <circle cx={cx} cy={cy + 3} r={3.6} fill={ink} />
          <path
            d={`M${cx - 9} ${cy - 9} L${cx + 8} ${cy - 5}`}
            stroke={ink}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      );
    case "starry":
      return (
        <path
          d={`M${cx} ${cy - 9} L${cx + 2.6} ${cy - 2.6} L${cx + 9} ${cy - 2} L${cx + 4} ${cy + 2.4} L${cx + 5.6} ${cy + 9} L${cx} ${cy + 5} L${cx - 5.6} ${cy + 9} L${cx - 4} ${cy + 2.4} L${cx - 9} ${cy - 2} L${cx - 2.6} ${cy - 2.6} Z`}
          fill="#FFD93D"
          stroke={ink}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      );
    case "wide":
      return (
        <g>
          <circle cx={cx} cy={cy} r={11} fill="#fff" stroke={ink} strokeWidth={2} />
          <circle cx={cx} cy={cy + 2} r={3.8} fill={ink} />
        </g>
      );
    case "googly":
    default:
      return (
        <g>
          <circle cx={cx} cy={cy} r={9} fill="#fff" stroke={ink} strokeWidth={2} />
          <circle cx={cx} cy={cy + 3} r={4} fill={ink} />
        </g>
      );
  }
}

// Closed, content eyes — used for calm / sleepy / breathing moods.
function ClosedEye({ cx, cy }: { cx: number; cy: number }) {
  return (
    <path
      d={`M${cx - 7} ${cy} q7 7 14 0`}
      fill="none"
      stroke="#1A1A1A"
      strokeWidth={2.4}
      strokeLinecap="round"
    />
  );
}

// ── mouth (per mood) ─────────────────────────────────────────────────────────
function Mouth({ mood }: { mood: FaceMood }) {
  const ink = "#1A1A1A";
  switch (mood) {
    case "excited":
    case "star":
      return (
        <path
          d="M40 64 Q50 78 60 64 Q50 70 40 64 Z"
          fill="#E5557B"
          stroke={ink}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      );
    case "focused":
      return (
        <path d="M43 66 h14" stroke={ink} strokeWidth={2.6} strokeLinecap="round" />
      );
    case "sleepy":
      return (
        <path
          d="M45 65 q5 4 10 0"
          fill="none"
          stroke={ink}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      );
    case "calm":
      return (
        <path d="M45 65 h10" stroke={ink} strokeWidth={2.4} strokeLinecap="round" />
      );
    case "happy":
    default:
      return (
        <path
          d="M41 63 q9 11 18 0"
          fill="none"
          stroke={ink}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      );
  }
}

// ── accessories (simple flat SVG, overlaid on the creature) ──────────────────
function Accessory({ id }: { id: string }) {
  const ink = "#1A1A1A";
  switch (id) {
    case "beanie":
      return (
        <g>
          <path d="M26 26 Q50 2 74 26 Z" fill="#5BC4F5" stroke={ink} strokeWidth={2} strokeLinejoin="round" />
          <rect x="24" y="24" width="52" height="8" rx="4" fill="#3aa9dd" stroke={ink} strokeWidth={2} />
        </g>
      );
    case "party":
      return (
        <path d="M50 0 L62 28 H38 Z" fill="#F472B6" stroke={ink} strokeWidth={2} strokeLinejoin="round" />
      );
    case "chef":
      return (
        <g>
          <ellipse cx="50" cy="14" rx="20" ry="12" fill="#fff" stroke={ink} strokeWidth={2} />
          <rect x="32" y="20" width="36" height="12" rx="3" fill="#fff" stroke={ink} strokeWidth={2} />
        </g>
      );
    case "crown":
      return (
        <path d="M30 26 L34 10 L42 20 L50 6 L58 20 L66 10 L70 26 Z" fill="#FFAB2E" stroke={ink} strokeWidth={2} strokeLinejoin="round" />
      );
    case "astronaut":
      return (
        <g>
          <circle cx="50" cy="30" r="34" fill="none" stroke="#5BC4F5" strokeWidth={3} opacity={0.6} />
        </g>
      );
    case "rainbow_wings":
    case "wings":
      return (
        <g>
          <path d="M14 54 Q-2 40 6 66 Q-2 78 16 74 Z" fill="#FB923C" stroke={ink} strokeWidth={2} strokeLinejoin="round" />
          <path d="M86 54 Q102 40 94 66 Q102 78 84 74 Z" fill="#A78BFA" stroke={ink} strokeWidth={2} strokeLinejoin="round" />
        </g>
      );
    case "angel":
      return (
        <ellipse cx="50" cy="6" rx="14" ry="5" fill="none" stroke="#FFD93D" strokeWidth={3} />
      );
    case "backpack":
      return (
        <rect x="60" y="58" width="22" height="26" rx="6" fill="#3ECFAB" stroke={ink} strokeWidth={2} />
      );
    default:
      return null;
  }
}

// ── the creature ─────────────────────────────────────────────────────────────
export function Creature({
  avatar,
  size = 64,
  mood = "happy",
  idle = false,
  title,
}: {
  avatar: AvatarConfig;
  size?: number;
  mood?: FaceMood;
  idle?: boolean;
  title?: string;
}) {
  const color = avatar.color ?? "#aaaaaa";
  const bodyPath = avatar.bodyShape === "spiky" ? spikyPath() : (BODY_PATHS[avatar.bodyShape ?? "round"] ?? BODY_PATHS.round);
  const outline = shade(color, -0.32);
  const highlight = shade(color, 0.45);
  const eyesClosed = mood === "calm" || mood === "sleepy";
  // "star" mood always sparkles the eyes regardless of saved style.
  const eyeStyle: EyeStyle = mood === "star" ? "starry" : (avatar.eyes ?? "googly");

  // Effects that render BEHIND the body (glow ring).
  const behind = (avatar.equippedAccessories ?? []).includes("glow") ? (
    <circle cx="50" cy="52" r="46" fill={avatar.color} opacity={0.18} />
  ) : null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={title ?? "avatar"}
      className={idle ? "creature-idle" : undefined}
      style={{ display: "block", overflow: "visible" }}
    >
      {behind}
      {/* body */}
      <path
        d={bodyPath}
        fill={avatar.color}
        stroke={outline}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {/* soft clay highlight, top-left */}
      <ellipse cx="38" cy="34" rx="16" ry="11" fill={highlight} opacity={0.5} />

      {/* face */}
      {eyesClosed ? (
        <>
          <ClosedEye cx={38} cy={48} />
          <ClosedEye cx={62} cy={48} />
        </>
      ) : (
        <>
          <Eye cx={38} cy={48} style={eyeStyle} />
          <Eye cx={62} cy={48} style={eyeStyle} />
        </>
      )}
      {/* rosy cheeks for the brightest moods */}
      {(mood === "excited" || mood === "star" || mood === "happy") && (
        <>
          <circle cx="28" cy="60" r="5" fill="#FF9AA8" opacity={0.55} />
          <circle cx="72" cy="60" r="5" fill="#FF9AA8" opacity={0.55} />
        </>
      )}
      <Mouth mood={mood} />

      {/* accessories on top (worn order) */}
      {avatar.equippedAccessories
        .filter((id) => id !== "glow")
        .map((id) => (
          <Accessory key={id} id={id} />
        ))}
    </svg>
  );
}
