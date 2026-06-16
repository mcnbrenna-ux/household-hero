// ── A 4-digit PIN pad with big keys and glowing dots ──────────────────────────
// Self-managed buffer (functional updates) so rapid taps are never dropped.
// Parent notifications fire from an effect — never inside a state updater.
// Bump `resetKey` to clear the entry (e.g. after a mismatch).
import { useEffect, useRef, useState } from "react";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export function PinPad({
  onChange,
  onComplete,
  length = 4,
  resetKey = 0,
}: {
  onChange?: (v: string) => void;
  onComplete?: (v: string) => void;
  length?: number;
  resetKey?: number;
}) {
  const [value, setValue] = useState("");
  const prev = useRef("");

  // Clear whenever the parent asks (resetKey changes).
  useEffect(() => {
    setValue("");
  }, [resetKey]);

  // Notify the parent after commit — not during a render/updater.
  useEffect(() => {
    if (value === prev.current) return;
    prev.current = value;
    onChange?.(value);
    if (value.length === length) onComplete?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const press = (k: string) => {
    if (k === "⌫") {
      setValue((v) => v.slice(0, -1));
      return;
    }
    if (k === "") return;
    setValue((v) => (v.length >= length ? v : v + k));
  };

  return (
    <div>
      <div className="pin-dots">
        {Array.from({ length }, (_, i) => (
          <span key={i} className={`pin-dot${i < value.length ? " on" : ""}`} />
        ))}
      </div>
      <div className="pin-pad">
        {KEYS.map((k, i) => (
          <button
            key={i}
            type="button"
            className="pin-key"
            style={{ visibility: k === "" ? "hidden" : "visible" }}
            onClick={() => press(k)}
            aria-label={k === "⌫" ? "Delete" : k}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
