// ── First-time setup wizard (v3 §3) ──────────────────────────────────────────
// Runs on first launch when no family exists. Names the family, sets the Guild
// Master PIN + a security question, then either seeds the example family or
// creates a first Parent (building their blob creature). No accounts, no
// email — all on-device.
import { useState } from "react";
import { Sparkles, Shield, KeyRound, Users, UserPlus } from "lucide-react";
import { useStore } from "../store/AppStore";
import { PinPad } from "../components/PinPad";
import { AvatarBuilder, CREATURE_COLORS } from "../components/AvatarBuilder";
import { defaultAvatar } from "../types";
import type { AvatarConfig, Person } from "../types";

type Step =
  | "welcome"
  | "name"
  | "pin"
  | "confirm"
  | "security"
  | "family"
  | "master";

export function SetupWizard() {
  const { completeSetup } = useStore();
  const [step, setStep] = useState<Step>("welcome");
  const [familyName, setFamilyName] = useState("");
  const [pin, setPin] = useState("");
  const [secQ, setSecQ] = useState("What was the name of your first pet?");
  const [secA, setSecA] = useState("");
  const [mismatch, setMismatch] = useState(false);
  const [confirmReset, setConfirmReset] = useState(0);

  // First Parent (only when not seeding the example family).
  const [masterName, setMasterName] = useState("");
  const [masterAvatar, setMasterAvatar] = useState<AvatarConfig>(
    defaultAvatar(CREATURE_COLORS[0]),
  );

  function finish(seedExample: boolean) {
    const firstMaster: Person | undefined = seedExample
      ? undefined
      : {
          id: `person-${Date.now()}`,
          name: masterName.trim() || "Parent",
          avatar: masterAvatar,
          color: masterAvatar.color,
          role: "parent",
          ability: "full",
          capacity: "heavy",
          needsBuddyForCooking: false,
          inDinnerRotation: true,
          tracksSpoons: true,
          maxSpoons: 10,
          lifetimePoints: 0,
          spendablePoints: 0,
          skills: {},
          badges: [],
        };
    completeSetup({
      familyName,
      pin,
      securityQuestion: secQ,
      securityAnswer: secA,
      seedExample,
      firstMaster,
    });
  }

  return (
    <div className="app-shell">
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h1 className="screen-title" style={{ fontSize: 36 }}>
          FamilyQuest
        </h1>
        <p className="screen-sub">The family game</p>
      </div>

      {step === "welcome" && (
        <div className="card">
          <h2 className="section-head" style={{ marginTop: 0 }}>
            Welcome!
          </h2>
          <p className="muted">
            Let's set up your family. It takes about a minute — choose a family name,
            set a Parent PIN, and add your kids.
          </p>
          <button
            className="btn btn-lg btn-block"
            style={{ marginTop: 12 }}
            onClick={() => setStep("name")}
          >
            <Sparkles size={20} /> Let's go
          </button>
        </div>
      )}

      {step === "name" && (
        <div className="card">
          <h2 className="section-head" style={{ marginTop: 0 }}>
            Name your family
          </h2>
          <div className="field">
            <label>Family name</label>
            <input
              autoFocus
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="e.g. The Johnson Family HQ"
            />
          </div>
          <button
            className="btn btn-block"
            disabled={!familyName.trim()}
            onClick={() => setStep("pin")}
          >
            Next →
          </button>
        </div>
      )}

      {step === "pin" && (
        <div className="card">
          <h2 className="section-head row" style={{ marginTop: 0, gap: 6 }}>
            <Shield size={20} /> Set the Parent PIN
          </h2>
          <p className="muted" style={{ marginTop: 0 }}>
            A 4-digit code that protects grown-up settings.
          </p>
          <PinPad
            onComplete={(v) => {
              setPin(v);
              setStep("confirm");
            }}
          />
        </div>
      )}

      {step === "confirm" && (
        <div className="card">
          <h2 className="section-head" style={{ marginTop: 0 }}>
            Confirm your PIN
          </h2>
          <PinPad
            resetKey={confirmReset}
            onChange={() => setMismatch(false)}
            onComplete={(v) => {
              if (v === pin) {
                setStep("security");
              } else {
                setMismatch(true);
                setConfirmReset((n) => n + 1);
              }
            }}
          />
          {mismatch && (
            <p
              style={{
                color: "var(--coral)",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Those PINs didn't match — try again.
            </p>
          )}
          <button
            className="btn btn-ghost btn-block"
            style={{ marginTop: 16 }}
            onClick={() => {
              setPin("");
              setMismatch(false);
              setStep("pin");
            }}
          >
            Start the PIN over
          </button>
        </div>
      )}

      {step === "security" && (
        <div className="card">
          <h2 className="section-head row" style={{ marginTop: 0, gap: 6 }}>
            <KeyRound size={20} /> One safety net
          </h2>
          <p className="muted" style={{ marginTop: 0 }}>
            If a Parent forgets the PIN, this answer unlocks a reset.
          </p>
          <div className="field">
            <label>Security question</label>
            <select value={secQ} onChange={(e) => setSecQ(e.target.value)}>
              <option>What was the name of your first pet?</option>
              <option>What street did you grow up on?</option>
              <option>What is your favorite food?</option>
              <option>What town were you born in?</option>
            </select>
          </div>
          <div className="field">
            <label>Answer</label>
            <input
              value={secA}
              onChange={(e) => setSecA(e.target.value)}
              placeholder="Your answer"
            />
          </div>
          <button
            className="btn btn-block"
            disabled={!secA.trim()}
            onClick={() => setStep("family")}
          >
            Next →
          </button>
        </div>
      )}

      {step === "family" && (
        <div className="card">
          <h2 className="section-head" style={{ marginTop: 0 }}>
            Gather your party
          </h2>
          <p className="muted" style={{ marginTop: 0 }}>
            Start with the example family to explore right away, or create your
            own Parent and add the rest in Settings.
          </p>
          <button
            className="btn btn-lg btn-block"
            style={{ marginBottom: 12 }}
            onClick={() => finish(true)}
          >
            <Users size={20} /> Use the example family
          </button>
          <button
            className="btn btn-ghost btn-block"
            onClick={() => setStep("master")}
          >
            <UserPlus size={20} /> Create my own Parent
          </button>
        </div>
      )}

      {step === "master" && (
        <div className="card">
          <h2 className="section-head" style={{ marginTop: 0 }}>
            You — the first Parent
          </h2>
          <div className="field">
            <label>Your name</label>
            <input
              autoFocus
              value={masterName}
              onChange={(e) => setMasterName(e.target.value)}
              placeholder="e.g. Dad"
            />
          </div>
          <div className="field">
            <label>Build your character</label>
            <AvatarBuilder value={masterAvatar} onChange={setMasterAvatar} />
          </div>
          <button
            className="btn btn-block"
            disabled={!masterName.trim()}
            onClick={() => finish(false)}
          >
            Enter FamilyQuest →
          </button>
        </div>
      )}
    </div>
  );
}
