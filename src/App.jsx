import React, { useState } from "react";
import { DraftSimulator } from "./components/DraftSimulator.jsx";
import { AboutPage } from "./components/AboutPage.jsx";

export default function App() {
  const [page, setPage] = useState("draft");
  const [advanced, setAdvanced] = useState(false);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo-text">
          <div className="logo-title">
            BRAWL DRAFT <span>LAB</span>
          </div>
          <div className="logo-sub">
            Worlds-style draft helper • built by Carter B. &amp; Andrew R.
          </div>
        </div>
        <nav className="nav-tabs">
          <button
            className={"nav-tab" + (page === "draft" ? " active" : "")}
            onClick={() => setPage("draft")}
          >
            <span className="nav-pill-dot" />
            <span>Draft</span>
          </button>
          <button
            className={"nav-tab" + (page === "about" ? " active" : "")}
            onClick={() => setPage("about")}
          >
            <span>About</span>
          </button>
        </nav>
        <div className="toggles-row">
          <label className="toggle">
            <input
              type="checkbox"
              checked={advanced}
              onChange={(e) => setAdvanced(e.target.checked)}
            />
            <span>Advanced explanations</span>
          </label>
        </div>
      </header>
      <main className="app-main">
        {page === "draft" && <DraftSimulator advanced={advanced} />}
        {page === "about" && <AboutPage />}
      </main>
    </div>
  );
}
