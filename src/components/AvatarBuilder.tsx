// ── AvatarBuilder — emoji + color avatar picker ───────────────────────────────
import type { AvatarConfig } from "../types";

export const CREATURE_COLORS = [
  "#FF6B6B",
  "#FFAB2E",
  "#FFD93D",
  "#3ECFAB",
  "#5BC4F5",
  "#A78BFA",
  "#F472B6",
  "#FB923C",
];

const AVATAR_EMOJIS = [
  "😊", "😎", "🥰", "🤩", "😄", "😸",
  "🦊", "🐱", "🐶", "🐼", "🐸", "🦁",
  "🐨", "🐥", "🦋", "🦄", "🐬", "🐧",
  "⭐", "🌈", "🌸", "🌙", "☀️", "🌻",
  "🎮", "🎵", "🎨", "🍕", "🏆", "🎀",
];

export function AvatarBuilder({
  value,
  onChange,
}: {
  value: AvatarConfig;
  onChange: (next: AvatarConfig) => void;
}) {
  const emoji = value.emoji ?? "😊";
  const color = value.color;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: color,
            display: "grid",
            placeItems: "center",
            fontSize: 46,
            boxShadow: `0 6px 24px ${color}66`,
            lineHeight: 1,
          }}
        >
          {emoji}
        </div>
      </div>

      <div className="field">
        <label>Color</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CREATURE_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ ...value, color: c })}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: c,
                border: "none",
                outline: c === color ? `3px solid ${c}` : "none",
                outlineOffset: 2,
                boxShadow: c === color ? `0 0 0 2px white` : "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <div className="field">
        <label>Avatar</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 6,
          }}
        >
          {AVATAR_EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => onChange({ ...value, emoji: e })}
              style={{
                fontSize: 26,
                height: 44,
                borderRadius: 10,
                background:
                  e === emoji ? `${color}28` : "rgba(255,255,255,0.35)",
                border:
                  e === emoji
                    ? `2px solid ${color}`
                    : "2px solid transparent",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                transition: "transform 0.1s",
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
