import { BRAWLERS } from "../data/brawlers";
import { MAPS } from "../data/maps";
import { META_BY_MAP } from "../data/metaByMap";

const INDEX = Object.fromEntries(BRAWLERS.map((b) => [b.id, b]));

// ============================================================
// ROLE DATA — expanded from BSC 2026 March competitive data
// roles: primary archetype(s)
// tags: playstyle descriptors
// antiTank: true if this brawler punishes tanks
// ============================================================
const ROLE_DATA = {
  // --- Tanks ---
  frank:    { roles: ["Tank"], tags: ["Stun", "High HP"], antiTank: false },
  bibi:     { roles: ["Tank"], tags: ["Knockback", "Lane bully", "Buffy"], antiTank: false },
  bull:     { roles: ["Tank"], tags: ["Close burst", "Buffy", "Lifesteal"], antiTank: false },
  el_primo: { roles: ["Tank"], tags: ["Grab", "High HP"], antiTank: false },
  rosa:     { roles: ["Tank"], tags: ["Sustain", "Bush"], antiTank: false },
  jacky:    { roles: ["Tank"], tags: ["Pull", "AoE"], antiTank: false },
  ash:      { roles: ["Tank"], tags: ["Snowball"], antiTank: false },
  darryl:   { roles: ["Tank"], tags: ["Roll engage", "Burst"], antiTank: false },
  buzz:     { roles: ["Tank"], tags: ["Hook engage"], antiTank: false },
  meg:      { roles: ["Tank"], tags: ["Mech hybrid"], antiTank: false },
  sam:      { roles: ["Tank"], tags: ["Scrapper"], antiTank: true },
  doug:     { roles: ["Tank", "Support"], tags: ["Revive"], antiTank: false },
  hank:     { roles: ["Tank"], tags: ["Charge burst"], antiTank: false },
  draco:    { roles: ["Tank"], tags: ["Dash", "AoE"], antiTank: false },

  // --- Assassins ---
  mortis:    { roles: ["Assassin"], tags: ["Dash", "Buffy", "Lane killer"], antiTank: false },
  leon:      { roles: ["Assassin"], tags: ["Invis", "Buffy", "Clone swap", "Universal threat"], antiTank: false },
  crow:      { roles: ["Assassin", "Control"], tags: ["Poison", "Buffy", "Bouncing kunai", "Nerfed Mar30"], antiTank: false },
  cordelius: { roles: ["Assassin"], tags: ["Shadow realm", "Anti-heal"], antiTank: true },
  edgar:     { roles: ["Assassin"], tags: ["Lifesteal jump"], antiTank: false },
  fang:      { roles: ["Assassin"], tags: ["Kick chain"], antiTank: false },
  mico:      { roles: ["Assassin"], tags: ["Dash", "Silence"], antiTank: false },
  shade:     { roles: ["Assassin"], tags: ["Stealth", "Burst"], antiTank: false },
  kaze:      { roles: ["Assassin"], tags: ["Slash", "High WR"], antiTank: false },
  melodie:   { roles: ["Assassin"], tags: ["Orbit zone"], antiTank: false },
  kenji:     { roles: ["Assassin"], tags: ["Dash combo"], antiTank: false },
  lily:      { roles: ["Assassin", "Damage"], tags: ["Burst", "High WR"], antiTank: false },

  // --- Sharpshooters ---
  piper:  { roles: ["Sharpshooter"], tags: ["Long range"], antiTank: false },
  belle:  { roles: ["Sharpshooter"], tags: ["Mark", "Bounty specialist"], antiTank: false },
  brock:  { roles: ["Sharpshooter"], tags: ["AoE", "Knockout specialist"], antiTank: false },
  colt:   { roles: ["Sharpshooter"], tags: ["High DPS", "Buffy", "Heist specialist"], antiTank: true },
  rico:   { roles: ["Sharpshooter"], tags: ["Wall bounce"], antiTank: false },
  nani:   { roles: ["Sharpshooter"], tags: ["Burst snipe"], antiTank: false },
  mandy:  { roles: ["Sharpshooter"], tags: ["Piercing"], antiTank: false },
  pierce: { roles: ["Sharpshooter"], tags: ["Lane control", "Versatile"], antiTank: false },
  "8_bit": { roles: ["Sharpshooter"], tags: ["Turret DPS", "Heist pick"], antiTank: true },

  // --- Support ---
  poco:  { roles: ["Support"], tags: ["Team heal", "Brawl Ball staple"], antiTank: false },
  pam:   { roles: ["Support", "Mid"], tags: ["Turret heal", "Lane anchor"], antiTank: false },
  gus:   { roles: ["Support", "Mid"], tags: ["Shield", "Knockout pick"], antiTank: true },
  byron: { roles: ["Support"], tags: ["Heal/poison", "Knockout pick"], antiTank: false },
  max:   { roles: ["Support", "Hybrid"], tags: ["Speed boost"], antiTank: false },
  ruffs: { roles: ["Support"], tags: ["Power-up", "Hot Zone staple"], antiTank: false },

  // --- Control ---
  emz:     { roles: ["Control"], tags: ["Anti-tank cone", "Buffy"], antiTank: true },
  spike:   { roles: ["Control", "Damage"], tags: ["Tank shredder", "Versatile"], antiTank: true },
  gene:    { roles: ["Control"], tags: ["Pull", "Knockout/Bounty pick"], antiTank: false },
  sandy:   { roles: ["Control"], tags: ["Sandstorm", "Gem Grab pick"], antiTank: false },
  tara:    { roles: ["Control"], tags: ["Pull super"], antiTank: false },
  lou:     { roles: ["Control"], tags: ["Freeze", "Hot Zone king"], antiTank: true },
  otis:    { roles: ["Control"], tags: ["Silence", "Brawl Ball pick"], antiTank: false },
  charlie: { roles: ["Control"], tags: ["Zone", "Brawl Ball specialist"], antiTank: false },
  eve:     { roles: ["Control"], tags: ["Air", "Knockout specialist"], antiTank: false },
  bo:      { roles: ["Control"], tags: ["Mines", "Vision"], antiTank: false },
  ollie:   { roles: ["Control"], tags: ["Bounce zone"], antiTank: false },
  glowbert:{ roles: ["Support", "Damage"], tags: ["Heal/damage flex", "Perma-banned"], antiTank: false },

  // --- Throwers ---
  barley:   { roles: ["Thrower"], tags: ["Area denial"], antiTank: false },
  tick:     { roles: ["Thrower"], tags: ["Zone control"], antiTank: false },
  sprout:   { roles: ["Thrower"], tags: ["Wall control"], antiTank: false },
  dynamike: { roles: ["Thrower"], tags: ["Burst"], antiTank: false },
  grom:     { roles: ["Thrower"], tags: ["Long range"], antiTank: false },
  squeak:   { roles: ["Thrower", "Control"], tags: ["Sticky zone"], antiTank: false },

  // --- Damage / Flex ---
  colette:  { roles: ["Damage"], tags: ["Tank cutter"], antiTank: true },
  clancy:   { roles: ["Damage"], tags: ["Scaling DPS", "Anti-tank conditional", "Buffed Mar30"], antiTank: true },
  amber:    { roles: ["Damage"], tags: ["Continuous beam", "Heist pick"], antiTank: false },
  bea:      { roles: ["Damage"], tags: ["Supercharged shot"], antiTank: true },
  meeple:   { roles: ["Damage"], tags: ["Versatile", "Brawl Ball pick"], antiTank: false },
  stu:      { roles: ["Damage"], tags: ["Dash", "Hot Zone staple"], antiTank: false },
  surge:    { roles: ["Damage"], tags: ["Upgrade stages"], antiTank: false },
  chester:  { roles: ["Damage"], tags: ["Random kit", "Most picked overall"], antiTank: false },
  mina:     { roles: ["Damage"], tags: ["Lifesteal"], antiTank: false },
  finx:     { roles: ["Damage"], tags: ["Hot Zone specialist"], antiTank: false },
  griff:    { roles: ["Damage"], tags: ["Burst spread"], antiTank: true },
  penny:    { roles: ["Damage"], tags: ["Turret"], antiTank: false },
  janet:    { roles: ["Damage"], tags: ["Fly", "Gem Grab pick"], antiTank: false },
  bonnie:   { roles: ["Damage"], tags: ["Form switch"], antiTank: false },
  r_t:      { roles: ["Damage"], tags: ["Knockout specialist", "Corner play"], antiTank: false },
  jae_yong: { roles: ["Damage"], tags: ["Knockout pick"], antiTank: false },
  kit:      { roles: ["Support", "Damage"], tags: ["Attach", "Bounty pick"], antiTank: false },

  // --- Other ---
  shelly:   { roles: ["Damage"], tags: ["Close range", "Buffy"], antiTank: true },
  jessie:   { roles: ["Damage"], tags: ["Turret"], antiTank: false },
  buster:   { roles: ["Tank", "Damage"], tags: ["Shield"], antiTank: false },
  lola:     { roles: ["Damage"], tags: ["Clone"], antiTank: false },
  moe:      { roles: ["Damage"], tags: ["Kick"], antiTank: false },
  mr_p:     { roles: ["Control"], tags: ["Spawn"], antiTank: false },
  pearl:    { roles: ["Damage"], tags: ["Heat", "SA meta"], antiTank: false },
  gray:     { roles: ["Control"], tags: ["Portal"], antiTank: false },
  willow:   { roles: ["Control"], tags: ["Mind control"], antiTank: false },
  ziggy:    { roles: ["Damage"], tags: ["Frequently banned"], antiTank: false },
  berry:    { roles: ["Damage"], tags: ["Splash"], antiTank: false },
  lumi:     { roles: ["Damage"], tags: ["Light"], antiTank: false },
  trunk:    { roles: ["Tank"], tags: ["Charge"], antiTank: false },
  juju:     { roles: ["Thrower"], tags: ["Curse zone"], antiTank: false },
  gigi:     { roles: ["Damage", "Control"], tags: ["Projectile", "Zone control", "Buffed Mar30"], antiTank: false },
  maisie:   { roles: ["Damage"], tags: ["Charged shot"], antiTank: true },
  najia:    { roles: ["Damage"], tags: ["Poison stacker", "Nerfed Mar30"], antiTank: false },
  sirius:   { roles: ["Assassin"], tags: ["Shadow clone"], antiTank: false },
};

