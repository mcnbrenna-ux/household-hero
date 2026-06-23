// ── AvatarBuilder — body shape + color + eyes picker for the SVG blob creature
import type { AvatarConfig, BodyShape, EyeStyle } from "../types";
import { Creature } from "./Creature";

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

const BODY_SHAPES: { id: BodyShape; label: string }[] = [
  { id: "round", label: "Round" },
  { id: "tall", label: "Tall" },
  { id: "square", label: "Square" },
  { id: "spiky", label: "Spiky" },
  { id: "pudgy", label: "Pudgy" },
];

const EYE_STYLES: { id: EyeStyle; label: string }[] = [
  { id: "googly", label: "Googly" },
  { id: "sleepy", label: "Sleepy" },
  { id: "sparkly", label: "Sparkly" },
  { id: "determined", label: "Determined" },
  { id: "starry", label: "Starry" },
  { id: "wide", label: "Wide" },
];

export function AvatarBuilder({
  value,
  onChange,
}: {
  value: AvatarConfig;
  onChange: (next: AvatarConfig) => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
        <Creature avatar={value} size={96} idle />
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
                outline: c === value.color ? `3px solid ${c}` : "none",
                outlineOffset: 2,
                boxShadow: c === value.color ? `0 0 0 2px white` : "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <div className="field">
        <label>Shape</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 6,
          }}
        >
          {BODY_SHAPES.map((s) => (
            <button
              key={s.id}
              onClick={() => onChange({ ...value, bodyShape: s.id })}
              title={s.label}
              style={{
                display: "grid",
                placeItems: "center",
                gap: 4,
                padding: "8px 2px",
                borderRadius: 10,
                background:
                  s.id === value.bodyShape
                    ? `${value.color}28`
                    : "rgba(255,255,255,0.35)",
                border:
                  s.id === value.bodyShape
                    ? `2px solid ${value.color}`
                    : "2px solid transparent",
                cursor: "pointer",
              }}
            >
              <Creature avatar={{ ...value, bodyShape: s.id }} size={40} />
              <span style={{ fontSize: 11, fontWeight: 600 }}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Eyes</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 6,
          }}
        >
          {EYE_STYLES.map((e) => (
            <button
              key={e.id}
              onClick={() => onChange({ ...value, eyes: e.id })}
              title={e.label}
              style={{
                display: "grid",
                placeItems: "center",
                gap: 4,
                padding: "8px 2px",
                borderRadius: 10,
                background:
                  e.id === value.eyes
                    ? `${value.color}28`
                    : "rgba(255,255,255,0.35)",
                border:
                  e.id === value.eyes
                    ? `2px solid ${value.color}`
                    : "2px solid transparent",
                cursor: "pointer",
              }}
            >
              <Creature avatar={{ ...value, eyes: e.id }} size={40} />
              <span style={{ fontSize: 11, fontWeight: 600 }}>{e.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
