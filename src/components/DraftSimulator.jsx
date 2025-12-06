import React, { useMemo, useState } from "react";
import { MAPS } from "../data/maps";
import { BRAWLERS } from "../data/brawlers";
import { getRecommendations } from "../logic/recommendationEngine";

const MODES = ["Gem Grab", "Brawl Ball", "Bounty", "Heist", "Hot Zone", "Knockout"];
const TOTAL_BANS = 6;
// Worlds-style ABBAAB pattern
const PICK_PATTERN = ["A", "B", "B", "A", "A", "B"];

function getInitialState() {
  return {
    mode: null,
    mapId: null,
    firstPick: null, // true = we are A, false = we are B
    bans: [],
    ourPicks: [],
    enemyPicks: [],
    phase: "setup", // "setup" | "bans" | "picks" | "done"
    search: "",
    pendingPick: null,
  };
}

export function DraftSimulator({ advanced }) {
  const [state, setState] = useState(getInitialState);

  const currentMap = useMemo(
    () => MAPS.find((m) => m.id === state.mapId) || null,
    [state.mapId]
  );

  // Safer: filter maps by mode every time (no pre-computed map)
  const mapsForMode = useMemo(() => {
    if (!state.mode) return [];
    const target = state.mode.toLowerCase().trim();
    return MAPS.filter(
      (m) => (m.mode || "").toLowerCase().trim() === target
    );
  }, [state.mode]);

  const takenSet = useMemo(
    () => new Set([...state.bans, ...state.ourPicks, ...state.enemyPicks]),
    [state.bans, state.ourPicks, state.enemyPicks]
  );

  // Step gating
  const setupReady =
    state.firstPick !== null && !!state.mode && !!state.mapId;

  const currentPickInfo = useMemo(() => {
    if (state.phase === "setup") {
      return { label: "Draft setup", side: null, pickingIsUs: false };
    }

    if (state.phase === "bans") {
      const num = state.bans.length + 1;
      return {
        label: `Ban ${num} / ${TOTAL_BANS}`,
        side: num % 2 === 1 ? "Your ban" : "Enemy ban",
        pickingIsUs: true, // we input both sides' bans
      };
    }

    const our = state.ourPicks.length;
    const enemy = state.enemyPicks.length;
    const total = our + enemy;

    if (total >= 6 || state.phase === "done") {
      return { label: "Draft complete", side: null, pickingIsUs: false };
    }

    const turnLetter = PICK_PATTERN[total];
    const ourSideLetter = state.firstPick ? "A" : "B";
    const pickingIsUs = turnLetter === ourSideLetter;

    return {
      label: `Pick ${total + 1} / 6`,
      side: pickingIsUs ? "Your pick" : "Enemy pick",
      pickingIsUs,
    };
  }, [
    state.phase,
    state.bans.length,
    state.ourPicks.length,
    state.enemyPicks.length,
    state.firstPick,
  ]);

  const isOurTurn =
    state.phase === "picks" && !!currentMap && currentPickInfo.pickingIsUs;

  // Recommendations
  const recommendations = useMemo(() => {
    if (!isOurTurn || !currentMap) return [];
    try {
      return getRecommendations({
        mapId: currentMap.id,
        ourPicks: state.ourPicks,
        enemyPicks: state.enemyPicks,
        bans: state.bans,
        advanced,
      });
    } catch (e) {
      console.error("Recommendation error", e);
      return [];
    }
  }, [
    isOurTurn,
    currentMap,
    state.ourPicks,
    state.enemyPicks,
    state.bans,
    advanced,
  ]);

  // Tier map for glow colors: must / meta / strong / flex
  const recommendationTiers = useMemo(() => {
    const tierMap = new Map();
    recommendations.forEach((r, index) => {
      if (r.mustPick) {
        tierMap.set(r.id, "must");
      } else if (index === 0) {
        tierMap.set(r.id, "meta");
      } else if (index <= 2) {
        tierMap.set(r.id, "strong");
      } else {
        tierMap.set(r.id, "flex");
      }
    });
    return tierMap;
  }, [recommendations]);

  // Brawlers shown in the main grid
  const visibleBrawlers = useMemo(() => {
    if (!setupReady || state.phase === "setup") return [];

    const q = state.search.trim().toLowerCase();
    const available = BRAWLERS.filter((b) => !takenSet.has(b.id));

    if (q) {
      return available.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q)
      );
    }

    if (state.phase === "bans") {
      return available;
    }

    if (state.phase === "picks" && isOurTurn && recommendations.length > 0) {
      const recIds = new Set(recommendations.map((r) => r.id));
      return available.filter((b) => recIds.has(b.id));
    }

    return [];
  }, [
    setupReady,
    state.phase,
    state.search,
    takenSet,
    isOurTurn,
    recommendations,
  ]);

  const ourTeam = useMemo(
    () =>
      state.ourPicks
        .map((id) => BRAWLERS.find((b) => b.id === id))
        .filter(Boolean),
    [state.ourPicks]
  );

  const enemyTeam = useMemo(
    () =>
      state.enemyPicks
        .map((id) => BRAWLERS.find((b) => b.id === id))
        .filter(Boolean),
    [state.enemyPicks]
  );

  const winChance = useMemo(() => {
    if (state.phase !== "done" || !currentMap) return null;
    const banFactor = state.bans.length / TOTAL_BANS;
    const sideBonus = state.firstPick ? 2 : 0;
    const raw = 48 + banFactor * 8 + sideBonus;
    const clamped = Math.max(35, Math.min(65, Math.round(raw)));
    return clamped;
  }, [state.phase, currentMap, state.bans.length, state.firstPick]);

  const bansRemaining = TOTAL_BANS - state.bans.length;

  // ---------------- handlers ----------------

  function resetDraft() {
    setState(getInitialState());
  }

  function handleFirstPickToggle(value) {
    setState((prev) =>
      prev.phase !== "setup" ? prev : { ...prev, firstPick: value }
    );
  }

  function handleModeChange(mode) {
    setState((prev) => {
      if (prev.phase !== "setup") return prev;
      return {
        ...prev,
        mode,
        mapId: null, // force user to pick a map
      };
    });
  }

  function handleMapSelect(id) {
    setState((prev) =>
      prev.phase !== "setup" ? prev : { ...prev, mapId: id }
    );
  }

  function startDraft() {
    if (!setupReady) return;
    setState((prev) =>
      prev.phase !== "setup"
        ? prev
        : { ...prev, phase: "bans", pendingPick: null }
    );
  }

  function handleBrawlerClick(id) {
    if (takenSet.has(id)) return;
    if (state.phase === "setup") return;
    setState((prev) => ({ ...prev, pendingPick: id }));
  }

  function confirmPending() {
    if (!state.pendingPick || state.phase === "setup") return;
    const id = state.pendingPick;

    if (state.phase === "bans") {
      if (state.bans.length >= TOTAL_BANS) return;
      setState((prev) => {
        const bans = [...prev.bans, id];
        const phase = bans.length >= TOTAL_BANS ? "picks" : "bans";
        return { ...prev, bans, pendingPick: null, phase };
      });
      return;
    }

    // picks
    setState((prev) => {
      const our = [...prev.ourPicks];
      const enemy = [...prev.enemyPicks];
      const total = our.length + enemy.length;

      if (total >= 6) {
        return { ...prev, pendingPick: null, phase: "done" };
      }

      const turnLetter = PICK_PATTERN[total];
      const ourSideLetter = prev.firstPick ? "A" : "B";
      const pickingIsUs = turnLetter === ourSideLetter;

      if (pickingIsUs) {
        our.push(id);
      } else {
        enemy.push(id);
      }

      const newTotal = our.length + enemy.length;
      const phase = newTotal >= 6 ? "done" : "picks";

      return {
        ...prev,
        ourPicks: our,
        enemyPicks: enemy,
        pendingPick: null,
        phase,
      };
    });
  }

  function handleUseRecommendation(id) {
    if (takenSet.has(id)) return;
    setState((prev) => ({ ...prev, pendingPick: id }));
  }

  // ---------------- render ----------------

  return (
    <div className="page">
      <div className="page-header">
        <h1>Brawl Draft Lab – Draft Simulator</h1>
        <p className="page-subtitle">
          Step through Worlds-style drafts with bans, picks and live suggestions.
        </p>
        <button className="reset-button" onClick={resetDraft}>
          Reset draft
        </button>
      </div>

      {/* SETUP */}
      <section className="section-card">
        <h2>Draft setup</h2>
        <p className="muted">
          Follow the real draft order: pick side, mode &amp; map, then lock bans
          and picks in order. Each step unlocks the next.
        </p>

        <div className="draft-setup-grid">
          {/* Step 1 – side */}
          <div>
            <h3>Side</h3>
            <p className="muted">
              Step 1 – choose whether your team has first pick or last pick.
            </p>
            <div className="side-toggle">
              <button
                className={
                  state.firstPick === true ? "chip chip-primary" : "chip chip-ghost"
                }
                onClick={() => handleFirstPickToggle(true)}
              >
                First pick
              </button>
              <button
                className={
                  state.firstPick === false ? "chip chip-primary" : "chip chip-ghost"
                }
                onClick={() => handleFirstPickToggle(false)}
              >
                Last pick
              </button>
            </div>
          </div>

          {/* Step 2 – mode */}
          <div>
            <h3>Game mode</h3>
            <p className="muted">Step 2 – select the mode you’re playing.</p>
            {state.firstPick === null ? (
              <p className="muted small">
                Choose First pick or Last pick in Step 1 to unlock game modes.
              </p>
            ) : (
              <div className="mode-chips">
                {MODES.map((mode) => (
                  <button
                    key={mode}
                    className={
                      state.mode === mode ? "chip chip-primary" : "chip chip-ghost"
                    }
                    onClick={() => handleModeChange(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 3 – map */}
          <div>
            <h3>Map</h3>
            <p className="muted">Step 3 – choose the exact map from the pool.</p>
            {!state.mode ? (
              <p className="muted small">
                Select a game mode in Step 2 to unlock the map pool.
              </p>
            ) : (
              <div className="map-grid">
                {mapsForMode.map((m) => (
                  <button
                    key={m.id}
                    className={
                      state.mapId === m.id ? "map-tile map-tile-selected" : "map-tile"
                    }
                    onClick={() => handleMapSelect(m.id)}
                  >
                    {m.image && (
                      <div
                        className="map-image"
                        style={{ backgroundImage: `url(${m.image})` }}
                      />
                    )}
                    <div className="map-label">
                      <div className="map-name">{m.name}</div>
                      <div className="map-mode">{m.mode}</div>
                    </div>
                  </button>
                ))}

                {mapsForMode.length === 0 && (
                  <p className="muted small">
                    No maps found for this mode – double-check your map data.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="start-draft-row">
          <button
            className="primary-button"
            onClick={startDraft}
            disabled={!setupReady || state.phase !== "setup"}
          >
            {setupReady ? "Start bans" : "Finish steps 1–3 to start draft"}
          </button>
          {state.phase !== "setup" && (
            <span className="muted small">
              Setup locked in. Use Reset if you need to run it back.
            </span>
          )}
        </div>
      </section>

      {/* LIVE DRAFT */}
      <section className="section-card draft-section">
        {state.phase === "setup" ? (
          <p className="muted">
            Complete setup above and press <strong>Start bans</strong> to unlock the
            live draft tools, recommendations and final overview.
          </p>
        ) : (
          <>
            <div className="draft-layout">
              {/* Left column – status & history */}
              <div className="draft-status-column">
                <div className="draft-phase-header">
                  <span className={`phase-badge phase-${state.phase}`}>
                    {state.phase === "bans"
                      ? "Bans"
                      : state.phase === "picks"
                      ? "Picks"
                      : "Done"}
                  </span>
                  <h2>Live draft</h2>
                </div>

                <p className="muted">
                  {state.phase === "bans" &&
                    `${bansRemaining} ban${
                      bansRemaining === 1 ? "" : "s"
                    } left. Click a brawler then Confirm to lock each ban.`}
                  {state.phase === "picks" &&
                    (currentPickInfo.pickingIsUs
                      ? "It’s your pick. Choose a brawler below, then Confirm."
                      : "Enemy pick – mirror their choice so suggestions stay accurate.")}
                  {state.phase === "done" &&
                    "Draft is finished. Review the VS screen below, then get ready for the match."}
                </p>

                <div className="current-pick-box">
                  <div className="current-pick-label">{currentPickInfo.label}</div>
                  {currentPickInfo.side && (
                    <div className="current-pick-side">{currentPickInfo.side}</div>
                  )}
                  <button
                    className="primary-button confirm-button"
                    onClick={confirmPending}
                    disabled={!state.pendingPick}
                  >
                    Confirm
                  </button>
                </div>

                <div className="team-columns">
                  <div className="team-column">
                    <h3>Your side</h3>
                    <p className="muted">Track your bans and picks as you go.</p>
                    <div className="side-tag">
                      {state.firstPick === null
                        ? "Side not set"
                        : state.firstPick
                        ? "First pick"
                        : "Last pick"}
                    </div>

                    <h4>Bans</h4>
                    <div className="chip-row">
                      {state.bans.length === 0 && (
                        <span className="muted small">No bans locked yet.</span>
                      )}
                      {state.bans.map((id) => {
                        const b = BRAWLERS.find((x) => x.id === id);
                        return (
                          <div key={id} className="brawler-chip">
                            {b?.image && (
                              <img
                                src={b.image}
                                alt={b?.name || id}
                                className="brawler-chip-image"
                              />
                            )}
                            <span className="brawler-chip-name">
                              {b?.name || id}
                            </span>
                            <span className="badge badge-ban">Ban</span>
                          </div>
                        );
                      })}
                    </div>

                    <h4>Your picks</h4>
                    <div className="chip-row">
                      {state.ourPicks.length === 0 && (
                        <span className="muted small">No picks yet.</span>
                      )}
                      {state.ourPicks.map((id) => {
                        const b = BRAWLERS.find((x) => x.id === id);
                        return (
                          <div key={id} className="brawler-chip">
                            {b?.image && (
                              <img
                                src={b.image}
                                alt={b?.name || id}
                                className="brawler-chip-image"
                              />
                            )}
                            <span className="brawler-chip-name">
                              {b?.name || id}
                            </span>
                            <span className="badge badge-you">You</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="team-column">
                    <h3>Enemy side</h3>
                    <p className="muted">
                      Mirror their picks so suggestions stay accurate.
                    </p>

                    <h4>Enemy picks</h4>
                    <div className="chip-row">
                      {state.enemyPicks.length === 0 && (
                        <span className="muted small">No enemy picks yet.</span>
                      )}
                      {state.enemyPicks.map((id) => {
                        const b = BRAWLERS.find((x) => x.id === id);
                        return (
                          <div key={id} className="brawler-chip">
                            {b?.image && (
                              <img
                                src={b.image}
                                alt={b?.name || id}
                                className="brawler-chip-image"
                              />
                            )}
                            <span className="brawler-chip-name">
                              {b?.name || id}
                            </span>
                            <span className="badge badge-enemy">Enemy</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column – search + recommendations */}
              <div className="draft-action-column">
                <div className="search-header">
                  <h3>Brawler search</h3>
                  <p className="muted">
                    Type to filter, or tap a recommended pick when it’s your turn.
                  </p>
                  <input
                    type="text"
                    value={state.search}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, search: e.target.value }))
                    }
                    placeholder="Search brawler name…"
                    className="search-input"
                  />
                </div>

                <div className="brawler-grid">
                  {visibleBrawlers.map((b) => {
                    const isPending = state.pendingPick === b.id;
                    const tier = recommendationTiers.get(b.id);

                    const classNames = [
                      "brawler-tile",
                      takenSet.has(b.id) ? "disabled" : "",
                      tier ? "recommended" : "",
                      tier === "must" ? "must" : "",
                      tier === "meta" ? "tier-meta" : "",
                      tier === "strong" ? "tier-strong" : "",
                      tier === "flex" ? "tier-flex" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <button
                        key={b.id}
                        className={classNames}
                        onClick={() => handleBrawlerClick(b.id)}
                        disabled={takenSet.has(b.id)}
                      >
                        {b.image && (
                          <img
                            src={b.image}
                            alt={b.name}
                            className="brawler-portrait"
                          />
                        )}
                        <div className="brawler-name">{b.name}</div>
                        {isPending && (
                          <div className="pending-label">Pending</div>
                        )}
                      </button>
                    );
                  })}

                  {visibleBrawlers.length === 0 && (
                    <div className="muted small">
                      {state.phase === "bans"
                        ? "No brawlers available (check bans / picks)."
                        : state.phase === "picks" && currentPickInfo.pickingIsUs
                        ? "No recommended picks – try searching by name."
                        : "Enemy pick – input their choice on the left, then suggestions will resume on your turn."}
                    </div>
                  )}
                </div>

                <div className="recommendations-panel">
                  <h3>Recommended picks</h3>
                  <p className="muted">
                    Suggestions using Worlds-style data, map mode, bans and comp
                    shape.
                  </p>

                  {state.phase === "bans" && (
                    <p className="muted small">
                      Lock all six bans first — suggestions start once picks begin.
                    </p>
                  )}

                  {state.phase === "picks" && !isOurTurn && (
                    <p className="muted small">
                      Waiting for enemy pick. Mirror their choice in the Enemy side
                      column; we’ll refresh suggestions on your turn.
                    </p>
                  )}

                  {isOurTurn && recommendations.length === 0 && (
                    <p className="muted small">
                      No clear read yet. Try adding more picks or adjusting the bans.
                    </p>
                  )}

                  {isOurTurn && recommendations.length > 0 && (
                    <div className="recommendation-list">
                      {recommendations.map((r) => {
                        const tier = recommendationTiers.get(r.id);
                        const cardClassNames = [
                          "recommendation-card",
                          tier === "must" ? "recommendation-card-must" : "",
                          tier === "meta" ? "recommendation-card-meta" : "",
                          tier === "strong"
                            ? "recommendation-card-strong"
                            : "",
                          tier === "flex" ? "recommendation-card-flex" : "",
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <div key={r.id} className={cardClassNames}>
                            <div className="recommendation-main">
                              {r.image && (
                                <img
                                  src={r.image}
                                  alt={r.name}
                                  className="recommendation-image"
                                />
                              )}
                              <div>
                                <div className="recommendation-name">
                                  {r.name}
                                </div>
                                <div className="tag-row">
                                  {r.tags.map((t) => (
                                    <span key={t} className="badge badge-tag">
                                      {t}
                                    </span>
                                  ))}
                                  {tier === "must" && (
                                    <span className="badge badge-must">
                                      MUST PICK
                                    </span>
                                  )}
                                  {tier === "meta" && (
                                    <span className="badge badge-meta">
                                      META
                                    </span>
                                  )}
                                  {tier === "strong" && (
                                    <span className="badge badge-strong">
                                      STRONG
                                    </span>
                                  )}
                                  {tier === "flex" && (
                                    <span className="badge badge-flex">
                                      FLEX
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              className="secondary-button"
                              onClick={() => handleUseRecommendation(r.id)}
                            >
                              Use this pick
                            </button>
                            <p className="muted small">
                              {advanced
                                ? r.longExplanation
                                : r.shortExplanation}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Final overview */}
            {state.phase === "done" && (
              <div className="final-overview">
                <h3 className="final-title">Draft overview</h3>
                <p className="muted small">
                  Snapshot of the finished draft – use this as a quick mental
                  warmup before the game loads.
                </p>

                <div className="vs-layout">
                  <div className="vs-side vs-side-our">
                    <div className="vs-label">Your team</div>
                    <div className="vs-team-row">
                      {ourTeam.map((b) => (
                        <div key={b.id} className="vs-slot">
                          {b.image && <img src={b.image} alt={b.name} />}
                          <div className="vs-slot-name">{b.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="vs-side vs-side-enemy">
                    <div className="vs-label">Enemy team</div>
                    <div className="vs-team-row">
                      {enemyTeam.map((b) => (
                        <div key={b.id} className="vs-slot">
                          {b.image && <img src={b.image} alt={b.name} />}
                          <div className="vs-slot-name">{b.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {winChance !== null && (
                  <div className="vs-center">
                    <div className="win-chance">
                      Estimated win chance: {winChance}%
                    </div>
                    <div className="muted small">
                      Based on bans, side and basic comp shape – not a guarantee,
                      just a quick read.
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