const TANKS = new Set([
  "frank", "bibi", "bull", "el_primo", "rosa", "jacky", "ash",
  "darryl", "buzz", "meg", "sam", "doug", "hank", "draco", "trunk", "buster",
]);

// ============================================================
// BSC 2026 GLOBAL STATS — derived from 100 competitive games
// ============================================================

// Overall win rates when picked (minimum 5 picks for reliability)
const WIN_RATES = {
  // BSC 2026 March base + Mar 30 patch adjustments
  eve: 0.833, pam: 0.800, colt: 0.800, kaze: 0.750, lily: 0.700,
  lou: 0.692, nani: 0.667, mortis: 0.650, leon: 0.650, brock: 0.625,
  emz: 0.570, nita: 0.615, charlie: 0.611, shelly: 0.600, melodie: 0.600,
  darryl: 0.600, belle: 0.571, sandy: 0.571, penny: 0.571, kit: 0.556,
  ruffs: 0.524, pierce: 0.526, spike: 0.485, otis: 0.500, stu: 0.500,
  r_t: 0.500, crow: 0.470, chester: 0.481, bo: 0.471, gene: 0.462,
  gale: 0.438, bull: 0.410, bibi: 0.415, janet: 0.444,
  meeple: 0.400, rico: 0.385, squeak: 0.400, gus: 0.385,
  byron: 0.353, kenji: 0.231,
  // Mar 30 patch — new entries
  najia: 0.450, clancy: 0.480, gigi: 0.470, glowy: 0.460, sirius: 0.540,
};

