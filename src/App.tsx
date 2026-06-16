// ── App shell: setup gate, the "who's here?" guard, nav, celebrations ─────────
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./store/AppStore";
import { Nav } from "./components/Nav";
import { CelebrationOverlay } from "./components/ui";
import { SetupWizard } from "./screens/SetupWizard";
import { ProfilePicker } from "./screens/ProfilePicker";
import { Home } from "./screens/Home";
import { Tasks } from "./screens/Tasks";
import { Dinner } from "./screens/Dinner";
import { Guild } from "./screens/Guild";
import { Me } from "./screens/Me";
import { Admin } from "./screens/Admin";
import { Calendar } from "./screens/Calendar";

const pageVariants = {
  initial: { opacity: 0, y: 18, scale: 0.99 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.24, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0, y: -10, scale: 0.99,
    transition: { duration: 0.14, ease: "easeIn" as const },
  },
};

export default function App() {
  const { state, currentUser } = useStore();
  const loc = useLocation();

  if (!state.setupComplete) {
    return (
      <>
        <SetupWizard />
        <CelebrationOverlay />
      </>
    );
  }

  if (!currentUser && loc.pathname !== "/who") {
    return <Navigate to="/who" replace />;
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={loc.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ minHeight: "100%" }}
        >
          <Routes location={loc}>
            <Route path="/who" element={<ProfilePicker />} />
            <Route path="/" element={<Home />} />
            <Route path="/quests" element={<Tasks />} />
            <Route path="/kitchen" element={<Dinner />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/guild" element={<Guild />} />
            <Route path="/me" element={<Me />} />
            <Route path="/settings" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      {currentUser && loc.pathname !== "/who" && <Nav />}
      <CelebrationOverlay />
    </>
  );
}
