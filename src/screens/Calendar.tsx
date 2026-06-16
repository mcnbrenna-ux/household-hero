// ── Calendar — shared family calendar (v3 §12) ───────────────────────────────
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X, UtensilsCrossed } from "lucide-react";
import { useStore } from "../store/AppStore";
import { Header } from "../components/Header";
import { Avatar } from "../components/ui";
import { scheduledCook } from "../engine/fairness";
import type { CalendarEvent } from "../types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function uid() {
  return `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function Calendar() {
  const { state, upsertCalendarEvent, deleteCalendarEvent } = useStore();
  const today = new Date();
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build day grid — null cells are padding before the 1st
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pre-compute cooking schedule for the month (one call per day)
  const cookMap = useMemo(() => {
    const map: Record<string, string | null> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = toISO(year, month, d);
      const cook = scheduledCook(state, iso);
      map[iso] = cook?.id ?? null;
    }
    return map;
  }, [state, year, month, daysInMonth]);

  const eventsForDate = (iso: string) =>
    state.calendarEvents.filter((e) => e.date === iso);

  const selEvents = eventsForDate(selectedDate);
  const selCookId = cookMap[selectedDate] ?? null;
  const selCook = selCookId ? state.people.find((p) => p.id === selCookId) : null;

  const selDateObj = new Date(selectedDate + "T00:00:00");
  const selLabel = selDateObj.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="app-shell">
      <Header title="Calendar" sub={state.familyName} />

      {/* Month navigator */}
      <div className="card" style={{ padding: "16px 12px 12px" }}>
        <div className="between" style={{ marginBottom: 14 }}>
          <button
            className="btn-ghost"
            style={{ padding: "6px 10px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.10)", color: "var(--text-body)" }}
            onClick={prevMonth}
          >
            <ChevronLeft size={18} />
          </button>
          <strong style={{ fontSize: 17, fontWeight: 700 }}>
            {MONTH_NAMES[month]} {year}
          </strong>
          <button
            className="btn-ghost"
            style={{ padding: "6px 10px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.10)", color: "var(--text-body)" }}
            onClick={nextMonth}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
          {DAY_LABELS.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", paddingBottom: 4 }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`pad-${i}`} />;
            const iso = toISO(year, month, day);
            const isToday = iso === todayISO;
            const isSelected = iso === selectedDate;
            const cookId = cookMap[iso];
            const cookPerson = cookId ? state.people.find((p) => p.id === cookId) : null;
            const dayEvents = eventsForDate(iso);

            return (
              <button
                key={iso}
                onClick={() => setSelectedDate(iso)}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "6px 2px 5px",
                  borderRadius: 10,
                  border: isSelected
                    ? "1.5px solid rgba(255,255,255,0.40)"
                    : isToday
                    ? "1.5px solid rgba(255,255,255,0.18)"
                    : "1.5px solid transparent",
                  background: isSelected
                    ? "rgba(255,255,255,0.14)"
                    : isToday
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                  cursor: "pointer",
                  minHeight: 52,
                  gap: 2,
                }}
              >
                <span style={{
                  fontSize: 13,
                  fontWeight: isToday ? 800 : 500,
                  color: isToday ? "#fff" : "var(--text-body)",
                  lineHeight: 1,
                }}>
                  {day}
                </span>

                {/* Cooking dot */}
                {cookPerson && (
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: cookPerson.color,
                    flexShrink: 0,
                  }} title={`${cookPerson.name} cooks`} />
                )}

                {/* Event dots — up to 2 */}
                {dayEvents.length > 0 && (
                  <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                    {dayEvents.slice(0, 2).map((e) => {
                      const ep = e.forPersonId ? state.people.find((p) => p.id === e.forPersonId) : null;
                      return (
                        <div key={e.id} style={{
                          width: 5, height: 5, borderRadius: "50%",
                          background: ep ? ep.color : "rgba(255,255,255,0.55)",
                          flexShrink: 0,
                        }} />
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <span style={{ fontSize: 9, color: "var(--text-muted)", lineHeight: 1 }}>+{dayEvents.length - 2}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="row" style={{ marginTop: 12, gap: 14, flexWrap: "wrap" }}>
          <div className="row" style={{ gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--coral)" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>cooking night</span>
          </div>
          <div className="row" style={{ gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.55)" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>family event</span>
          </div>
          {state.people.slice(0, 3).map((p) => (
            <div key={p.id} className="row" style={{ gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected day panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDate}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <div className="between" style={{ margin: "20px 0 10px" }}>
            <h2 className="section-head" style={{ margin: 0 }}>{selLabel}</h2>
            <button
              className="btn btn-accent"
              style={{ minHeight: 36, padding: "0 14px", fontSize: 13, gap: 6 }}
              onClick={() => {
                setEditing({ id: uid(), title: "", emoji: "📅", date: selectedDate, forPersonId: null });
                setAdding(true);
              }}
            >
              <Plus size={15} /> Add
            </button>
          </div>

          {/* Cooking assignment for the day */}
          {selCook && (
            <div className="card" style={{ marginBottom: 8 }}>
              <div className="row" style={{ gap: 10 }}>
                <Avatar person={selCook} size={38} />
                <div>
                  <div className="row" style={{ gap: 5, color: "var(--text-muted)", marginBottom: 2 }}>
                    <UtensilsCrossed size={13} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>Cooking tonight</span>
                  </div>
                  <strong style={{ fontSize: 15 }}>{selCook.name}'s kitchen night</strong>
                </div>
              </div>
            </div>
          )}

          {/* Events for the day */}
          {selEvents.length === 0 && !selCook && (
            <div className="card empty" style={{ textAlign: "center" }}>
              Nothing scheduled — tap Add to create an event.
            </div>
          )}
          {selEvents.length === 0 && selCook && (
            <div className="card empty" style={{ textAlign: "center", fontSize: 13 }}>
              No other events. Tap Add to add one.
            </div>
          )}

          {selEvents.map((evt, i) => {
            const evtPerson = evt.forPersonId
              ? state.people.find((p) => p.id === evt.forPersonId)
              : null;
            return (
              <motion.div
                key={evt.id}
                className="card"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.22, ease: "easeOut" }}
                style={{ marginBottom: 8 }}
              >
                <div className="between">
                  <div className="row" style={{ gap: 10 }}>
                    <span style={{ fontSize: 28, lineHeight: 1 }}>{evt.emoji}</span>
                    <div>
                      <strong style={{ fontSize: 15 }}>{evt.title}</strong>
                      <div className="row" style={{ gap: 8, marginTop: 2 }}>
                        {evt.time && (
                          <span className="muted" style={{ fontSize: 12 }}>{evt.time}</span>
                        )}
                        {evtPerson ? (
                          <span className="muted" style={{ fontSize: 12 }}>{evtPerson.name}</span>
                        ) : (
                          <span className="muted" style={{ fontSize: 12 }}>Whole family</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row" style={{ gap: 10 }}>
                    <button
                      className="linklike"
                      style={{ fontSize: 12 }}
                      onClick={() => { setEditing(evt); setAdding(true); }}
                    >
                      Edit
                    </button>
                    <button
                      className="linklike"
                      style={{ fontSize: 12, color: "var(--coral)" }}
                      onClick={() => deleteCalendarEvent(evt.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {evtPerson && (
                  <div style={{
                    marginTop: 8, height: 3, borderRadius: 3,
                    background: evtPerson.color, opacity: 0.7,
                  }} />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Add / edit event modal */}
      <AnimatePresence>
        {adding && editing && (
          <EventForm
            event={editing}
            people={state.people}
            onSave={(evt) => {
              upsertCalendarEvent(evt);
              setAdding(false);
              setEditing(null);
            }}
            onClose={() => { setAdding(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>

      {/* Upcoming events (next 14 days) */}
      <UpcomingEvents state={state} todayISO={todayISO} cookMap={cookMap} />
    </div>
  );
}

// ── Event form modal ──────────────────────────────────────────────────────────
function EventForm({
  event,
  people,
  onSave,
  onClose,
}: {
  event: CalendarEvent;
  people: { id: string; name: string; color: string }[];
  onSave: (e: CalendarEvent) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(event.title);
  const [emoji, setEmoji] = useState(event.emoji);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time ?? "");
  const [forPersonId, setForPersonId] = useState<string | null>(event.forPersonId);

  const QUICK_EMOJIS = ["📅","⭐","🎂","🏀","🎵","🏥","✈️","🎉","📚","🏆","🎭","🌿","🏋️","🎨","🐾","🎸"];

  return (
    <motion.div
      className="cel-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="cel-card"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 440, width: "calc(100% - 32px)" }}
      >
        <div className="between" style={{ marginBottom: 16 }}>
          <strong style={{ fontSize: 17 }}>{event.title ? "Edit Event" : "New Event"}</strong>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Quick emoji picker */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Emoji</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {QUICK_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                style={{
                  fontSize: 22, padding: "4px 6px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: emoji === e ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.08)",
                  outline: emoji === e ? "1.5px solid rgba(255,255,255,0.40)" : "none",
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Event name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Soccer practice"
            autoFocus
          />
        </div>

        <div className="grid-2">
          <div className="field">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>Time (optional)</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 3:30 PM"
            />
          </div>
        </div>

        <div className="field">
          <label>Who is this for?</label>
          <select
            value={forPersonId ?? ""}
            onChange={(e) => setForPersonId(e.target.value || null)}
          >
            <option value="">Whole family</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid-2" style={{ marginTop: 8 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-accent"
            disabled={!title.trim() || !date}
            onClick={() => {
              const timeDisplay = time
                ? new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
                : undefined;
              onSave({ ...event, title: title.trim(), emoji, date, time: timeDisplay, forPersonId });
            }}
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Upcoming events strip (next 14 days) ────────────────────────────────────
function UpcomingEvents({
  state,
  todayISO,
  cookMap,
}: {
  state: import("../types").AppState;
  todayISO: string;
  cookMap: Record<string, string | null>;
}) {
  const upcoming = useMemo(() => {
    const days: { iso: string; label: string; events: CalendarEvent[]; cookId: string | null }[] = [];
    const base = new Date(todayISO + "T00:00:00");
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = toISO(d.getFullYear(), d.getMonth(), d.getDate());
      const evts = state.calendarEvents.filter((e) => e.date === iso);
      const cookId = cookMap[iso] ?? null;
      if (evts.length > 0 || (i === 0 && cookId)) {
        days.push({
          iso,
          label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
          events: evts,
          cookId,
        });
      }
    }
    return days;
  }, [state.calendarEvents, todayISO, cookMap]);

  if (upcoming.length === 0) return null;

  return (
    <>
      <h2 className="section-head" style={{ margin: "24px 0 10px" }}>Coming Up</h2>
      {upcoming.map((day, i) => (
        <motion.div
          key={day.iso}
          className="card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.22, ease: "easeOut" }}
          style={{ marginBottom: 8 }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {day.label}
          </div>
          {day.events.map((evt) => {
            const evtPerson = evt.forPersonId
              ? state.people.find((p) => p.id === evt.forPersonId)
              : null;
            return (
              <div key={evt.id} className="row" style={{ gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{evt.emoji}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{evt.title}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {evt.time && <span>{evt.time} · </span>}
                    {evtPerson ? evtPerson.name : "Whole family"}
                  </div>
                </div>
                {evtPerson && (
                  <div style={{ width: 4, height: "100%", minHeight: 28, borderRadius: 2, background: evtPerson.color, marginLeft: "auto", flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </motion.div>
      ))}
    </>
  );
}
