import { useMemo, useState, useRef } from "react";
import { MAPS } from "../data/maps";
import { BRAWLERS } from "../data/brawlers";
import {
  getRecommendations,
  getBanSuggestions,
  analyzeDraftState,
  getAllRoles,
  getModeIntel,
  getMapIntel,
  getPostDraftAnalysis,
} from "../logic/recommendationEngine";

const MODES = ["Gem Grab", "Brawl Ball", "Bounty", "Heist", "Hot Zone", "Knockout"];
const TOTAL_BANS = 6;
const PICK_PATTERN = ["A", "B", "B", "A", "A", "B"];
const ROLE_DATA = getAllRoles();
const ROLE_ORDER = ["Tank", "Assassin", "Sharpshooter", "Support", "Control", "Thrower", "Damage"];

const BRAWLER_INDEX = Object.fromEntries(BRAWLERS.map((b) => [b.id, b]));

function groupBrawlersByRole(brawlers) {
  const groups = {};
  for (const role of ROLE_ORDER) groups[role] = [];
  for (const b of brawlers) {
    const primary = ROLE_DATA[b.id]?.roles?.[0] || "Damage";
    (groups[primary] || groups["Damage"]).push(b);
  }
  return groups;
}

function BrawlerImg({ src, name, size = 48, className = "" }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div
        className={`img-placeholder ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.35 }}
      >
        {name?.[0] || "?"}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      className={className}
      style={{ width: size, height: size }}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}

function getInitialState() {
  return {
    mode: null,
    mapId: null,
    firstPick: null,
    bans: [],
    ourPicks: [],
    enemyPicks: [],
    phase: "setup",
    search: "",
    pendingPick: null,
  };
}

export function DraftSimulator() {
  const [state, setState] = useState(getInitialState);
  const gridRef = useRef(null);

  const currentMap = useMemo(
    () => MAPS.find((m) => m.id === state.mapId) || null,
    [state.mapId]
  );

  const mapsForMode = useMemo(() => {
    if (!state.mode) return [];
    const normalize = (s = "") => s.toLowerCase().replace(/[\s_-]/g, "").replace(/mode/g, "");
    const target = normalize(state.mode);
    const primary = MAPS.filter((m) => normalize(m.mode) === target);
    return primary.length > 0
      ? primary
      : MAPS.filter((m) => {
          const mm = normalize(m.mode);
          return mm.includes(target) || target.includes(mm);
        });
  }, [state.mode]);

  const takenSet = useMemo(
    () => new Set([...state.bans, ...state.ourPicks, ...state.enemyPicks]),
    [state.bans, state.ourPicks, state.enemyPicks]
  );

  const setupReady = state.firstPick !== null && !!state.mode && !!state.mapId;

  // ── Setup intel ──
  const modeIntel = useMemo(() => getModeIntel(state.mode), [state.mode]);
  const mapIntel = useMemo(() => getMapIntel(state.mapId), [state.mapId]);

  const currentPickInfo = useMemo(() => {
    if (state.phase === "setup") return { label: "Setup", side: null, pickingIsUs: false };
    if (state.phase === "bans") {
      const num = state.bans.length + 1;
      return { label: `Ban ${num}/${TOTAL_BANS}`, side: num % 2 === 1 ? "Your ban" : "Enemy ban", pickingIsUs: true };
    }
    const total = state.ourPicks.length + state.enemyPicks.length;
    if (total >= 6 || state.phase === "done") return { label: "Done", side: null, pickingIsUs: false };
    const turnLetter = PICK_PATTERN[total];
    const pickingIsUs = turnLetter === (state.firstPick ? "A" : "B");
    return { label: `Pick ${total + 1}/6`, side: pickingIsUs ? "Your pick" : "Enemy pick", pickingIsUs };
  }, [state.phase, state.bans.length, state.ourPicks.length, state.enemyPicks.length, state.firstPick]);

  const isOurTurn = state.phase === "picks" && !!currentMap && currentPickInfo.pickingIsUs;

  const banSuggestions = useMemo(() => {
    if (state.phase !== "bans" || !currentMap) return [];
    return getBanSuggestions({ mapId: currentMap.id, mode: state.mode }).filter((b) => !takenSet.has(b.id));
  }, [state.phase, currentMap, state.mode, takenSet]);

  const { recommendations, draftAnalysis: pickAnalysis } = useMemo(() => {
    if (!isOurTurn || !currentMap) return { recommendations: [], draftAnalysis: null };
    try {
      return getRecommendations({ mapId: currentMap.id, ourPicks: state.ourPicks, enemyPicks: state.enemyPicks, bans: state.bans, advanced: true });
    } catch { return { recommendations: [], draftAnalysis: null }; }
  }, [isOurTurn, currentMap, state.ourPicks, state.enemyPicks, state.bans]);

  const liveAnalysis = useMemo(() => {
    if (state.phase === "setup" || !currentMap) return null;
    if (state.ourPicks.length === 0 && state.enemyPicks.length === 0) return null;
    return analyzeDraftState(state.ourPicks, state.enemyPicks, currentMap);
  }, [state.phase, state.ourPicks, state.enemyPicks, currentMap]);

  const draftAnalysis = pickAnalysis || liveAnalysis;

  // ── Post-draft analysis ──
  const postDraft = useMemo(() => {
    if (state.phase !== "done" || !currentMap) return null;
    if (state.ourPicks.length !== 3 || state.enemyPicks.length !== 3) return null;
    return getPostDraftAnalysis(state.ourPicks, state.enemyPicks, currentMap);
  }, [state.phase, state.ourPicks, state.enemyPicks, currentMap]);

  const recommendationTiers = useMemo(() => {
    const m = new Map();
    recommendations.forEach((r, i) => {
      if (r.mustPick) m.set(r.id, "must");
      else if (i === 0) m.set(r.id, "meta");
      else if (i <= 2) m.set(r.id, "strong");
      else m.set(r.id, "flex");
    });
    return m;
  }, [recommendations]);

  const visibleBrawlers = useMemo(() => {
    if (!setupReady || state.phase === "setup") return [];
    const q = state.search.trim().toLowerCase();
    const available = BRAWLERS.filter((b) => !takenSet.has(b.id));
    if (!q) return available;
    return available.filter((b) => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
  }, [setupReady, state.phase, state.search, takenSet]);

  const groupedBrawlers = useMemo(() => groupBrawlersByRole(visibleBrawlers), [visibleBrawlers]);
  const isSearching = state.search.trim().length > 0;

  const ourTeam = useMemo(() => state.ourPicks.map((id) => BRAWLER_INDEX[id]).filter(Boolean), [state.ourPicks]);
  const enemyTeam = useMemo(() => state.enemyPicks.map((id) => BRAWLER_INDEX[id]).filter(Boolean), [state.enemyPicks]);

  const pendingBrawler = state.pendingPick ? BRAWLER_INDEX[state.pendingPick] : null;

  // ── Handlers ──

  function resetDraft() { setState(getInitialState()); }

  function selectAndConfirm(id) {
    if (takenSet.has(id) || state.phase === "setup") return;
    setState((prev) => ({ ...prev, pendingPick: id }));
  }

  function confirmPending() {
    if (!state.pendingPick || state.phase === "setup") return;
    const id = state.pendingPick;

    if (state.phase === "bans") {
      if (state.bans.length >= TOTAL_BANS) return;
      setState((prev) => {
        const bans = [...prev.bans, id];
        return { ...prev, bans, pendingPick: null, phase: bans.length >= TOTAL_BANS ? "picks" : "bans" };
      });
      return;
    }

    setState((prev) => {
      const our = [...prev.ourPicks], enemy = [...prev.enemyPicks];
      const total = our.length + enemy.length;
      if (total >= 6) return { ...prev, pendingPick: null, phase: "done" };
      const turnLetter = PICK_PATTERN[total];
      if (turnLetter === (prev.firstPick ? "A" : "B")) our.push(id);
      else enemy.push(id);
      const newTotal = our.length + enemy.length;
      return { ...prev, ourPicks: our, enemyPicks: enemy, pendingPick: null, phase: newTotal >= 6 ? "done" : "picks" };
    });
  }

  // ── Render ──

  return (
    <div className="page">
      <div className="page-header">
        <h1>Draft Simulator</h1>
        <p className="page-subtitle">BSC-style drafts with bans, picks, and live coaching.</p>
      </div>

      {/* ── SETUP ── */}
      {state.phase === "setup" && (
        <div className="setup-layout">
          <section className="section-card setup-main">
            <div className="draft-setup-steps">
              <div>
                <div className="step-header">
                  <span className={`step-number ${state.firstPick !== null ? "step-done" : ""}`}>1</span>
                  <h3>Side</h3>
                </div>
                <div className="side-toggle">
                  <button className={state.firstPick === true ? "chip chip-primary" : "chip chip-ghost"} onClick={() => setState((p) => ({ ...p, firstPick: true }))}>First pick</button>
                  <button className={state.firstPick === false ? "chip chip-primary" : "chip chip-ghost"} onClick={() => setState((p) => ({ ...p, firstPick: false }))}>Last pick</button>
                </div>
              </div>

              <div>
                <div className="step-header">
                  <span className={`step-number ${state.mode ? "step-done" : ""}`}>2</span>
                  <h3>Mode</h3>
                </div>
                {state.firstPick === null ? (
                  <p className="muted small">Pick your side first.</p>
                ) : (
                  <div className="mode-chips">
                    {MODES.map((mode) => (
                      <button key={mode} className={state.mode === mode ? "chip chip-primary" : "chip chip-ghost"} onClick={() => setState((p) => ({ ...p, mode, mapId: null }))}>{mode}</button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="step-header">
                  <span className={`step-number ${state.mapId ? "step-done" : ""}`}>3</span>
                  <h3>Map</h3>
                </div>
                {!state.mode ? (
                  <p className="muted small">Pick a mode first.</p>
                ) : (
                  <div className="map-grid">
                    {mapsForMode.map((m) => (
                      <button key={m.id} className={state.mapId === m.id ? "map-tile map-tile-selected" : "map-tile"} onClick={() => setState((p) => ({ ...p, mapId: m.id }))}>
                        <div className="map-image" style={{ backgroundImage: `url(${m.image})` }} />
                        <div className="map-label">
                          <div className="map-name">{m.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="start-draft-row">
              <button className="primary-button" onClick={() => setState((p) => ({ ...p, phase: "bans", pendingPick: null }))} disabled={!setupReady}>
                {setupReady ? "Start draft" : "Complete all 3 steps"}
              </button>
            </div>
          </section>

          {/* ── Intel Side Panel ── */}
          <aside className="intel-panel">
            {!state.mode && !modeIntel && (
              <div className="intel-empty">
                <div className="intel-empty-icon">?</div>
                <p>Select a mode to see meta intel</p>
                <p className="muted small">Ban priorities, top picks, and mode tips powered by BSC 2026 data.</p>
              </div>
            )}

            {modeIntel && (
              <div className="intel-section">
                <div className="intel-header">
                  <span className="intel-label">{state.mode}</span>
                  <span className="intel-sub">{modeIntel.mapCount} maps</span>
                </div>
                <p className="intel-insight">{modeIntel.insight}</p>

                {modeIntel.topPicks.length > 0 && (
                  <div className="intel-block">
                    <div className="intel-block-title">Top picks</div>
                    <div className="intel-pick-list">
                      {modeIntel.topPicks.map((p) => (
                        <div key={p.id} className="intel-pick-row">
                          <BrawlerImg src={p.image} name={p.name} size={24} className="intel-pick-img" />
                          <span className="intel-pick-name">{p.name}</span>
                          <span className="intel-pick-stat">{p.picks}x picked</span>
                          {p.wr !== null && <span className={`intel-pick-wr ${p.wr >= 60 ? "wr-high" : p.wr < 45 ? "wr-low" : ""}`}>{p.wr}%</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {modeIntel.bans.length > 0 && (
                  <div className="intel-block">
                    <div className="intel-block-title">Ban priority</div>
                    <div className="intel-ban-list">
                      {modeIntel.bans.map((b) => (
                        <div key={b.id} className="intel-ban-row">
                          <BrawlerImg src={b.image} name={b.name} size={20} className="intel-ban-img" />
                          <span className="intel-ban-name">{b.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {mapIntel && (
              <div className="intel-section intel-map-section">
                <div className="intel-map-preview" style={{ backgroundImage: `url(${mapIntel.map.image})` }}>
                  <div className="intel-map-overlay">
                    <div className="intel-map-name">{mapIntel.map.name}</div>
                  </div>
                </div>

                <div className="intel-traits">
                  <span className="trait-chip">Walls: {mapIntel.traits.walls || "?"}</span>
                  <span className="trait-chip">Bushes: {mapIntel.traits.bushes || "?"}</span>
                  <span className="trait-chip">Openness: {mapIntel.traits.openness || "?"}</span>
                  {mapIntel.traits.zones && <span className="trait-chip">{mapIntel.traits.zones} zone{mapIntel.traits.zones > 1 ? "s" : ""}</span>}
                </div>

                {mapIntel.traits.notes && (
                  <p className="intel-map-notes">{mapIntel.traits.notes}</p>
                )}

                {mapIntel.topPicks.length > 0 && (
                  <div className="intel-block">
                    <div className="intel-block-title">BSC picks on this map</div>
                    <div className="intel-pick-list">
                      {mapIntel.topPicks.map((p) => (
                        <div key={p.id} className="intel-pick-row">
                          <BrawlerImg src={p.image} name={p.name} size={24} className="intel-pick-img" />
                          <span className="intel-pick-name">{p.name}</span>
                          <span className="intel-pick-stat">{p.picks}x</span>
                          {p.wr !== null && <span className={`intel-pick-wr ${p.wr >= 60 ? "wr-high" : p.wr < 45 ? "wr-low" : ""}`}>{p.wr}%</span>}
                        </div>
                      ))}
                    </div>
                    {mapIntel.totalPicks > 0 && (
                      <div className="intel-total">{mapIntel.totalPicks} total picks across BSC 2026</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ── LIVE DRAFT ── */}
      {state.phase !== "setup" && (
        <>
          {/* Sticky confirm bar */}
          <div className="sticky-confirm-bar">
            <div className="confirm-bar-inner">
              <div className="confirm-bar-left">
                <span className={`phase-badge phase-${state.phase}`}>
                  {state.phase === "bans" ? "BANS" : state.phase === "picks" ? "PICKS" : "DONE"}
                </span>
                <span className="confirm-bar-label">{currentPickInfo.label}</span>
                {currentPickInfo.side && <span className="confirm-bar-side">{currentPickInfo.side}</span>}
                {/* Map indicator */}
                {currentMap && (
                  <div className="confirm-bar-map">
                    <div className="confirm-bar-map-thumb" style={{ backgroundImage: `url(${currentMap.image})` }} />
                    <span className="confirm-bar-map-name">{currentMap.name}</span>
                  </div>
                )}
              </div>
              <div className="confirm-bar-right">
                {pendingBrawler && (
                  <div className="confirm-bar-pending">
                    <BrawlerImg src={pendingBrawler.image} name={pendingBrawler.name} size={28} className="confirm-bar-img" />
                    <span>{pendingBrawler.name}</span>
                  </div>
                )}
                <button className="primary-button" onClick={confirmPending} disabled={!state.pendingPick}>
                  {state.pendingPick ? "Confirm" : "Select a brawler"}
                </button>
                <button className="reset-button" onClick={resetDraft}>Reset</button>
              </div>
            </div>
          </div>

          <div className="draft-content">
            {/* ── Top row: teams ── */}
            <div className="draft-teams-row">
              <div className="team-card team-card-you">
                <div className="team-card-header">Your team</div>
                <div className="team-slots">
                  {state.bans.length > 0 && (
                    <div className="team-bans">
                      {state.bans.map((id) => {
                        const b = BRAWLER_INDEX[id];
                        return (
                          <div key={id} className="mini-chip mini-chip-ban" title={b?.name}>
                            <BrawlerImg src={b?.image} name={b?.name} size={22} className="mini-chip-img" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="team-picks">
                    {[0, 1, 2].map((i) => {
                      const b = ourTeam[i];
                      return (
                        <div key={i} className={`pick-slot ${b ? "pick-slot-filled" : ""}`}>
                          {b ? <BrawlerImg src={b.image} name={b.name} size={44} className="pick-slot-img" /> : <span className="pick-slot-empty">{i + 1}</span>}
                          {b && <div className="pick-slot-name">{b.name}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="vs-divider">VS</div>

              <div className="team-card team-card-enemy">
                <div className="team-card-header">Enemy team</div>
                <div className="team-slots">
                  <div className="team-picks">
                    {[0, 1, 2].map((i) => {
                      const b = enemyTeam[i];
                      return (
                        <div key={i} className={`pick-slot ${b ? "pick-slot-filled" : ""}`}>
                          {b ? <BrawlerImg src={b.image} name={b.name} size={44} className="pick-slot-img" /> : <span className="pick-slot-empty">{i + 1}</span>}
                          {b && <div className="pick-slot-name">{b.name}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Live coaching feedback ── */}
            {draftAnalysis && (draftAnalysis.warnings.length > 0 || draftAnalysis.needs.length > 0) && (
              <div className="live-feedback">
                {draftAnalysis.warnings.map((w, i) => (
                  <div key={i} className="draft-warning">{w}</div>
                ))}
                {draftAnalysis.needs.length > 0 && (
                  <div className="draft-need">Your team needs: <strong>{draftAnalysis.needs.join(", ")}</strong></div>
                )}
              </div>
            )}

            {/* ── Ban suggestions ── */}
            {state.phase === "bans" && banSuggestions.length > 0 && (
              <div className="ban-suggestions">
                <h3>Suggested bans — {state.mode} on {currentMap?.name}</h3>
                <div className="ban-suggestion-list">
                  {banSuggestions.map((b) => (
                    <button key={b.id} className={`ban-suggestion-card ${state.pendingPick === b.id ? "ban-suggestion-selected" : ""}`} onClick={() => selectAndConfirm(b.id)}>
                      <BrawlerImg src={b.image} name={b.name} size={36} className="ban-suggestion-img" />
                      <div className="ban-suggestion-info">
                        <div className="ban-suggestion-name">{b.name}</div>
                        <div className="ban-suggestion-reason">{b.reason}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Recommendations ── */}
            {isOurTurn && recommendations.length > 0 && (
              <div className="recommendations-panel">
                <h3>Recommended picks</h3>
                <div className="recommendation-list">
                  {recommendations.map((r) => {
                    const tier = recommendationTiers.get(r.id);
                    const cls = [
                      "recommendation-card",
                      tier === "must" && "recommendation-card-must",
                      tier === "meta" && "recommendation-card-meta",
                      tier === "strong" && "recommendation-card-strong",
                      tier === "flex" && "recommendation-card-flex",
                    ].filter(Boolean).join(" ");
                    return (
                      <button key={r.id} className={cls} onClick={() => selectAndConfirm(r.id)}>
                        <BrawlerImg src={r.image} name={r.name} size={44} className="recommendation-image" />
                        <div className="recommendation-body">
                          <div className="recommendation-top">
                            <span className="recommendation-name">{r.name}</span>
                            {tier === "must" && <span className="badge badge-must">MUST PICK</span>}
                            {tier === "meta" && <span className="badge badge-meta">META</span>}
                            {tier === "strong" && <span className="badge badge-strong">STRONG</span>}
                            {tier === "flex" && <span className="badge badge-flex">FLEX</span>}
                          </div>
                          <p className="recommendation-explanation">
                            {r.longExplanation}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {state.phase === "picks" && !isOurTurn && (
              <div className="enemy-turn-notice">
                Enemy is picking — select their choice from the grid below so coaching stays accurate.
              </div>
            )}

            {/* ── Brawler Grid ── */}
            {state.phase !== "done" && (
              <div className="grid-section" ref={gridRef}>
                <input
                  type="text"
                  value={state.search}
                  onChange={(e) => setState((p) => ({ ...p, search: e.target.value }))}
                  placeholder="Search brawler..."
                  className="search-input"
                />

                {isSearching ? (
                  <div className="brawler-grid brawler-grid-compact">
                    {visibleBrawlers.map((b) => renderTile(b, state, takenSet, recommendationTiers, selectAndConfirm))}
                  </div>
                ) : (
                  <div className="brawler-groups">
                    {ROLE_ORDER.map((role) => {
                      const group = groupedBrawlers[role];
                      if (!group || group.length === 0) return null;
                      return (
                        <div key={role} className="brawler-role-group">
                          <div className="role-group-header">
                            <span className="role-group-label">{role}s</span>
                            <span className="role-group-count">{group.length}</span>
                          </div>
                          <div className="brawler-grid brawler-grid-compact">
                            {group.map((b) => renderTile(b, state, takenSet, recommendationTiers, selectAndConfirm))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Post-Draft Analysis ── */}
          {state.phase === "done" && postDraft && (
            <section className="post-draft">
              {/* Win probability */}
              <div className="post-draft-header">
                <h3>Draft Analysis</h3>
                <div className="win-pct-row">
                  <div className="win-pct-bar-container">
                    <div className="win-pct-label-left">You</div>
                    <div className="win-pct-bar">
                      <div
                        className={`win-pct-fill ${postDraft.winPct >= 55 ? "win-pct-favored" : postDraft.winPct <= 45 ? "win-pct-unfavored" : "win-pct-even"}`}
                        style={{ width: `${postDraft.winPct}%` }}
                      >
                        <span className="win-pct-text">{postDraft.winPct}%</span>
                      </div>
                      <div className="win-pct-enemy-fill" style={{ width: `${100 - postDraft.winPct}%` }}>
                        <span className="win-pct-text">{100 - postDraft.winPct}%</span>
                      </div>
                    </div>
                    <div className="win-pct-label-right">Enemy</div>
                  </div>
                </div>
                <p className="post-draft-verdict">{postDraft.verdict}</p>
              </div>

              {/* Final warnings */}
              {draftAnalysis && draftAnalysis.warnings.length > 0 && (
                <div className="live-feedback">
                  {draftAnalysis.warnings.map((w, i) => (
                    <div key={i} className="draft-warning">{w}</div>
                  ))}
                </div>
              )}

              {/* How to play it */}
              {postDraft.tips.length > 0 && (
                <div className="how-to-play">
                  <h3>How to play it</h3>
                  <div className="tips-list">
                    {postDraft.tips.map((t) => (
                      <div key={t.id} className="tip-card">
                        <div className="tip-card-header">
                          <BrawlerImg src={t.image} name={t.name} size={36} className="tip-card-img" />
                          <div>
                            <div className="tip-card-name">{t.name}</div>
                            <div className="tip-card-role">{t.role}</div>
                          </div>
                        </div>
                        <ul className="tip-card-list">
                          {t.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="post-draft-actions">
                <button className="primary-button" onClick={resetDraft}>New draft</button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function renderTile(b, state, takenSet, recommendationTiers, onClick) {
  const isPending = state.pendingPick === b.id;
  const tier = recommendationTiers.get(b.id);
  const cls = [
    "brawler-tile",
    takenSet.has(b.id) && "disabled",
    tier && "recommended",
    tier === "must" && "must",
    tier === "meta" && "tier-meta",
    tier === "strong" && "tier-strong",
    tier === "flex" && "tier-flex",
    isPending && "tile-pending",
  ].filter(Boolean).join(" ");

  return (
    <button key={b.id} className={cls} onClick={() => onClick(b.id)} disabled={takenSet.has(b.id)}>
      <BrawlerImg src={b.image} name={b.name} size={44} className="brawler-portrait" />
      <div className="brawler-name">{b.name}</div>
      {tier && !isPending && <span className={`tier-dot tier-dot-${tier}`} />}
      {isPending && <div className="pending-label">PICK</div>}
    </button>
  );
}