// Mode-specific pick weights — from BSC 2026 mode analysis
// Higher = stronger in that mode based on actual competitive results
const MODE_WEIGHTS = {
  "Brawl Ball": {
    leon: 5, charlie: 5, max: 5, bibi: 4, meeple: 3, pierce: 3,
    emz: 2, poco: 3, gale: 2, chester: 2, otis: 2, stu: 2,
    el_primo: 2, bull: 2, nita: 2, buzz: 2, sirius: 3,
  },
  "Gem Grab": {
    chester: 5, lily: 4, otis: 4, sandy: 3, charlie: 3, emz: 2,
    mortis: 2, janet: 3, spike: 3, nita: 3, bibi: 2, ruffs: 2,
    pam: 2, shelly: 2, bo: 2, tara: 2, sirius: 3, leon: 3,
  },
  "Knockout": {
    eve: 5, gene: 5, brock: 4, crow: 4, r_t: 3, byron: 3,
    nani: 3, gus: 3, belle: 3, pierce: 3, bo: 2, leon: 2,
    squeak: 2, jae_yong: 2, pearl: 2, ollie: 2, darryl: 2,
  },
  "Hot Zone": {
    lou: 5, ruffs: 4, stu: 3, emz: 2, chester: 2, spike: 2,
    finx: 2, poco: 2, mina: 2, draco: 2, pierce: 2, kenji: 2,
    griff: 2, bibi: 1, bo: 2, mortis: 2, bull: 2,
    gigi: 2, clancy: 2, leon: 3,
  },
  "Bounty": {
    kaze: 5, belle: 5, pierce: 5, mortis: 4, gene: 3, spike: 3,
    kit: 3, gus: 3, nani: 3, crow: 2, squeak: 2, meeple: 2,
    kenji: 1, piper: 2, byron: 2,
  },
  "Heist": {
    kaze: 5, colt: 5, melodie: 4, belle: 4, lily: 3, rico: 2,
    amber: 2, bull: 3, byron: 2, "8_bit": 3, penny: 2,
    shade: 2, chuck: 2, ruffs: 2, charlie: 2, r_t: 2, nita: 2,
    clancy: 3,
  },
};

// Brawlers that should always be banned per-mode (from BSC ban data)
// Post Mar 30 patch — Crow still bannable but no longer auto-first-ban everywhere
// Sirius rising, Emz gadget gutted lowers her ban value
const MODE_BAN_PRIORITY = {
  "Brawl Ball": ["sirius", "crow", "chester", "leon", "otis"],
  "Gem Grab": ["sirius", "crow", "sandy", "chester", "otis"],
  "Knockout": ["angelo", "gene", "leon", "brock", "sirius"],
  "Hot Zone": ["sirius", "ziggy", "crow", "finx", "lou"],
  "Bounty": ["mortis", "sirius", "crow", "leon", "gene"],
  "Heist": ["sirius", "crow", "cordelius", "chuck", "nita"],
};

