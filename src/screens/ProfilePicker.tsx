// ── "Who's here?" — the no-password character picker (v3 §3) ──────────────────
// Kids tap straight in. Parents must enter the 4-digit PIN.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Sparkles, KeyRound } from "lucide-react";
import { useStore } from "../store/AppStore";
import { Avatar } from "../components/ui";
import { PinPad } from "../components/PinPad";
import type { Person } from "../types";

export function ProfilePicker() {
  const { state, setCurrentUser, verifyPin, resetPinWithAnswer } = useStore();
  const nav = useNavigate();
  const [pinFor, setPinFor] = useState<Person | null>(null);
  const [pinReset, setPinReset] = useState(0);
  const [error, setError] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [answer, setAnswer] = useState("");
  const [newPin, setNewPin] = useState("");

  const enter = (p: Person) => {
    setCurrentUser(p.id);
    nav("/");
  };

  const tapCard = (p: Person) => {
    // Parents are gated by the PIN; adventurers walk right in.
    if (p.role === "parent" && state.parentPIN) {
      setPinFor(p);
      setError(false);
      setForgot(false);
      setAnswer("");
      setNewPin("");
    } else {
      enter(p);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding:
          "calc(var(--safe-top) + 32px) 18px calc(var(--safe-bottom) + 32px)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 className="screen-title" style={{ fontSize: 36 }}>
          {state.familyName || "FamilyQuest"}
        </h1>
        <p className="screen-sub" style={{ margin: 0 }}>
          Who's here? Tap your character.
        </p>
      </div>

      <div className="who-grid" style={{ width: "100%", maxWidth: 760 }}>
        {state.people.map((p, i) => (
          <motion.button
            key={p.id}
            className="who-card"
            style={
              p.role === "parent"
                ? { borderColor: "rgba(255,171,46,0.5)" }
                : undefined
            }
            initial={{ opacity: 0, y: 24, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.32, delay: i * 0.07, ease: "easeOut" }}
            whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.13)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => tapCard(p)}
          >
            <div
              style={{
                display: "grid",
                placeItems: "center",
                background: p.color + "1f",
                borderRadius: 20,
                padding: 12,
              }}
            >
              <Avatar person={p} size={84} idle />
            </div>
            <div className="who-name">{p.name}</div>
            <div className="who-role">
              {p.role === "parent" ? (
                <span className="row" style={{ justifyContent: "center", gap: 4 }}>
                  <Shield size={13} /> Parent
                </span>
              ) : (
                <span className="row" style={{ justifyContent: "center", gap: 4 }}>
                  <Sparkles size={13} /> Kid
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {state.people.length === 0 && (
        <div className="card empty" style={{ maxWidth: 760, width: "100%" }}>
          No characters yet. A Parent can add them in Settings.
        </div>
      )}

      {/* PIN entry overlay for Parents */}
      {pinFor && (
        <div className="cel-overlay" onClick={() => setPinFor(null)}>
          <div className="cel-card" onClick={(e) => e.stopPropagation()}>
            {!forgot ? (
              <>
                <div style={{ display: "grid", placeItems: "center" }}>
                  <Avatar person={pinFor} size={72} />
                </div>
                <h2 className="section-head" style={{ marginTop: 12 }}>
                  {pinFor.name}'s PIN
                </h2>
                <p className="muted" style={{ marginTop: 0 }}>
                  Enter the Parent PIN
                </p>
                <PinPad
                  resetKey={pinReset}
                  onChange={() => setError(false)}
                  onComplete={(v) => {
                    if (verifyPin(v)) {
                      enter(pinFor);
                    } else {
                      setError(true);
                      setPinReset((n) => n + 1);
                    }
                  }}
                />
                {error && (
                  <p style={{ color: "var(--coral)", fontWeight: 700 }}>
                    That PIN didn't match — try again.
                  </p>
                )}
                <div
                  className="row"
                  style={{ justifyContent: "center", gap: 18, marginTop: 8 }}
                >
                  <button className="linklike" onClick={() => setPinFor(null)}>
                    Cancel
                  </button>
                  <button className="linklike" onClick={() => setForgot(true)}>
                    Forgot PIN?
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "grid", placeItems: "center" }}>
                  <KeyRound size={40} color="var(--amber)" />
                </div>
                <h2 className="section-head" style={{ marginTop: 8 }}>
                  Reset the PIN
                </h2>
                <p className="muted" style={{ marginTop: 0 }}>
                  {state.securityQuestion || "Answer your security question."}
                </p>
                <div className="field">
                  <label>Answer</label>
                  <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>New 4-digit PIN</label>
                  <input
                    inputMode="numeric"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) =>
                      setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                  />
                </div>
                <button
                  className="btn btn-block"
                  disabled={newPin.length !== 4 || !answer.trim()}
                  onClick={() => {
                    if (resetPinWithAnswer(answer, newPin)) {
                      enter(pinFor);
                    } else {
                      alert("That answer didn't match the security question.");
                    }
                  }}
                >
                  Reset & enter
                </button>
                <button
                  className="linklike"
                  style={{ marginTop: 12 }}
                  onClick={() => setForgot(false)}
                >
                  ← Back to PIN
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
