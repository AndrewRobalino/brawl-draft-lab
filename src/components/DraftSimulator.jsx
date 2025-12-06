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

function getInitialState() {
  const defaultMode = "Gem Grab";
  const firstMap = (MAPS_BY_MODE[defaultMode] || [])[0];
  return {
    mode: defaultMode,
    mapId: firstMap ? firstMap.id : null,
    firstPick: true,
    bans: [],
    ourPicks: [],
    enemyPicks: [],
    phase: "bans", // "bans" | "picks" | "done"
    search: "",
    pendingPick: null,
  };
}

const TOTAL_BANS = 6;

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

  const currentPickInfo = useMemo(() => {
    if (state.phase === "bans") {
      const num = state.bans.length + 1;
      return {
        label: `Ban ${num} / ${TOTAL_BANS}`,
        side: num % 2 === 1 ? "Your ban" : "Enemy ban",
        pickingIsUs: true,
      };
    }
    const our = state.ourPicks.length;
    const enemy = state.enemyPicks.length;
    const total = our + enemy;
    if (total >= 6) {
      return { label: "Draft complete", side: null, pickingIsUs: false };
    }
    const pattern = ["A", "B", "B", "A", "A", "B"];
    const turn = pattern[total];
    const ourSide = state.firstPick ? "A" : "B";
    const pickingIsUs = turn === ourSide;
    return {
      label: `Pick ${total + 1} / 6`,
      side: pickingIsUs ? "Your pick" : "Enemy pick",
      pickingIsUs,
    };
  }, [state.phase, state.bans.length, state.ourPicks.length, state.enemyPicks.length, state.firstPick]);

  const filteredBrawlers = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    return BRAWLERS.filter((b) => {
      if (takenSet.has(b.id)) return false;
      if (!q) return true;
      return b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
    });
  }, [state.search, takenSet]);

  const recommendations = useMemo(() => {
    if (state.phase === "bans" || !currentMap) return [];
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
  }, [state.phase, currentMap, state.ourPicks, state.enemyPicks, state.bans, advanced]);

  function resetDraft() {
    setState(getInitialState());
  }

  function handleModeChange(mode) {
    const maps = MAPS_BY_MODE[mode] || [];
    setState((prev) => ({
      ...getInitialState(),
      mode,
      mapId: maps[0] ? maps[0].id : null,
      firstPick: prev.firstPick,
    }));
  }

  function handleMapSelect(id) {
    setState((prev) => ({ ...prev, mapId: id }));
  }

  function handleFirstPickToggle(value) {
    setState((prev) => ({ ...prev, firstPick: value }));
  }

  function handleBrawlerClick(id) {
    if (takenSet.has(id)) return;
    setState((prev) => ({ ...prev, pendingPick: id }));
  }

  function confirmPending() {
    if (!state.pendingPick) return;
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
      return { ...prev, ourPicks: our, enemyPicks: enemy, pendingPick: null, phase };
    });
  }

  function handleUseRecommendation(id) {
    if (takenSet.has(id)) return;
    setState((prev) => ({ ...prev, pendingPick: id }));
  }

  const bansRemaining = TOTAL_BANS - state.bans.length;

  return (
    <div className="page-grid">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Draft setup</div>
            <div className="card-subtitle">
              Pick mode, map and side. Then follow bans and picks in real time.
            </div>
          </div>
          <button className="btn-ghost" onClick={resetDraft}>
            Reset draft
          </button>
        </div>

        <div className="section-title">Game mode</div>
        <div className="chips-row" style={{ marginBottom: 8 }}>
          {MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              className={"btn-ghost" + (state.mode === mode ? " active" : "")}
              onClick={() => handleModeChange(mode)}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="section-title" style={{ marginTop: 10 }}>Map</div>
        <div className="section-caption">
          These maps are from the Worlds-style pool and current ranked rotation.
        </div>
        <div className="map-grid">
          {(MAPS_BY_MODE[state.mode] || []).map((m) => (
            <button
              key={m.id}
              type="button"
              className={"map-tile" + (state.mapId === m.id ? " selected" : "")}
              onClick={() => handleMapSelect(m.id)}
            >
              {m.image && <img src={m.image} alt={m.name} loading="lazy" />}
              <div className="map-tile-footer">
                <div className="map-name">{m.name}</div>
                <div className="map-mode">{m.mode}</div>
              </div>
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            gap: 10,
          }}
        >
          <div>
            <div className="section-title">Side</div>
            <div className="section-caption">
              Choose whether your team has first pick or last pick.
            </div>
          </div>
          <div className="chips-row">
            <button
              type="button"
              className={"btn-ghost" + (state.firstPick ? " active" : "")}
              onClick={() => handleFirstPickToggle(true)}
            >
              First pick
            </button>
            <button
              type="button"
              className={"btn-ghost" + (!state.firstPick ? " active" : "")}
              onClick={() => handleFirstPickToggle(false)}
            >
              Last pick
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Live draft</div>
            <div className="card-subtitle">
              Click a brawler to mark it pending, then confirm to lock bans & picks.
            </div>
          </div>
          <div className="pill">
            {state.phase === "bans"
              ? `${bansRemaining} ban${bansRemaining === 1 ? "" : "s"} left`
              : state.phase === "picks"
              ? "Picking phase"
              : "Draft complete"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            gap: 10,
          }}
        >
          <div>
            <div className="section-title">{currentPickInfo.label}</div>
            <div className="section-caption">
              {currentPickInfo.side
                ? `${currentPickInfo.side}: choose a brawler below, then confirm.`
                : "You can still explore suggestions or reset to run it back."}
            </div>
          </div>
          <button
            className="btn-primary"
            disabled={!state.pendingPick}
            onClick={confirmPending}
          >
            Confirm
          </button>
        </div>

        <div className="draft-layout" style={{ marginBottom: 10 }}>
          <div className="draft-side">
            <div className="draft-side-header">
              <div>
                <div className="section-title">Your side</div>
                <div className="section-caption">
                  Track your bans and picks as you go.
                </div>
              </div>
              <span className={state.firstPick ? "badge-first" : "badge-last"}>
                {state.firstPick ? "First pick" : "Last pick"}
              </span>
            </div>
            <div className="section-title">Bans</div>
            <div className="chips-row" style={{ marginBottom: 6 }}>
              {state.bans.map((id) => {
                const b = BRAWLERS.find((x) => x.id === id);
                return (
                  <div key={id} className="chip">
                    {b?.image && <img src={b.image} alt={b.name} />}
                    <span className="chip-label-strong">{b?.name || id}</span>
                    <span className="chip-meta">Ban</span>
                  </div>
                );
              })}
              {!state.bans.length && (
                <span className="chip-meta">No bans locked yet</span>
              )}
            </div>
            <div className="section-title">Your picks</div>
            <div className="chips-row">
              {state.ourPicks.map((id) => {
                const b = BRAWLERS.find((x) => x.id === id);
                return (
                  <div key={id} className="chip">
                    {b?.image && <img src={b.image} alt={b.name} />}
                    <span className="chip-label-strong">{b?.name || id}</span>
                    <span className="chip-meta">You</span>
                  </div>
                );
              })}
              {!state.ourPicks.length && (
                <span className="chip-meta">No picks yet</span>
              )}
            </div>
          </div>

          <div className="draft-side">
            <div className="draft-side-header">
              <div>
                <div className="section-title">Enemy side</div>
                <div className="section-caption">
                  Mirror their picks so the suggestions stay accurate.
                </div>
              </div>
            </div>
            <div className="section-title">Enemy picks</div>
            <div className="chips-row">
              {state.enemyPicks.map((id) => {
                const b = BRAWLERS.find((x) => x.id === id);
                return (
                  <div key={id} className="chip">
                    {b?.image && <img src={b.image} alt={b.name} />}
                    <span className="chip-label-strong">{b?.name || id}</span>
                    <span className="chip-meta">Enemy</span>
                  </div>
                );
              })}
              {!state.enemyPicks.length && (
                <span className="chip-meta">No enemy picks yet</span>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
            gap: 10,
          }}
        >
          <div>
            <div className="section-title">Brawler search</div>
            <div className="section-caption">
              Type to filter quickly. Click a brawler, then confirm.
            </div>
          </div>
          <input
            className="inline-input"
            placeholder="Search by name…"
            value={state.search}
            onChange={(e) =>
              setState((prev) => ({ ...prev, search: e.target.value }))
            }
            style={{ maxWidth: 220 }}
          />
        </div>

        <div className="brawler-grid">
          {filteredBrawlers.map((b) => {
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
                type="button"
                className={classNames}
                onClick={() => handleBrawlerClick(b.id)}
                disabled={takenSet.has(b.id)}
              >
                {b.image && <img src={b.image} alt={b.name} loading="lazy" />}
                <div className="brawler-name">
                  {b.name}
                  {isPending && (
                    <span style={{ color: "#38bdf8", display: "block" }}>
                      Pending
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1", marginTop: 8 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Recommended picks</div>
            <div className="card-subtitle">
              Suggestions using Worlds-style data, map mode, bans and comp shape.
            </div>
          </div>
        </div>

        {state.phase === "bans" && (
          <div className="section-caption">
            Lock all six bans first — suggestions will appear once picks start.
          </div>
        )}

        {state.phase !== "bans" && recommendations.length === 0 && (
          <div className="section-caption">
            No clear read yet. Try adding more picks or adjusting the bans.
          </div>
        )}

        {state.phase !== "bans" && recommendations.length > 0 && (
          <div className="recommendations-list">
            {recommendations.map((r) => (
              <div
                key={r.id}
                className="rec-card"
                style={
                  r.mustPick
                    ? {
                        borderImage:
                          "linear-gradient(120deg,#f97316,#facc15,#22c55e,#38bdf8,#a855f7) 1",
                        borderWidth: 2,
                        borderStyle: "solid",
                      }
                    : undefined
                }
              >
                <div>
                  {r.image && (
                    <img
                      src={r.image}
                      alt={r.name}
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}
                </div>
                <div className="rec-card-main">
                  <div className="rec-header-row">
                    <div>
                      <div className="rec-title">{r.name}</div>
                      <div className="rec-tags">
                        {r.tags.map((t) => (
                          <span key={t} className="pill">
                            {t}
                          </span>
                        ))}
                        {r.mustPick && (
                          <span className="rec-badge-must">MUST PICK</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => handleUseRecommendation(r.id)}
                    >
                      Use this pick
                    </button>
                  </div>
                  <div className="rec-explainer">
                    {advanced ? r.longExplanation : r.shortExplanation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