// ============================================================
// HARD COUNTER TABLE — expanded with BSC 2026 meta awareness
// ============================================================
const HARD_COUNTERS = {
  // ── Tanks ── Clancy added broadly as conditional anti-tank after Mar 30 buffs
  frank:    ["colette", "spike", "emz", "bea", "clancy", "shelly", "mortis"],
  bibi:     ["colette", "spike", "emz", "bea", "clancy", "mortis"],
  bull:     ["colette", "spike", "emz", "shelly", "bea", "clancy", "nita"],
  el_primo: ["colette", "spike", "emz", "crow", "clancy", "darryl"],
  rosa:     ["colette", "spike", "emz", "clancy", "piper", "bea"],
  darryl:   ["spike", "emz", "shelly", "clancy", "mortis", "crow"],
  meg:      ["colette", "spike", "emz", "clancy", "bea"],
  hank:     ["colette", "spike", "clancy", "belle"],
  draco:    ["colette", "spike", "emz", "frank"],
  ash:      ["colette", "spike", "emz", "clancy", "crow", "nita"],
  jacky:    ["colette", "spike", "emz", "stu"],
  buzz:     ["griff", "shelly", "emz"],
  sam:      ["bibi", "hank", "spike"],
  doug:     ["nani", "brock"],

  // ── Assassins ── high-HP brawlers and spread/AoE punish dive
  mortis:   ["shelly", "bull", "frank", "bibi", "spike", "tara", "darryl"],
  leon:     ["shelly", "bull", "frank", "emz", "tara"],
  crow:     ["shelly", "bull", "el_primo", "tara", "darryl"],
  edgar:    ["lou", "buzz", "shelly", "bull", "frank", "squeak"],
  fang:     ["shelly", "bull", "frank", "buzz", "gray"],
  mico:     ["shelly", "bull", "frank"],
  shade:    ["shelly", "bull", "frank"],
  kaze:     ["griff", "chester", "buzz"],
  melodie:  ["darryl", "bull", "rosa"],
  kenji:    ["shelly", "bull", "frank"],
  lily:     ["shelly", "bull", "frank"],
  cordelius:["frank", "bull"],
  sirius:   ["penny", "pierce", "tara", "bibi", "ziggy"],  // spread/pierce beats clones

  // ── Sharpshooters ── assassins close the gap
  piper:    ["mortis", "leon", "edgar", "fang", "nani", "mandy", "belle"],
  belle:    ["mandy", "nani", "crow", "lou"],
  rico:     ["spike", "shelly", "crow"],
  colt:     ["shelly", "el_primo", "bull", "tara"],
  nani:     ["stu", "mortis"],
  mandy:    ["crow", "nani", "mortis"],
  pierce:   ["mortis", "leon"],
  "8_bit":  ["max", "mortis", "leon"],

  // ── Support ── anti-heal and assassins threaten backline
  poco:     ["crow", "cordelius", "leon", "tara"],
  byron:    ["crow", "cordelius", "tick", "colette"],
  pam:      ["crow", "el_primo", "darryl"],
  ruffs:    ["el_primo", "bull", "mortis"],
  max:      ["stu"],
  gus:      ["mr_p", "shelly", "darryl"],

  // ── Control ── gap closers and out-rangers
  emz:      ["mortis", "leon", "ash"],
  sandy:    ["crow", "leon", "gale"],
  gene:     ["amber", "sprout"],
  tara:     ["pam", "poco", "crow"],
  lou:      ["belle", "stu"],
  otis:     ["hank", "mortis", "8_bit"],
  charlie:  ["penny", "barley", "juju", "tick"],  // throwers outrange her spiders
  eve:      ["hank", "mandy", "piper"],
  bo:       ["mortis", "frank"],

  // ── Throwers ── assassins and fast brawlers close gap
  barley:   ["mortis", "leon", "edgar", "fang"],
  tick:     ["mortis", "leon", "edgar", "mr_p"],
  dynamike: ["mortis", "leon", "edgar", "fang"],
  sprout:   ["amber", "mortis"],
  grom:     ["mortis", "leon", "edgar"],
  squeak:   ["hank", "bea"],

  // ── Damage / Flex ──
  colette:  ["byron"],
  clancy:   ["mortis", "leon", "edgar"],  // assassins punish ramp time
  chester:  ["hank"],
  penny:    ["jessie", "mortis", "brock"],
  spike:    ["colt", "el_primo", "tara"],
  janet:    ["brock", "hank", "tara"],
  buster:   ["tara", "mortis", "hank"],
  angelo:   ["edgar", "leon", "crow", "mortis"],
  kit:      ["mico", "melodie", "poco"],
  pearl:    ["ash", "jacky", "bibi"],
  chuck:    ["sandy", "bo", "emz"],
  griff:    ["penny", "hank", "shelly"],

  // ── Overrated pick punishment ──
  gale:     ["leon", "mortis", "charlie", "max"],
};

// ============================================================
// PAIR SYNERGIES — from BSC 2026 data (75%+ WR pairs)
// ============================================================
const SYNERGIES = {
  belle:   ["kaze"],
  kaze:    ["belle", "pierce", "gus"],
  pierce:  ["kaze", "emz", "mortis"],
  charlie: ["ruffs", "bibi"],
  bibi:    ["charlie", "meeple"],
  ruffs:   ["charlie", "lou"],
  lou:     ["ruffs", "spike", "gigi"],
  emz:     ["mortis", "pierce"],
  mortis:  ["emz", "pierce", "sirius"],
  crow:    ["brock", "pearl"],
  brock:   ["crow"],
  leon:    ["charlie", "pierce"],
  spike:   ["lou", "clancy"],
  // Mar 30 additions
  clancy:  ["spike", "emz", "colette"],  // pairs with zone control that lets him ramp
  gigi:    ["lou", "spike"],              // zone stacking synergy
  sirius:  ["mortis", "leon"],            // assassin duo pressure
  colette: ["clancy", "emz"],             // double anti-tank lockdown
};

// ============================================================
// ARCHETYPE SETS — for comp-level analysis
// ============================================================
const ASSASSINS = new Set([
  "mortis", "leon", "crow", "cordelius", "edgar", "fang", "mico",
  "shade", "kaze", "melodie", "kenji", "lily", "sirius",
]);

const ANTI_TANK_BRAWLERS = new Set(
  Object.entries(ROLE_DATA)
    .filter(([, v]) => v.antiTank)
    .map(([k]) => k)
);

const SUPPORTS = new Set(["poco", "pam", "gus", "byron", "max", "ruffs", "doug"]);

const THROWERS = new Set(["barley", "tick", "sprout", "dynamike", "grom", "squeak", "juju"]);

const SHARPSHOOTERS = new Set([
  "piper", "belle", "brock", "colt", "rico", "nani", "mandy", "pierce", "8_bit",
]);

// ============================================================
// DRAFT STATE ANALYSIS — understand both teams' comps
// ============================================================

