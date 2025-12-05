import React, { useMemo, useState } from "react";
import { MAPS } from "../data/maps";
import { BRAWLERS } from "../data/brawlers";
import { getRecommendation } from "../data/recommendationEngine";

const mapsByMode = MAPS.reduce((acc, m) => {
  acc[m.mode] = acc[m.mode] || [];
  acc[m.mode].push(m);
  return acc;
}, {});

const brawlerIndex = Object.fromEntries(BRAWLERS.map(b => [b.id, b]));

const ALL_BRAWLERS_SORTED = [...BRAWLERS].sort((a, b) =>
  a.name.localeCompare(b.name)
);

function BrawlerChip({ brawler, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="chip"
      style={{
        padding: "4px 8px",
        borderRadius: 999,
        borderColor: active ? "#3b82f6" : "rgba(75,85,99,0.9)",
        background: active
          ? "radial-gradient(circle at top left, rgba(59,130,246,0.35), #020617)"
          : "#020617",
        color: "#e5e7eb",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {brawler.image && (
        <img
          src={brawler.image}
          alt={brawler.name}
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            objectFit: "cover",
          }}
        />
      )}
      <span style={{ fontSize: 11 }}>{brawler.name}</span>
    </button>
  );
}

function SlotRow({ label, picks }) {
  return (
    <div className="stack" style={{ gap: 4 }}>
      <span
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#9ca3af",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {picks.map((id) => {
          const b = brawlerIndex[id];
          if (!b) return null;
          return (
            <div
              key={id + Math.random()}
              className="chip"
              style={{
                padding: "3px 7px",
                borderRadius: 999,
                borderColor: "#4b5563",
                background:
                  "radial-gradient(circle at top left, rgba(30,64,175,0.45), #020617)",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {b.image && (
                <img
                  src={b.image}
                  alt={b.name}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                  }}
                />
              )}
              <span style={{ fontSize: 11 }}>{b.name}</span>
            </div>
          );
        })}
        {!picks.length && (
          <span style={{ fontSize: 11, color: "#6b7280" }}>None yet</span>
        )}
      </div>
    </div>
  );
}

