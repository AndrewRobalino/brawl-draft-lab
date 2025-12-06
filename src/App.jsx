import React, { useState } from "react";
import { DraftSimulator } from "./components/DraftSimulator";
import { AboutPage } from "./components/AboutPage";

export default function App() {
  const [tab, setTab] = useState("draft");
  const [advanced, setAdvanced] = useState(false);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-header-left">
            <div className="app-logo">BRAWL DRAFT LAB</div>
            <div className="app-subline">
              Worlds-style draft helper • built by Carter B. &amp; Andrew R.
            </div>
          </div>

          <div className="app-header-right">
            <nav className="app-nav">
              <button
                className={
                  tab === "draft" ? "nav-chip nav-chip-active" : "nav-chip"
                }
                onClick={() => setTab("draft")}
              >
                Draft
              </button>
              <button
                className={
                  tab === "about" ? "nav-chip nav-chip-active" : "nav-chip"
                }
                onClick={() => setTab("about")}
              >
                About
              </button>
            </nav>

            <label className="advanced-toggle">
              <input
                type="checkbox"
                checked={advanced}
                onChange={(e) => setAdvanced(e.target.checked)}
              />
              <span>Advanced explanations</span>
            </label>
          </div>
        </div>
      </header>

      <main>
        {tab === "draft" ? (
          <DraftSimulator advanced={advanced} />
        ) : (
          <AboutPage />
        )}
      </main>
    </div>
  );
}
