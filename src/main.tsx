import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AppProvider } from "./store/AppStore.tsx";

// Strip the trailing slash from Vite's BASE_URL ("/" in dev, "/household-hero/"
// on GitHub Pages) — react-router's basename expects no trailing slash.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