function analyzeDraftState(ourPicks, enemyPicks, map) {
  const analysis = {
    our: { tanks: 0, assassins: 0, antiTank: 0, supports: 0, throwers: 0, sharpshooters: 0, roles: [] },
    enemy: { tanks: 0, assassins: 0, antiTank: 0, supports: 0, throwers: 0, sharpshooters: 0, roles: [] },
    warnings: [],
    needs: [],
  };

  // Count archetypes for our team
  for (const p of ourPicks) {
    if (TANKS.has(p)) analysis.our.tanks++;
    if (ASSASSINS.has(p)) analysis.our.assassins++;
    if (ANTI_TANK_BRAWLERS.has(p)) analysis.our.antiTank++;
    if (SUPPORTS.has(p)) analysis.our.supports++;
    if (THROWERS.has(p)) analysis.our.throwers++;
    if (SHARPSHOOTERS.has(p)) analysis.our.sharpshooters++;
    analysis.our.roles.push(...(ROLE_DATA[p]?.roles || []));
  }

  // Count archetypes for enemy team
  for (const p of enemyPicks) {
    if (TANKS.has(p)) analysis.enemy.tanks++;
    if (ASSASSINS.has(p)) analysis.enemy.assassins++;
    if (ANTI_TANK_BRAWLERS.has(p)) analysis.enemy.antiTank++;
    if (SUPPORTS.has(p)) analysis.enemy.supports++;
    if (THROWERS.has(p)) analysis.enemy.throwers++;
    if (SHARPSHOOTERS.has(p)) analysis.enemy.sharpshooters++;
    analysis.enemy.roles.push(...(ROLE_DATA[p]?.roles || []));
  }

  // Count how many enemy brawlers hard-counter each archetype we've picked
  let ourCounteredCount = 0;
  for (const p of ourPicks) {
    const counters = HARD_COUNTERS[p] || [];
    for (const enemy of enemyPicks) {
      if (counters.includes(enemy)) ourCounteredCount++;
    }
  }

  // ── Generate warnings ──

  // Enemy stacking anti-tank and we have tanks
  if (analysis.enemy.antiTank >= 2 && analysis.our.tanks >= 1) {
    analysis.warnings.push(`Enemy has ${analysis.enemy.antiTank} anti-tank brawlers — avoid picking more tanks.`);
  }
  if (analysis.enemy.antiTank >= 3) {
    analysis.warnings.push("Enemy comp is built to shred tanks. Picking any tank is very risky.");
  }

  // We're stacking one archetype too hard
  if (analysis.our.tanks >= 2) {
    analysis.warnings.push("Already running 2+ tanks — another tank makes your comp predictable and easy to counter.");
  }
  if (analysis.our.assassins >= 2) {
    analysis.warnings.push("Already running 2+ assassins — comp lacks sustain and zone control.");
  }
  if (analysis.our.sharpshooters >= 2) {
    analysis.warnings.push("Already running 2+ sharpshooters — vulnerable to dive and assassins.");
  }

  // Enemy has assassins and we have no answer
  if (analysis.enemy.assassins >= 2 && analysis.our.tanks === 0) {
    analysis.warnings.push("Enemy has multiple assassins and you have no tanky answer — they will dive your backline.");
  }

  // Enemy has tanks and we have no anti-tank
  if (analysis.enemy.tanks >= 2 && analysis.our.antiTank === 0) {
    analysis.warnings.push("Enemy is tank-heavy and you have no anti-tank — you need a tank shredder.");
  }

  // Many of our picks are being hard-countered
  if (ourCounteredCount >= 3) {
    analysis.warnings.push("Multiple brawlers on your team are hard-countered by the enemy comp. This draft is unfavorable.");
  }

  // ── Map trait warnings ──
  const traits = map?.traits || {};
  if (traits.openness === "open" && analysis.our.tanks >= 2) {
    analysis.warnings.push("This is an open map — your tanks have no cover to approach. Consider ranged/control instead.");
  }
  if (traits.openness === "open" && analysis.our.assassins >= 2) {
    analysis.warnings.push("Open map with limited approach routes — multiple assassins will struggle to close gaps.");
  }
  if (traits.openness === "closed" && analysis.our.sharpshooters >= 2) {
    analysis.warnings.push("Closed map with heavy walls — sharpshooters lose sightlines. Consider mid-range or close-range brawlers.");
  }
  if (traits.zones === 1) {
    analysis.warnings.push("Single zone map — all fights happen in one area. Sustained damage and healing are king.");
  }
  if (traits.zones === 2 && analysis.our.supports >= 2) {
    analysis.warnings.push("Dual zone map — you need to split pressure. Too many supports limits your ability to contest both zones.");
  }

  // ── Identify team needs ──

  if (ourPicks.length >= 1) {
    if (analysis.our.tanks === 0 && analysis.our.assassins === 0) {
      analysis.needs.push("frontline");
    }
    if (analysis.our.supports === 0 && ourPicks.length >= 2) {
      analysis.needs.push("sustain");
    }
    if (analysis.our.antiTank === 0 && analysis.enemy.tanks >= 1) {
      analysis.needs.push("anti-tank");
    }
    if (analysis.our.tanks === 0 && analysis.enemy.assassins >= 2) {
      analysis.needs.push("tank-to-answer-dive");
    }
  }

  return analysis;
}

// ============================================================
// SCORING
// ============================================================

function getMapMeta(mapId) {
  const map = MAPS.find((m) => m.id === mapId);
  if (!map) return { map: null, meta: {} };
  const entry = META_BY_MAP[map.name] || {};
  return { map, meta: entry };
}

