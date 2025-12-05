import React, { useState } from "react";
import { DraftSimulator } from "./components/DraftSimulator";
import { AboutPage } from "./components/AboutPage";
import { HomePage } from "./components/HomePage";

export default function App() {
  const [page, setPage] = useState("draft");
  const [advanced, setAdvanced] = useState(false);

  return (
    <div className="app-shell">
      <div className="app-card">
        <header className="app-nav">
          <div className="nav-left">
            <div className="brand-chip">Brawl Stars • Draft</div>
            <div className="brand-title">
              <span>Brawl Draft</span>
              <span className="accent">Lab</span>
            </div>
          </div>
          <div className="nav-links">
            <button
              className={
                "nav-button" + (page === "home" ? " active" : "")
              }
              onClick={() => setPage("home")}
            >
              Home
            </button>
            <button
              className={
                "nav-button" + (page === "draft" ? " active" : "")
              }
              onClick={() => setPage("draft")}
            >
              Draft Simulator
            </button>
            <button
              className={
                "nav-button" + (page === "about" ? " active" : "")
              }
              onClick={() => setPage("about")}
            >
              About
            </button>
          </div>
          <div className="adv-toggle-wrapper">
            <span className="toggle-label">Advanced reasoning</span>
            <div
              className={"switch" + (advanced ? " on" : "")}
              onClick={() => setAdvanced(!advanced)}
            >
              <div className="switch-knob" />
            </div>
            <div className="toggle-info">
              i
              <div className="toggle-tooltip">
                Toggle to switch between quick, short pick blurbs or longer explanations
                that look deeper at roles, enemy comp, and map tendencies.
              </div>
            </div>
          </div>
        </header>

        {page === "home" && <HomePage />}
        {page === "draft" && <DraftSimulator advanced={advanced} />}
        {page === "about" && <AboutPage />}
      </div>
    </div>
  );
}