export function DraftSimulator({ advanced }) {
  const [selectedMode, setSelectedMode] = useState(Object.keys(mapsByMode)[0]);
  const [selectedMapId, setSelectedMapId] = useState(
    mapsByMode[selectedMode]?.[0]?.id
  );
  const [firstPick, setFirstPick] = useState(true);

  const [bans, setBans] = useState([]);
  const [ourPicks, setOurPicks] = useState([]);
  const [enemyPicks, setEnemyPicks] = useState([]);

  const [search, setSearch] = useState("");
  const [pendingSelection, setPendingSelection] = useState(null);

  const currentMap = useMemo(
    () => MAPS.find((m) => m.id === selectedMapId),
    [selectedMapId]
  );

  const unavailable = useMemo(
    () => new Set([...bans, ...ourPicks, ...enemyPicks]),
    [bans, ourPicks, enemyPicks]
  );

  const filteredBrawlers = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = ALL_BRAWLERS_SORTED.filter((b) => !unavailable.has(b.id));
    if (q) {
      list = list.filter((b) => b.name.toLowerCase().includes(q));
    }
    return list.slice(0, 24);
  }, [search, unavailable]);

  const phase = (() => {
    if (bans.length < 6) return "bans";
    const totalPicks = ourPicks.length + enemyPicks.length;
    if (totalPicks >= 6) return "done";
    return "picks";
  })();

  const picksOrder = useMemo(() => {
    // order of team perspective: A = us, B = enemy
    const order = firstPick
      ? ["A", "B", "B", "A", "A", "B"]
      : ["B", "A", "A", "B", "B", "A"];
    return order;
  }, [firstPick]);

  const currentPickSide = useMemo(() => {
    if (phase !== "picks") return null;
    const totalPicks = ourPicks.length + enemyPicks.length;
    return picksOrder[totalPicks];
  }, [phase, ourPicks.length, enemyPicks.length, picksOrder]);

  const handleConfirm = () => {
    if (!pendingSelection) return;
    if (phase === "bans") {
      if (bans.length >= 6) return;
      setBans([...bans, pendingSelection]);
      setPendingSelection(null);
      return;
    }
    if (phase === "picks") {
      if (!currentPickSide) return;
      if (currentPickSide === "A") {
        setOurPicks([...ourPicks, pendingSelection]);
      } else {
        setEnemyPicks([...enemyPicks, pendingSelection]);
      }
      setPendingSelection(null);
    }
  };

  const handleReset = () => {
    setBans([]);
    setOurPicks([]);
    setEnemyPicks([]);
    setPendingSelection(null);
  };

  const recommendations = useMemo(() => {
    if (!currentMap || phase !== "picks") return [];
    return getRecommendations({
      mapId: currentMap.id,
      ourPicks,
      enemyPicks,
      bans,
      advanced,
    });
  }, [currentMap, ourPicks, enemyPicks, bans, advanced, phase]);

  const phaseLabel =
    phase === "bans"
      ? `Bans (${bans.length}/6)`
      : phase === "picks"
      ? `Picks (${ourPicks.length + enemyPicks.length}/6)`
      : "Draft complete";

  return (
    <main className="app-main">
      <section className="section-card">
        <div className="section-header">
          <div>
            <div className="section-title">
              Draft Simulator
            </div>
            <div className="section-subtitle">
              Map, bans, picks, and live recommendations tuned for speed.
            </div>
          </div>
          <div className="badge-row">
            <span className="chip chip-blue">
              {phaseLabel}
            </span>
            <span className="chip chip-muted">
              {firstPick ? "You are First Pick" : "You are Last Pick"}
            </span>
          </div>
        </div>

        <div className="stack">
          <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
            <div style={{ minWidth: 160 }}>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#9ca3af",
                  marginBottom: 4,
                }}
              >
                Mode
              </div>
              <select
                value={selectedMode}
                onChange={(e) => {
                  const mode = e.target.value;
                  setSelectedMode(mode);
                  const first = mapsByMode[mode]?.[0];
                  if (first) setSelectedMapId(first.id);
                  handleReset();
                }}
                style={{
                  width: "100%",
                  padding: "6px 9px",
                  borderRadius: 10,
                  border: "1px solid rgba(75,85,99,0.9)",
                  background: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              >
                {Object.keys(mapsByMode).map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#9ca3af",
                  marginBottom: 4,
                }}
              >
                Map
              </div>
              <select
                value={selectedMapId}
                onChange={(e) => {
                  setSelectedMapId(e.target.value);
                  handleReset();
                }}
                style={{
                  width: "100%",
                  padding: "6px 9px",
                  borderRadius: 10,
                  border: "1px solid rgba(75,85,99,0.9)",
                  background: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              >
                {mapsByMode[selectedMode]?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ minWidth: 130 }}>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#9ca3af",
                  marginBottom: 4,
                }}
              >
                Pick side
              </div>
              <select
                value={firstPick ? "first" : "last"}
                onChange={(e) => {
                  setFirstPick(e.target.value === "first");
                  handleReset();
                }}
                style={{
                  width: "100%",
                  padding: "6px 9px",
                  borderRadius: 10,
                  border: "1px solid rgba(75,85,99,0.9)",
                  background: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              >
                <option value="first">First Pick</option>
                <option value="last">Last Pick</option>
              </select>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                flex: 1,
              }}
            >
              <button className="primary-button" onClick={handleReset}>
                <span>Reset draft</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="row" style={{ alignItems: "flex-start", gap: 14 }}>
          <div className="stack" style={{ flex: 1, minWidth: 260 }}>
            <SlotRow label="Bans" picks={bans} />
            <SlotRow label="Our picks" picks={ourPicks} />
            <SlotRow label="Enemy picks" picks={enemyPicks} />
          </div>

          <div className="stack" style={{ flex: 1.3, minWidth: 260 }}>
            <div className="stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "#9ca3af",
                      marginBottom: 4,
                    }}
                  >
                    Search brawler
                  </div>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type to filter (e.g. Gus, Piper, Meg)"
                    style={{
                      width: "100%",
                      padding: "6px 9px",
                      borderRadius: 10,
                      border: "1px solid rgba(75,85,99,0.9)",
                      background: "#020617",
                      color: "#e5e7eb",
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>
              <div
                className="stack"
                style={{ maxHeight: 150, overflowY: "auto" }}
              >
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "#9ca3af",
                  }}
                >
                  Available
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {filteredBrawlers.map((b) => (
                    <BrawlerChip
                      key={b.id}
                      brawler={b}
                      active={pendingSelection === b.id}
                      onClick={() => setPendingSelection(b.id)}
                    />
                  ))}
                  {!filteredBrawlers.length && (
                    <span
                      style={{ fontSize: 11, color: "#6b7280", paddingBottom: 4 }}
                    >
                      No brawlers match that search.
                    </span>
                  )}
                </div>
              </div>
              <div>
                <button
                  className="primary-button"
                  onClick={handleConfirm}
                  disabled={!pendingSelection}
                  style={
                    !pendingSelection
                      ? { opacity: 0.6, cursor: "default" }
                      : undefined
                  }
                >
                  <span>
                    Confirm {phase === "bans" ? "ban" : phase === "picks" ? "pick" : ""}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="stack" style={{ flex: 1.3, minWidth: 260 }}>
            <div className="section-header" style={{ padding: 0 }}>
              <div>
                <div className="section-title">Recommended picks</div>
                <div className="section-subtitle">
                  Suggestions update as bans and picks lock in.
                </div>
              </div>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              {!recommendations.length && (
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                  Start the draft by entering bans, then picks, to see live suggestions.
                </p>
              )}
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="section-card"
                  style={{
                    padding: 10,
                    borderRadius: 14,
                    border: rec.mustPick
                      ? "1px solid rgba(251,191,36,0.95)"
                      : "1px solid rgba(148,163,184,0.5)",
                    background: rec.mustPick
                      ? "linear-gradient(135deg, rgba(251,191,36,0.14), rgba(15,23,42,0.98))"
                      : "linear-gradient(135deg, rgba(30,64,175,0.2), rgba(15,23,42,0.98))",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {rec.mustPick && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -1,
                        background:
                          "conic-gradient(from 180deg, #f97316, #eab308, #22c55e, #0ea5e9, #6366f1, #f97316)",
                        opacity: 0.45,
                        filter: "blur(28px)",
                        zIndex: 0,
                      }}
                    />
                  )}
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      <img
                        src={rec.image}
                        alt={rec.name}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          objectFit: "cover",
                          boxShadow: "0 0 0 1px rgba(15,23,42,0.9)",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 2,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            {rec.name}
                          </span>
                          {rec.mustPick && (
                            <span className="chip chip-gold chip-pill">
                              MUST PICK
                            </span>
                          )}
                        </div>
                        <div className="badge-row">
                          {rec.tags.map((tag) => (
                            <span
                              key={tag}
                              className="chip chip-pill"
                              style={{
                                borderColor: "rgba(148,163,184,0.7)",
                                background: "#020617",
                                fontSize: 10,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#d1d5db",
                        margin: "4px 0 0",
                      }}
                    >
                      {advanced ? rec.longExplanation : rec.shortExplanation}
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => setPendingSelection(rec.id)}
                      style={{
                        marginTop: 8,
                        padding: "5px 10px",
                        fontSize: 11,
                      }}
                    >
                      Use this pick
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
