import React, { useMemo, useState } from "react";
import { MAPS } from "../data/maps";
import { BRAWLERS } from "../data/brawlers";
import { getRecommendations } from "../logic/recommendationEngine";

const MODES = ["Gem Grab", "Brawl Ball", "Bounty", "Heist", "Hot Zone", "Knockout"];

function groupMapsByMode() {
  const byMode = {};
  for (const mode of MODES) byMode[mode] = [];
  for (const m of MAPS) {
    if (!byMode[m.mode]) byMode[m.mode] = [];
    byMode[m.mode].push(m);
  }
  return byMode;
}

const MAPS_BY_MODE = groupMapsByMode();
const TOTAL_BANS = 6;

function getInitialState() {
  const defaultMode = "Gem Grab";
  const firstMap = (MAPS_BY_MODE[defaultMode] || [])[0];

  return {
    mode: defaultMode,
    mapId: firstMap ? firstMap.id : null,
    firstPick: null, // user must choose first or last pick
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

  const takenSet = useMemo(
    () => new Set([...state.bans, ...state.ourPicks, ...state.enemyPicks]),
    [state.bans, state.ourPicks, state.enemyPicks]
  );

  const setupReady =
    state.firstPick !== null && !!state.mode && !!state.mapId;

  const currentPickInfo = useMemo(() => {
    if (state.phase === "setup") {
      return {
        label: "Draft setup",
        side: null,
        pickingIsUs: false,
      };
    }

    if (state.phase === "bans") {
      const num = state.bans.length + 1;
      return {
        label: `Ban ${num} / ${TOTAL_BANS}`,
        side: num % 2 === 1 ? "Your ban" : "Enemy ban",
        pickingIsUs: true, // bans are always “ours” to input
      };
    }

    const our = state.ourPicks.length;
    const enemy = state.enemyPicks.length;
    const total = our + enemy;

    if (total >= 6 || state.phase === "done") {
      return { label: "Draft complete", side: null, pickingIsUs: false };
    }

    // Worlds-style ABBAAB pattern
    const pattern = ["A", "B", "B", "A", "A", "B"];
    const turn = pattern[total];
    const ourSide = state.firstPick ? "A" : "B";
    const pickingIsUs = turn === ourSide;

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

  // Recommendations only when:
  // - we’re past bans
  // - it’s *our* turn to pick
  // - we have a map selected
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

  // Brawlers shown in the main grid:
  // - If search is typed: any matching brawler (not taken)
  // - Else if it’s our turn & we have recommendations: only those recommended
  // - Else (enemy turn / bans): show nothing in the grid
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

    if (isOurTurn && recommendations.length > 0) {
      const recIds = new Set(recommendations.map((r) => r.id));
      return available.filter((b) => recIds.has(b.id));
    }

    // During bans or enemy picks: grid stays minimal
    if (state.phase === "bans") return available; // bans still need full list
    return [];
  }, [setupReady, state.phase, state.search, takenSet, isOurTurn, recommendations]);

  function resetDraft() {
    setState(getInitialState());
  }

  function handleModeChange(mode) {
    const maps = MAPS_BY_MODE[mode] || [];
    setState((prev) => ({
      ...getInitialState(),
      mode,
      mapId: maps[0] ? maps[0].id : null,
      firstPick: prev.firstPick, // keep side selection
    }));
  }

  function handleMapSelect(id) {
    setState((prev) => ({ ...prev, mapId: id }));
  }

  function handleFirstPickToggle(value) {
    setState((prev) => ({ ...prev, firstPick: value }));
  }

  function startDraft() {
    if (!setupReady) return;
    setState((prev) => ({
      ...prev,
      phase: "bans",
      pendingPick: null,
    }));
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

    // Picks
    setState((prev) => {
      const our = [...prev.ourPicks];
      const enemy = [...prev.enemyPicks];
      const total = our.length + enemy.length;

      if (total >= 6) {
        return { ...prev, pendingPick: null, phase: "done" };
      }

      const pattern = ["A", "B", "B", "A", "A", "B"];
      const turn = pattern[total];
      const ourSide = prev.firstPick ? "A" : "B";
      const pickingIsUs = turn === ourSide;

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

  const bansRemaining = TOTAL_BANS - state.bans.length;

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
          Follow the real draft order: pick side, mode &amp; map, then lock bans and
          picks in order.
        </p>

        <div className="draft-setup-grid">
          <div>
            <h3>Side</h3>
            <p className="muted">
              Step 1 – choose whether your team has first pick or last pick.
            </p>
            <div className="side-toggle">
              <button
                className={
                  state.firstPick === true
                    ? "chip chip-primary"
                    : "chip chip-ghost"
                }
                onClick={() => handleFirstPickToggle(true)}
              >
                First pick
              </button>
              <button
                className={
                  state.firstPick === false
                    ? "chip chip-primary"
                    : "chip chip-ghost"
                }
                onClick={() => handleFirstPickToggle(false)}
              >
                Last pick
              </button>
            </div>
          </div>

          <div>
            <h3>Game mode</h3>
            <p className="muted">Step 2 – select the mode you’re playing.</p>
            <div className="mode-chips">
              {MODES.map((mode) => (
                <button
                  key={mode}
                  className={
                    state.mode === mode
                      ? "chip chip-primary"
                      : "chip chip-ghost"
                  }
                  onClick={() => handleModeChange(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3>Map</h3>
            <p className="muted">
              Step 3 – choose the exact map from the current pool.
            </p>
            <div className="map-grid">
              {(MAPS_BY_MODE[state.mode] || []).map((m) => (
                <button
                  key={m.id}
                  className={
                    state.mapId === m.id
                      ? "map-tile map-tile-selected"
                      : "map-tile"
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
            </div>
          </div>
        </div>

        <div className="start-draft-row">
          <button
            className="primary-button"
            onClick={startDraft}
            disabled={!setupReady || state.phase !== "setup"}
          >
            {setupReady
              ? "Start bans"
              : "Pick side + map to start draft"}
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
        <div className="draft-layout">
          {/* Left column – status & history */}
          <div className="draft-status-column">
            <div className="draft-phase-header">
              <span className={`phase-badge phase-${state.phase}`}>
                {state.phase === "setup"
                  ? "Setup"
                  : state.phase === "bans"
                  ? "Bans"
                  : state.phase === "picks"
                  ? "Picks"
                  : "Done"}
              </span>
              <h2>Live draft</h2>
            </div>

            <p className="muted">
              {state.phase === "setup" &&
                "Lock your side, mode and map, then start bans to begin the draft."}
              {state.phase === "bans" &&
                `${bansRemaining} ban${
                  bansRemaining === 1 ? "" : "s"
                } left. Click a brawler then Confirm to lock each ban.`}
              {state.phase === "picks" &&
                (currentPickInfo.pickingIsUs
                  ? "It’s your pick. Choose a brawler below, then Confirm."
                  : "Enemy pick – mirror their choice so suggestions stay accurate.")}
              {state.phase === "done" &&
                "Draft is finished. You can review the teams or reset to run it back."}
            </p>

            <div className="current-pick-box">
              <div className="current-pick-label">
                {currentPickInfo.label}
              </div>
              {currentPickInfo.side && (
                <div className="current-pick-side">
                  {currentPickInfo.side}
                </div>
              )}
              <button
                className="primary-button confirm-button"
                onClick={confirmPending}
                disabled={!state.pendingPick || state.phase === "setup"}
              >
                Confirm
              </button>
            </div>

            <div className="team-columns">
              <div className="team-column">
                <h3>Your side</h3>
                <p className="muted">
                  Track your bans and picks as you go.
                </p>
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
                    <span className="muted small">
                      No bans locked yet.
                    </span>
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
                    <span className="muted small">
                      No picks yet.
                    </span>
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
                    <span className="muted small">
                      No enemy picks yet.
                    </span>
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

            {state.phase === "setup" && (
              <div className="muted">
                Complete setup and start bans to unlock the draft tools.
              </div>
            )}

            {state.phase !== "setup" && (
              <>
                <div className="brawler-grid">
                  {visibleBrawlers.map((b) => {
                    const isPending = state.pendingPick === b.id;
                    const rec = recommendations.find((r) => r.id === b.id);
                    const classNames = [
                      "brawler-tile",
                      takenSet.has(b.id) ? "disabled" : "",
                      rec ? "recommended" : "",
                      rec && rec.mustPick ? "must" : "",
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
                        : currentPickInfo.pickingIsUs
                        ? "No recommended picks – try searching by name."
                        : "Enemy pick – input their choice, then suggestions will resume on your turn."}
                    </div>
                  )}
                </div>

                <div className="recommendations-panel">
                  <h3>Recommended picks</h3>
                  <p className="muted">
                    Suggestions using Worlds-style data, map mode, bans and
                    comp shape.
                  </p>

                  {state.phase === "bans" && (
                    <p className="muted small">
                      Lock all six bans first — suggestions start once picks
                      begin.
                    </p>
                  )}

                  {state.phase === "picks" &&
                    !isOurTurn && (
                      <p className="muted small">
                        Waiting for enemy pick. Mirror their choice above, then
                        we’ll refresh suggestions on your turn.
                      </p>
                    )}

                  {isOurTurn && recommendations.length === 0 && (
                    <p className="muted small">
                      No clear read yet. Try adding more picks or adjusting the
                      bans.
                    </p>
                  )}

                  {isOurTurn && recommendations.length > 0 && (
                    <div className="recommendation-list">
                      {recommendations.map((r) => (
                        <div
                          key={r.id}
                          className={
                            "recommendation-card" +
                            (r.mustPick ? " recommendation-card-must" : "")
                          }
                        >
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
                                {r.mustPick && (
                                  <span className="badge badge-must">
                                    MUST PICK
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
                            {advanced ? r.longExplanation : r.shortExplanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* TODO: final overview style – we’ll build the full VS screen next pass */}
      </section>
    </div>
  );
}