function scoreBrawler({ id, map, meta, ourPicks, enemyPicks, draftAnalysis, enemyPicksRemaining }) {
  let score = 0;
  const mode = map?.mode || "";
  const roleInfo = ROLE_DATA[id] || {};
  const roles = roleInfo.roles || [];
  const antiTankFlag = !!roleInfo.antiTank;

  // 1. MAP META — how often was this brawler picked on this specific map?
  const mapPicks = meta[id] || 0;
  if (mapPicks > 0) {
    // Logarithmic scaling — 1 pick = 2pts, 3 picks = 3.8pts, 6+ picks = 5pts
    score += Math.min(5, 2 + Math.log2(mapPicks) * 1.2);
  }

  // 2. MODE WEIGHT — how strong is this brawler in this mode?
  const modeData = MODE_WEIGHTS[mode] || {};
  const modeWeight = modeData[id] || 0;
  score += modeWeight * 1.2;

  // 3. WIN RATE — reward proven winners, punish trap picks
  const wr = WIN_RATES[id];
  if (wr !== undefined) {
    // Center at 50%, scale -3 to +3
    score += (wr - 0.5) * 6;
  }

  // 4. ANTI-TANK — counter enemy tanks
  const enemyTankCount = enemyPicks.filter((p) => TANKS.has(p)).length;
  if (enemyTankCount >= 2 && antiTankFlag) {
    score += 5;
  } else if (enemyTankCount === 1 && antiTankFlag) {
    score += 3;
  }

  // 5. HARD COUNTERS — specific matchup advantages
  for (const enemy of enemyPicks) {
    const counters = HARD_COUNTERS[enemy];
    if (counters && counters.includes(id)) {
      score += 4;
    }
  }

  // 6. SYNERGY — reward picking brawlers that pair well with our team
  const synergyPartners = SYNERGIES[id] || [];
  for (const ally of ourPicks) {
    if (synergyPartners.includes(ally)) {
      score += 3;
    }
  }

  // 7. TANK STACKING PENALTY — don't over-stack tanks (even in BB now)
  const ourTankCount = ourPicks.filter((p) => TANKS.has(p)).length;
  if (TANKS.has(id)) {
    if (ourTankCount >= 2) {
      score -= 8; // never go triple tank
    } else if (ourTankCount >= 1 && mode !== "Brawl Ball") {
      score -= 3;
    }
  }

  // 8. ROLE DIVERSITY — penalize stacking identical roles
  const ourRoles = ourPicks.flatMap((p) => (ROLE_DATA[p]?.roles || []));
  for (const role of roles) {
    const count = ourRoles.filter((r) => r === role).length;
    if (count >= 2) score -= 2;
  }

  // 9. TRAP PICK PENALTY — punish brawlers with known bad WR despite high pick rate
  // Gale in Brawl Ball: 27.3% WR, Byron overall: 35.3%, Kenji: 23.1%
  if (id === "gale" && mode === "Brawl Ball") score -= 3;
  if (id === "kenji" && mode === "Bounty") score -= 3;
  if (id === "bo" && mode === "Knockout") score -= 2;

  // 10. MAP TRAITS — reward/penalize based on map layout
  const traits = map?.traits || {};
  if (traits.openness === "open") {
    // Open maps: sharpshooters + control thrive, tanks + assassins struggle
    if (SHARPSHOOTERS.has(id)) score += 2;
    if (TANKS.has(id)) score -= 3;
    if (ASSASSINS.has(id) && !roleInfo.tags?.includes("Invis")) score -= 2; // invis assassins can still close gap
  } else if (traits.openness === "closed") {
    // Closed maps: tanks + assassins thrive, sharpshooters lose value
    if (TANKS.has(id)) score += 1;
    if (ASSASSINS.has(id)) score += 1;
    if (SHARPSHOOTERS.has(id) && id !== "rico") score -= 1; // Rico bounces off walls so he's fine
  }
  if (traits.walls === "heavy") {
    if (THROWERS.has(id)) score += 2; // throwers love walls
  }
  if (traits.walls === "open" || traits.walls === "light") {
    if (THROWERS.has(id)) score -= 2; // throwers exposed without walls
  }
  if (traits.bushes === "heavy") {
    // Heavy bush maps reward assassins and invis
    if (ASSASSINS.has(id)) score += 1;
    if (id === "leon" || id === "sandy" || id === "tara") score += 1; // invis/bush-check value
  }
  // Single zone Hot Zone: penalize rotation-dependent brawlers, reward sustained zone hold
  if (traits.zones === 1) {
    if (SUPPORTS.has(id)) score += 1; // sustain on single zone is huge
  }
  // Dual zone Hot Zone: reward mobility and multi-lane pressure
  if (traits.zones === 2) {
    if (roleInfo.tags?.includes("Dash") || id === "stu" || id === "max") score += 1;
  }

  // 11. BEING COUNTERED PENALTY — don't pick into your own counters
  const myCounters = HARD_COUNTERS[id] || [];
  let counterHits = 0;
  for (const enemy of enemyPicks) {
    if (myCounters.includes(enemy)) counterHits++;
  }
  if (counterHits >= 2) {
    score -= 6; // multiple enemies counter you — terrible pick
  } else if (counterHits === 1) {
    score -= 3; // one enemy counters you — risky
  }

  // 12. ENEMY COUNTER-COMP PENALTY — if enemy is stacking anti-tank, don't pick tanks
  if (draftAnalysis) {
    if (TANKS.has(id) && draftAnalysis.enemy.antiTank >= 2) {
      score -= 6; // enemy built to kill tanks, don't feed them
    }
    if (ASSASSINS.has(id) && draftAnalysis.enemy.tanks >= 2 && !antiTankFlag) {
      score -= 4; // assassin into tank-heavy comp is rough
    }
    if (SHARPSHOOTERS.has(id) && draftAnalysis.enemy.assassins >= 2) {
      score -= 4; // sharpshooter into assassin-heavy comp gets dove
    }
    if (THROWERS.has(id) && draftAnalysis.enemy.assassins >= 1) {
      score -= 3; // throwers get destroyed by assassins
    }
  }

  // 13. ROLE GAP FILLING — boost picks that fill what the team needs
  if (draftAnalysis && draftAnalysis.needs.length > 0) {
    if (draftAnalysis.needs.includes("anti-tank") && antiTankFlag) {
      score += 3;
    }
    if (draftAnalysis.needs.includes("frontline") && (TANKS.has(id) || ASSASSINS.has(id))) {
      score += 2;
    }
    if (draftAnalysis.needs.includes("sustain") && SUPPORTS.has(id)) {
      score += 2;
    }
    if (draftAnalysis.needs.includes("tank-to-answer-dive") && TANKS.has(id)) {
      score += 3;
    }
  }

  // 14. DRAFT POSITION — polarizing picks are risky when enemy still has picks to respond
  // Count how many brawlers in the full roster hard-counter this pick
  const totalCountersExist = Object.values(HARD_COUNTERS).flat().filter((c) => c === id).length;
  // Doesn't count — we want how many brawlers counter US, not who we counter
  // Recount: how many entries in HARD_COUNTERS[id] exist (brawlers that beat us)
  const myCounterCount = (HARD_COUNTERS[id] || []).length;

  if (enemyPicksRemaining > 0 && myCounterCount >= 5) {
    // Highly counterable brawler (5+ counters) and enemy still has picks
    // Scale penalty by how many picks they have left
    score -= enemyPicksRemaining * 2; // -2 per remaining enemy pick
  } else if (enemyPicksRemaining > 0 && myCounterCount >= 3) {
    score -= enemyPicksRemaining * 1; // moderate counter vulnerability
  }

  // Flip side: if enemy has NO picks left (we're last pick), polarizing picks are safer
  if (enemyPicksRemaining === 0 && myCounterCount >= 5) {
    score += 2; // safe to pick — they can't respond
  }

  // 15. FULL COMP VULNERABILITY — can this brawler actually function vs the WHOLE enemy team?
  // Check how many enemy brawlers this pick struggles into (not just hard counters, but bad matchups)
  let badMatchups = 0;
  for (const enemy of enemyPicks) {
    const enemyCounters = HARD_COUNTERS[id] || [];
    if (enemyCounters.includes(enemy)) badMatchups++;
    // Also check if enemy is a tank and we're a squishy assassin without antiTank
    if (TANKS.has(enemy) && ASSASSINS.has(id) && !antiTankFlag) badMatchups++;
    // Sharpshooters struggle vs assassins in their face
    if (ASSASSINS.has(enemy) && SHARPSHOOTERS.has(id)) badMatchups++;
  }
  if (badMatchups >= 2) {
    score -= 4; // struggles into most of the enemy team — bad pick regardless of one good matchup
  }

  return { id, score, roles, antiTank: antiTankFlag, counterHits, badMatchups };
}

