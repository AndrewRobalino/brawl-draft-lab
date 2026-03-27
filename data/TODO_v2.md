# Draft Lab v2.0 — TODO

## Status: WIP (March 2026)

### Completed This Session
- [x] Scraped all 100 games of BSC 2026 March Monthly Finals draft data (4 regions)
- [x] Full statistical analysis: pick rates, ban rates, win rates, presence, synergies
- [x] Rewrote `metaByMap.js` with real competitive pick counts
- [x] Rewrote `recommendationEngine.js` — 9 scoring factors, data-backed explanations
- [x] Added missing brawlers: Pierce, Glowbert, Najia, Sirius (101 total)
- [x] Fixed 4 wrong map-mode assignments (Belle's Rock, Open Business, Dueling Beetles, Hideout)
- [x] Added missing maps: Double Swoosh, Out in the Open
- [x] Fixed `public/assests/` → `public/assets/` typo (all images were 404ing)
- [x] Removed fake win chance calculation
- [x] Updated branding to BSC 2026

### Still TODO

#### Data & Engine
- [ ] Deep dive into Brawl Stars mechanics/interactions from internet sources (brawler kits, buffies, interactions) to better inform engine logic
- [ ] Add first-pick data if it becomes available (Liquipedia `firstpick=` field was empty)
- [ ] Flesh out SYNERGIES table — currently only ~10 pairs, should be 30+
- [ ] Flesh out HARD_COUNTERS — currently ~15, needs more granular matchup data
- [ ] Add ban recommendation logic to the UI (engine exports `getBanSuggestions()` but UI doesn't use it)
- [ ] Add per-map ban priority data
- [ ] Add global ban phase to draft flow (2 blind bans per team before picks)
- [ ] Validate/tune scoring weights with more competitive data

#### Missing Assets
- [ ] Brawler images: `glowbert.webp`, `pierce.webp`, `najia.webp`, `sirius.webp`
- [ ] Map images: `double_swoosh.png`, `out_in_the_open.png`, `sneaky_fields.png`, `shooting_star.png`, `safe_zone.png`

#### UI/UX
- [ ] Ban suggestions panel in draft UI
- [ ] Global ban phase UI
- [ ] Show pick/ban rates on hover or in recommendation cards
- [ ] Better mobile responsiveness
- [ ] Visual polish — the UI is functional but not impressive yet
- [ ] Loading states for recommendation calculations
- [ ] Map image display in draft view

#### Code Quality
- [ ] Add prop types or TypeScript
- [ ] Unit tests for recommendation engine scoring
- [ ] Extract magic numbers into named constants
- [ ] Consider splitting `recommendationEngine.js` — it's getting large (~400 lines)
