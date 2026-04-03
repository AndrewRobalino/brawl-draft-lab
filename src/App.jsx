import { useState } from "react";
import { DraftSimulator } from "./components/DraftSimulator";
import { AboutPage } from "./components/AboutPage";

export default function App() {
  const [tab, setTab] = useState("draft");

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-header-left">
            <div className="app-logo">Brawl Draft Lab</div>
            <div className="app-subline">
              BSC 2026 draft helper &bull; built by Carter B. &amp; Andrew R.
            </div>
          </div>

          <div className="app-header-right">
            <nav className="app-nav">
              <button
                className={tab === "draft" ? "nav-chip nav-chip-active" : "nav-chip"}
                onClick={() => setTab("draft")}
              >
                Draft
              </button>
              <button
                className={tab === "about" ? "nav-chip nav-chip-active" : "nav-chip"}
                onClick={() => setTab("about")}
              >
                About
              </button>
            </nav>

          </div>
        </div>
      </header>

      <main>
        {tab === "draft" ? (
          <DraftSimulator />
        ) : (
          <AboutPage />
        )}
      </main>
    </div>
  );
}
