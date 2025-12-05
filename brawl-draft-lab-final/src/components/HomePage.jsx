import React from "react";

export function HomePage() {
  return (
    <main className="app-main">
      <section className="section-card">
        <div className="section-header">
          <div>
            <div className="section-title">Welcome to Brawl Draft Lab</div>
            <div className="section-subtitle">
              A fast, draft-focused helper built around Worlds-style data and live pick logic.
            </div>
          </div>
          <div className="badge-row">
            <span className="chip chip-blue">Optimized for live drafts</span>
            <span className="chip chip-muted">Masters ladder & competitive</span>
          </div>
        </div>
        <div className="stack">
          <p style={{ fontSize: 13, color: "#e5e7eb", margin: 0 }}>
            Use Brawl Draft Lab while queueing Power League, ranked, or scrims. Start a draft, lock in bans,
            and the simulator will suggest high-value picks for the current map, mode, and comp — including
            meta staples, safe picks, and strong situational options.
          </p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
            The tool is powered by data from recent high-level drafts (including Worlds finals) combined
            with lightweight role logic and anti-tank / control heuristics so that suggestions feel like a
            teammate who actually watches drafts, not just a static tier list.
          </p>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div className="section-title">How to use it mid-draft</div>
        </div>
        <div className="stack" style={{ fontSize: 13, color: "#d1d5db" }}>
          <ol style={{ paddingLeft: 18, margin: 0 }}>
            <li>Pick the correct <strong>map &amp; mode</strong> at the top of the Draft Simulator.</li>
            <li>Enter the <strong>six bans</strong> as they happen.</li>
            <li>Tell the tool if you are <strong>First Pick</strong> or <strong>Last Pick</strong>.</li>
            <li>After each pick, either click one of the suggested brawlers or type and select your choice.</li>
            <li>Confirm each pick so the simulator can adapt its next recommendations.</li>
          </ol>
          <p style={{ margin: "6px 0 0", color: "#9ca3af" }}>
            Keep explanations in <strong>short mode</strong> for speed, and toggle Advanced Reasoning only
            when you want deeper context on why a niche or off-meta option shows up as a recommendation.
          </p>
        </div>
      </section>
    </main>
  );
}