// ============================================================
// EXPLANATIONS
// ============================================================

function buildExplanation({ brawlerId, map, meta, enemyPicks, ourPicks, roles, antiTank, counterHits, badMatchups, enemyPicksRemaining, draftAnalysis, advanced }) {
  const b = INDEX[brawlerId];
  if (!b) return { short: "", long: "" };

  const mode = map?.mode || "";
  const name = b.name;
  const mapPicks = meta[brawlerId] || 0;
  const wr = WIN_RATES[brawlerId];
  const enemyTankCount = enemyPicks.filter((p) => TANKS.has(p)).length;
  const roleText = roles.length ? roles.join(" / ") : "flex";

  const parts = [];

  // Map presence
  if (mapPicks > 0) {
    parts.push(`Picked ${mapPicks}x on ${map?.name || "this map"} at BSC 2026 March.`);
  } else {
    parts.push(`Not a common pick on this map, but fits the current comp.`);
  }

  // Win rate
  if (wr !== undefined) {
    const wrPct = Math.round(wr * 100);
    if (wrPct >= 65) parts.push(`${wrPct}% competitive win rate — proven winner.`);
    else if (wrPct >= 55) parts.push(`Solid ${wrPct}% competitive win rate.`);
    else if (wrPct < 45) parts.push(`Caution: only ${wrPct}% win rate in competitive.`);
  }

  // Anti-tank
  if (enemyTankCount >= 2 && antiTank) {
    parts.push("Punishes the enemy's tank-heavy comp hard.");
  } else if (enemyTankCount === 1 && antiTank) {
    parts.push("Clean answer into the enemy tank.");
  }

  // Synergy
  const synergyPartners = SYNERGIES[brawlerId] || [];
  const matchedSynergies = ourPicks.filter((p) => synergyPartners.includes(p));
  if (matchedSynergies.length > 0) {
    const names = matchedSynergies.map((p) => INDEX[p]?.name || p).join(", ");
    parts.push(`Strong synergy with ${names}.`);
  }

  // Counter info
  for (const enemy of enemyPicks) {
    const counters = HARD_COUNTERS[enemy];
    if (counters && counters.includes(brawlerId)) {
      const enemyName = INDEX[enemy]?.name || enemy;
      parts.push(`Directly counters ${enemyName}.`);
      break;
    }
  }

  // Being countered warning
  if (counterHits >= 2) {
    const counterNames = enemyPicks
      .filter((e) => (HARD_COUNTERS[brawlerId] || []).includes(e))
      .map((e) => INDEX[e]?.name || e).join(", ");
    parts.push(`⚠ WARNING: Hard-countered by ${counterNames}. Risky pick.`);
  } else if (counterHits === 1) {
    const counterName = enemyPicks
      .find((e) => (HARD_COUNTERS[brawlerId] || []).includes(e));
    parts.push(`Caution: ${INDEX[counterName]?.name || counterName} counters this pick.`);
  }

  // Fills team need
  if (draftAnalysis && draftAnalysis.needs.length > 0) {
    if (draftAnalysis.needs.includes("anti-tank") && antiTank) {
      parts.push("Fills your team's need for anti-tank.");
    }
    if (draftAnalysis.needs.includes("sustain") && SUPPORTS.has(brawlerId)) {
      parts.push("Fills your team's need for sustain.");
    }
    if (draftAnalysis.needs.includes("frontline") && (TANKS.has(brawlerId) || ASSASSINS.has(brawlerId))) {
      parts.push("Gives your team a frontline threat.");
    }
  }

  // Draft position warning
  const myCounterCount = (HARD_COUNTERS[brawlerId] || []).length;
  if (enemyPicksRemaining > 0 && myCounterCount >= 5) {
    parts.push(`⚠ Easily countered (${myCounterCount} counters) and enemy still has ${enemyPicksRemaining} pick(s) — they can respond. Better as a last pick.`);
  } else if (enemyPicksRemaining > 0 && myCounterCount >= 3) {
    parts.push(`Risky: ${myCounterCount} common counters exist and enemy has ${enemyPicksRemaining} pick(s) left.`);
  }
  if (enemyPicksRemaining === 0 && myCounterCount >= 5) {
    parts.push("Safe last pick — enemy can't counter-pick you.");
  }

  // Full comp vulnerability
  if (badMatchups >= 2) {
    parts.push(`⚠ Struggles into ${badMatchups} of ${enemyPicks.length} enemy brawlers — bad matchup spread.`);
  }

  const short = `${name} — ${roleText} pick for ${map?.name || "this map"}.`;
  const long = parts.join(" ");

  return { short, long: advanced ? long : parts.slice(0, 2).join(" ") };
}

