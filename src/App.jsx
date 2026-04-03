import { useState } from "react";
import { DraftSimulator } from "./components/DraftSimulator";
import { AboutPage } from "./components/AboutPage";

export default function App() {
  const [tab, setTab] = useState("draft");

  // Starr Drop background stars — generated once, fixed positions
  const starrDrops = [
    { x: 5, y: 6, size: 14, o: 0.18, dur: 4 },
    { x: 88, y: 3, size: 10, o: 0.12, dur: 5 },
    { x: 22, y: 18, size: 8, o: 0.1, dur: 6 },
    { x: 72, y: 12, size: 16, o: 0.2, dur: 4.5 },
    { x: 40, y: 28, size: 6, o: 0.08, dur: 7 },
    { x: 95, y: 25, size: 12, o: 0.15, dur: 5.5 },
    { x: 10, y: 40, size: 10, o: 0.12, dur: 6.5 },
    { x: 55, y: 35, size: 7, o: 0.09, dur: 5 },
    { x: 82, y: 45, size: 18, o: 0.22, dur: 4 },
    { x: 30, y: 52, size: 9, o: 0.11, dur: 6 },
    { x: 65, y: 58, size: 12, o: 0.14, dur: 5.2 },
    { x: 3, y: 65, size: 8, o: 0.1, dur: 7 },
    { x: 48, y: 70, size: 15, o: 0.17, dur: 4.8 },
    { x: 90, y: 68, size: 6, o: 0.08, dur: 6.2 },
    { x: 18, y: 78, size: 11, o: 0.13, dur: 5.5 },
    { x: 75, y: 82, size: 9, o: 0.1, dur: 6.8 },
    { x: 35, y: 90, size: 14, o: 0.16, dur: 4.3 },
    { x: 60, y: 92, size: 7, o: 0.09, dur: 5.7 },
    { x: 92, y: 88, size: 10, o: 0.12, dur: 6.5 },
    { x: 8, y: 95, size: 8, o: 0.1, dur: 5 },
    // extra stars
    { x: 50, y: 5, size: 11, o: 0.14, dur: 5.3 },
    { x: 15, y: 30, size: 13, o: 0.16, dur: 4.7 },
    { x: 68, y: 25, size: 7, o: 0.09, dur: 6.3 },
    { x: 42, y: 48, size: 10, o: 0.13, dur: 5.8 },
    { x: 85, y: 55, size: 15, o: 0.18, dur: 4.2 },
    { x: 25, y: 62, size: 9, o: 0.11, dur: 6.7 },
    { x: 78, y: 75, size: 12, o: 0.15, dur: 5.1 },
    { x: 50, y: 85, size: 8, o: 0.1, dur: 6.4 },
    { x: 97, y: 42, size: 6, o: 0.08, dur: 7.2 },
    { x: 38, y: 15, size: 11, o: 0.12, dur: 5.6 },
  ];

  return (
    <div className="app-shell">
      <div className="starr-bg" aria-hidden="true">
        {starrDrops.map((s, i) => (
          <div
            key={i}
            className="s"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--o": s.o,
              opacity: s.o,
              animation: `${i % 2 === 0 ? "twinkle" : "twinkle-slow"} ${s.dur}s ease-in-out infinite`,
              animationDelay: `${(i * 0.7) % 3}s`,
            }}
          />
        ))}
      </div>
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