// ============================================================
// PUBLIC API
// ============================================================

export function getRecommendations({ mapId, ourPicks, enemyPicks, bans, advanced }) {
  const { map, meta } = getMapMeta(mapId);
  if (!map) return { recommendations: [], draftAnalysis: null };

  const our = ourPicks || [];
  const enemy = enemyPicks || [];
  const draftAnalysis = analyzeDraftState(our, enemy, map);

  const taken = new Set([...our, ...enemy, ...(bans || [])]);

  const scored = [];

  for (const b of BRAWLERS) {
    if (taken.has(b.id)) continue;
    const s = scoreBrawler({
      id: b.id,
      map,
      meta,
      ourPicks: our,
      enemyPicks: enemy,
      draftAnalysis,
      enemyPicksRemaining: 3 - enemy.length,
    });
    scored.push(s);
  }

  if (!scored.length) return { recommendations: [], draftAnalysis };

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 5);
  const best = top[0]?.score ?? 0;
  const second = top[1]?.score ?? best - 1;

  const recommendations = top.map((entry, idx) => {
    const b = INDEX[entry.id];
    const expl = buildExplanation({
      brawlerId: entry.id,
      map,
      meta,
      enemyPicks: enemy,
      ourPicks: our,
      roles: entry.roles,
      antiTank: entry.antiTank,
      counterHits: entry.counterHits,
      badMatchups: entry.badMatchups,
      enemyPicksRemaining: 3 - enemy.length,
      draftAnalysis,
      advanced,
    });

    const tags = [];
    if ((meta[entry.id] || 0) > 0) tags.push("Map meta");
    if (entry.roles?.length) tags.push(entry.roles.join(" / "));
    if (entry.antiTank) tags.push("Anti-tank");

    const wr = WIN_RATES[entry.id];
    if (wr !== undefined && wr >= 0.65) tags.push("High WR");

    if (entry.counterHits >= 2) tags.push("⚠ Countered");
    else if (entry.counterHits === 1) tags.push("Risky matchup");

    if (entry.badMatchups >= 2) tags.push("⚠ Bad comp fit");

    const enemyRemaining = 3 - enemy.length;
    const brawlerCounterCount = (HARD_COUNTERS[entry.id] || []).length;
    if (enemyRemaining > 0 && brawlerCounterCount >= 5) tags.push("Better as last pick");
    if (enemyRemaining === 0 && brawlerCounterCount >= 5) tags.push("Safe last pick");

    const mustPick = idx === 0 && best >= second + 4 && best > 0;

    return {
      id: entry.id,
      name: b?.name || entry.id,
      image: b?.image,
      tags,
      shortExplanation: expl.short,
      longExplanation: expl.long,
      mustPick,
    };
  });

  return { recommendations, draftAnalysis };
}

export function getBanSuggestions({ mapId, mode }) {
  const modeKey = mode || MAPS.find((m) => m.id === mapId)?.mode;
  return MODE_BAN_PRIORITY[modeKey] || [];
}
