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
  crow:      { roles: ["Assassin", "Control"], tags: ["Poison", "Buffy", "Bouncing kunai", "Nerfed Mar30", "Long range"], antiTank: true },
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
  glowy:   { roles: ["Support", "Damage"], tags: ["Heal/damage flex", "Perma-banned"], antiTank: false },

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
// SUPER THREATS — supers that warp how the enemy must draft
// groupPull:  pulls/groups enemies together → team wipe potential
// stun:       long stun that guarantees follow-up kills
// teamWipe:   super that can kill multiple brawlers at once
// zonedenial: super that locks down an area for extended time
// surviveWith: brawler traits that help survive/answer this super
// ============================================================
const SUPER_THREATS = {
  tara:      { type: "groupPull", surviveWith: ["High HP", "Shield", "Team heal"] },
  gene:      { type: "groupPull", surviveWith: ["High HP", "Shield"] },
  frank:     { type: "stun", surviveWith: ["Dash", "Invis", "Long range"] },
  spike:     { type: "zonedenial", surviveWith: ["Dash", "Speed boost", "High HP"] },
  sandy:     { type: "zonedenial", surviveWith: ["Vision"] },
  emz:       { type: "zonedenial", surviveWith: ["Dash", "Long range"] },
  el_primo:  { type: "groupPull", surviveWith: ["High HP", "Knockback"] },
  jacky:     { type: "groupPull", surviveWith: ["Long range", "Dash"] },
  lou:       { type: "stun", surviveWith: ["Dash", "Speed boost"] },
  surge:     { type: "teamWipe", surviveWith: ["High HP", "Shield"] },
};

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
  bull:     ["colette", "spike", "emz", "shelly", "bea", "clancy", "nita", "crow"],
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

export function analyzeDraftState(ourPicks, enemyPicks, map) {
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

  // ── Super threat warnings ──
  const enemySuperThreats = enemyPicks
    .filter((p) => SUPER_THREATS[p])
    .map((p) => ({ id: p, ...SUPER_THREATS[p] }));
  analysis.enemySuperThreats = enemySuperThreats;

  const pullThreats = enemySuperThreats.filter((t) => t.type === "groupPull");
  const stunThreats = enemySuperThreats.filter((t) => t.type === "stun");

  if (pullThreats.length > 0) {
    const names = pullThreats.map((t) => INDEX[t.id]?.name || t.id).join(", ");
    // Check if our team has anyone who can survive pulls
    const ourTags = ourPicks.flatMap((p) => ROLE_DATA[p]?.tags || []);
    const hasSurvival = ourTags.some((t) => ["High HP", "Shield", "Team heal"].includes(t));
    if (!hasSurvival) {
      analysis.warnings.push(`${names} has a group pull super — your team has no way to survive it. Pick sustain or high HP.`);
    } else {
      analysis.warnings.push(`${names} has a group pull super — be aware. You have some survival tools.`);
    }
    analysis.needs.push("anti-pull-sustain");
  }

  if (stunThreats.length > 0) {
    const names = stunThreats.map((t) => INDEX[t.id]?.name || t.id).join(", ");
    analysis.warnings.push(`${names} has a long stun super — avoid grouping, consider mobile brawlers.`);
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
  const isCloseRange = roleInfo.tags?.includes("Close range") || roleInfo.tags?.includes("Close burst");
  const isOpenMap = (map?.traits || {}).openness === "open";
  // Close-range brawler on an open map can't apply their kit — discount matchup-based scores
  const closeRangeOnOpenMap = isCloseRange && isOpenMap;

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
  // Close-range anti-tanks on open maps can't get in range to apply pressure — halve the bonus
  const enemyTankCount = enemyPicks.filter((p) => TANKS.has(p)).length;
  const antiTankMultiplier = closeRangeOnOpenMap ? 0.5 : 1;
  if (enemyTankCount >= 2 && antiTankFlag) {
    score += 5 * antiTankMultiplier;
  } else if (enemyTankCount === 1 && antiTankFlag) {
    score += 3 * antiTankMultiplier;
  }

  // 5. HARD COUNTERS — specific matchup advantages
  // If you counter someone on paper but can't reach them on this map, the counter is worth less
  for (const enemy of enemyPicks) {
    const counters = HARD_COUNTERS[enemy];
    if (counters && counters.includes(id)) {
      score += closeRangeOnOpenMap ? 1 : 4;
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
    if (ASSASSINS.has(id) && !roleInfo.tags?.includes("Invis") && !roleInfo.tags?.includes("Long range")) score -= 2; // invis/ranged assassins can still function on open maps
    if (isCloseRange && !TANKS.has(id)) score -= 3; // close-range non-tanks (e.g. Shelly) are just as exposed on open maps
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
      score += closeRangeOnOpenMap ? 0 : 3; // close-range anti-tank on open map doesn't actually fill the need
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

  // 14. SUPER THREAT RESPONSE — boost picks that answer enemy super threats
  if (draftAnalysis && draftAnalysis.enemySuperThreats) {
    const myTags = roleInfo.tags || [];
    for (const threat of draftAnalysis.enemySuperThreats) {
      const surviveWith = threat.surviveWith || [];
      const canSurvive = myTags.some((t) => surviveWith.includes(t));

      if (threat.type === "groupPull") {
        // Pulls are devastating — heavily reward brawlers that survive them
        if (canSurvive) {
          score += 3;
        }
        // Sustain/heal answers pull burst — team heal keeps pulled teammates alive
        if (myTags.includes("Team heal") || myTags.includes("Turret heal")) {
          score += 3;
        }
        // Shield absorbs follow-up burst after pull
        if (myTags.includes("Shield")) {
          score += 2;
        }
        // Squishy brawlers with no escape are pull food — penalize
        if (!canSurvive && !TANKS.has(id) && !SUPPORTS.has(id)) {
          score -= 2;
        }
      }

      if (threat.type === "stun") {
        // Dash/mobile brawlers can dodge stuns
        if (canSurvive) score += 2;
        // Slow immobile brawlers are free stun targets
        if (!canSurvive && myTags.includes("Turret DPS")) score -= 2;
      }
    }

    // If team needs anti-pull-sustain, boost healers and shielders
    if (draftAnalysis.needs.includes("anti-pull-sustain")) {
      if (SUPPORTS.has(id)) score += 2;
      if (myTags.includes("Shield")) score += 2;
      if (myTags.includes("High HP")) score += 1;
    }
  }

  // 15. DRAFT POSITION — polarizing picks are risky when enemy still has picks to respond
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

  // 16. FULL COMP VULNERABILITY — can this brawler actually function vs the WHOLE enemy team?
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

// ── Synergy flavor text — explains WHY two brawlers work together ──
const SYNERGY_REASONS = {
  "belle+kaze":    "Belle marks a target and Kaze dashes in for the kill — marked targets melt instantly.",
  "kaze+belle":    "Kaze can dive anyone Belle marks, turning her poke into guaranteed kills.",
  "kaze+pierce":   "Pierce holds lanes while Kaze flanks — enemies have to pick which threat to face.",
  "kaze+gus":      "Gus shield lets Kaze dive deeper and survive the trade.",
  "pierce+kaze":   "Pierce's lane pressure creates space for Kaze to find angles.",
  "pierce+emz":    "Pierce and Emz stack zone control — enemies can't walk anywhere safely.",
  "pierce+mortis":  "Pierce holds mid while Mortis flanks the backline they're forced toward.",
  "charlie+ruffs":  "Charlie zones and Ruffs power-ups make your team impossible to trade into.",
  "charlie+bibi":   "Charlie's spiders slow targets and Bibi runs them down — no escape.",
  "bibi+charlie":   "Bibi forces enemies into Charlie's spider zones.",
  "bibi+meeple":    "Both dominate Brawl Ball lanes — constant pressure from two angles.",
  "ruffs+charlie":  "Ruffs power-ups make Charlie's zone control even deadlier to walk into.",
  "ruffs+lou":      "Ruffs buffs + Lou freeze = enemies can't fight back.",
  "lou+ruffs":      "Freeze them, then Ruffs-boosted teammates clean up while they're stuck.",
  "lou+spike":      "Lou freezes, Spike drops super on frozen targets — guaranteed team wipe.",
  "lou+gigi":       "Both lock down zones — enemies literally cannot contest.",
  "emz+mortis":     "Emz melts grouped enemies, Mortis dashes in to finish low HP targets.",
  "emz+pierce":     "Double zone control chokes out the entire map.",
  "mortis+emz":     "Mortis herds enemies into Emz's spray — they're trapped.",
  "mortis+pierce":  "Mortis dives backline, Pierce controls mid — total map control.",
  "mortis+sirius":  "Double assassin pressure — one dives, one flanks. Can't track both.",
  "crow+brock":     "Crow poisons, Brock finishes from range — the target can't heal back.",
  "brock+crow":     "Brock pokes them low, Crow's poison prevents recovery.",
  "leon+charlie":   "Leon goes invisible, Charlie zones off escape routes — nowhere to run.",
  "leon+pierce":    "Pierce holds the lane, Leon flanks behind — classic pinch setup.",
  "spike+lou":      "Spike super on frozen targets is a death sentence.",
  "spike+clancy":   "Spike zones enemies in place while Clancy ramps up damage — by the time they escape, they're dead.",
  "clancy+spike":   "Spike controls movement, Clancy gets free ramp time.",
  "clancy+emz":     "Emz melts tanks, Clancy scales DPS — double threat that's hard to itemize against.",
  "clancy+colette": "Both shred tanks — enemy frontline disappears.",
  "gigi+lou":       "Double zone lockdown makes contesting impossible.",
  "gigi+spike":     "Overlapping zones force enemies into lose-lose positions.",
  "sirius+mortis":  "Two assassins diving at once — backline can't survive.",
  "sirius+leon":    "Invisible + clones = total chaos for the enemy to track.",
  "colette+clancy": "Both anti-tank — enemy can't run frontline at all.",
  "colette+emz":    "Tank shredder duo — anything beefy gets melted.",
};

function getSynergyReason(a, b) {
  return SYNERGY_REASONS[`${a}+${b}`] || SYNERGY_REASONS[`${b}+${a}`] || null;
}

// ── Counter flavor text — explains WHY a brawler counters another ──
const COUNTER_REASONS = {
  // Tank counters
  colette:   "% HP damage melts tanks regardless of how beefy they are",
  spike:     "slowing super + burst shreds tanks who can't escape",
  emz:       "constant AoE melts tanks who try to walk through her zone",
  bea:       "supercharged shots deal massive damage to big targets",
  clancy:    "ramped-up DPS tears through high-HP brawlers",
  shelly:    "super blast + close-range burst destroys tanks point blank",
  // Assassin answers
  frank:     "stun locks assassins out of their dash combo",
  bull:      "face-tanks assassin burst and wins the trade up close",
  bibi:      "knockback stops dive and wins melee trades",
  tara:      "pull groups diving assassins for easy team follow-up",
  // Thrower counters
  mortis:    "dashes straight through walls and kills throwers in 3 hits",
  leon:      "goes invisible and one-shots throwers before they react",
  edgar:     "jumps on throwers from anywhere — they can't escape",
};

function getCounterReason(counterId) {
  return COUNTER_REASONS[counterId] || "has a kit that beats them in this matchup";
}

function buildExplanation({ brawlerId, map, meta, enemyPicks, ourPicks, roles, antiTank, counterHits, badMatchups, enemyPicksRemaining, draftAnalysis, advanced }) {
  const b = INDEX[brawlerId];
  if (!b) return { short: "", long: "" };

  const mode = map?.mode || "";
  const name = b.name;
  const mapPicks = meta[brawlerId] || 0;
  const wr = WIN_RATES[brawlerId];
  const enemyTankCount = enemyPicks.filter((p) => TANKS.has(p)).length;
  const roleText = roles.length ? roles.join("/") : "flex";
  const tags = ROLE_DATA[brawlerId]?.tags || [];

  // Build insight-driven explanation parts
  const insights = [];  // "why this works" — the core pitch
  const warnings = [];  // risk flags

  // ── Core pitch: why this brawler right now? ──

  // Synergy insight (most impactful — explains the combo)
  const synergyPartners = SYNERGIES[brawlerId] || [];
  const matchedSynergies = ourPicks.filter((p) => synergyPartners.includes(p));
  for (const ally of matchedSynergies) {
    const reason = getSynergyReason(brawlerId, ally);
    if (reason) {
      insights.push(reason);
    } else {
      insights.push(`Pairs well with ${INDEX[ally]?.name || ally} — proven high win rate combo.`);
    }
  }

  // Counter insight (explains matchup advantage)
  const countered = [];
  for (const enemy of enemyPicks) {
    const enemyCounters = HARD_COUNTERS[enemy];
    if (enemyCounters && enemyCounters.includes(brawlerId)) {
      countered.push(enemy);
    }
  }
  if (countered.length > 0) {
    const target = countered[0];
    const targetName = INDEX[target]?.name || target;
    const reason = getCounterReason(brawlerId);
    if (countered.length === 1) {
      insights.push(`Shuts down ${targetName} — ${reason}.`);
    } else {
      const otherNames = countered.slice(1).map((e) => INDEX[e]?.name || e).join(" and ");
      insights.push(`Counters ${targetName} and ${otherNames} — ${reason}.`);
    }
  }

  // Anti-tank insight (comp-level reasoning)
  if (enemyTankCount >= 2 && antiTank) {
    insights.push(`Enemy is running ${enemyTankCount} tanks — ${name} shreds through high HP and punishes that comp.`);
  } else if (enemyTankCount === 1 && antiTank && countered.length === 0) {
    const tankName = INDEX[enemyPicks.find((p) => TANKS.has(p))]?.name || "their tank";
    insights.push(`Clean answer into ${tankName} — your team needs someone who can deal with frontline.`);
  }

  // Map context (not just "picked 3x" — explain why)
  if (mapPicks >= 5) {
    insights.push(`Pro staple on ${map?.name || "this map"} — picked ${mapPicks} times in BSC 2026 because the layout plays to their strengths.`);
  } else if (mapPicks >= 2) {
    insights.push(`Proven pick on this map (${mapPicks}x in BSC 2026) — the lanes and layout suit this kit.`);
  }

  // Win rate as validation, not lead
  if (wr !== undefined) {
    const wrPct = Math.round(wr * 100);
    if (wrPct >= 70) {
      insights.push(`${wrPct}% win rate in competitive — when pros pick this, they win.`);
    } else if (wrPct >= 60) {
      insights.push(`Sitting at ${wrPct}% competitive win rate — consistently delivers results.`);
    } else if (wrPct < 40) {
      warnings.push(`Only ${wrPct}% win rate in competitive — looks good on paper but hasn't been delivering.`);
    }
  }

  // Team composition gap filling (explains the WHY)
  if (draftAnalysis && draftAnalysis.needs.length > 0) {
    if (draftAnalysis.needs.includes("anti-tank") && antiTank) {
      insights.push("Your team has no tank answer yet — this pick gives you the damage to break through their frontline.");
    }
    if (draftAnalysis.needs.includes("sustain") && SUPPORTS.has(brawlerId)) {
      insights.push("Your team is missing sustain — without heals you'll lose every extended fight.");
    }
    if (draftAnalysis.needs.includes("frontline") && TANKS.has(brawlerId)) {
      insights.push("No frontline yet — your backline needs someone to absorb pressure and create space.");
    }
    if (draftAnalysis.needs.includes("tank-to-answer-dive") && TANKS.has(brawlerId)) {
      insights.push("Enemy has multiple assassins — you need a tank to body-block dives and protect your team.");
    }
  }

  // Super threat response (tactical insight)
  if (draftAnalysis && draftAnalysis.enemySuperThreats) {
    for (const threat of draftAnalysis.enemySuperThreats) {
      const threatName = INDEX[threat.id]?.name || threat.id;
      const canSurvive = tags.some((t) => (threat.surviveWith || []).includes(t));

      if (threat.type === "groupPull") {
        if (tags.includes("Team heal") || tags.includes("Turret heal")) {
          insights.push(`${threatName}'s pull will group your team — your healing keeps everyone alive through the burst.`);
        } else if (tags.includes("Shield")) {
          insights.push(`Shield absorbs the follow-up damage after ${threatName}'s pull — your team survives the combo.`);
        } else if (!canSurvive && !TANKS.has(brawlerId) && !SUPPORTS.has(brawlerId)) {
          warnings.push(`Vulnerable to ${threatName}'s pull — no way to survive the burst that follows.`);
        }
      }
      if (threat.type === "stun" && canSurvive) {
        insights.push(`Mobile enough to dodge ${threatName}'s stun — won't get locked down.`);
      }
    }
  }

  // Map trait insights
  const traits = map?.traits || {};
  if (traits.openness === "open" && SHARPSHOOTERS.has(brawlerId)) {
    insights.push("Open map with long sightlines — perfect for this range.");
  }
  if (traits.walls === "heavy" && THROWERS.has(brawlerId)) {
    insights.push("Heavy walls let throwers lob shots safely — the map layout protects them.");
  }
  if (traits.bushes === "heavy" && (brawlerId === "leon" || brawlerId === "sandy")) {
    insights.push("Heavy bush map — invis and bush-checking give massive value here.");
  }

  // ── Risk warnings ──

  if (counterHits >= 2) {
    const counterNames = enemyPicks
      .filter((e) => (HARD_COUNTERS[brawlerId] || []).includes(e))
      .map((e) => INDEX[e]?.name || e).join(" and ");
    warnings.push(`Hard-countered by ${counterNames} — they have the tools to shut this down.`);
  } else if (counterHits === 1) {
    const counterName = INDEX[enemyPicks.find((e) => (HARD_COUNTERS[brawlerId] || []).includes(e))]?.name;
    if (counterName) {
      warnings.push(`${counterName} can punish this pick — play around them.`);
    }
  }

  const myCounterCount = (HARD_COUNTERS[brawlerId] || []).length;
  if (enemyPicksRemaining > 0 && myCounterCount >= 5) {
    warnings.push(`${myCounterCount} brawlers counter this and enemy still has ${enemyPicksRemaining} pick(s) — they can respond. Save for last pick.`);
  }
  if (enemyPicksRemaining === 0 && myCounterCount >= 5) {
    insights.push("Last pick safety — enemy can't counter you now. Free value.");
  }

  if (badMatchups >= 2) {
    warnings.push(`Struggles into ${badMatchups} of ${enemyPicks.length} enemy brawlers — tough game even if you play well.`);
  }

  // ── Fallback: always generate something ──
  if (insights.length === 0) {
    // Role-based fallback
    const tagStr = tags.length ? tags.join(", ").toLowerCase() : "";

    // Map trait compatibility
    if (traits.openness === "open" && (roles.includes("Sharpshooter") || roles.includes("Control"))) {
      insights.push(`${roleText} that thrives on open maps — long sightlines play to this kit.`);
    } else if (traits.walls === "heavy" && roles.includes("Thrower")) {
      insights.push(`Thrower that exploits heavy walls — lob damage safely without exposure.`);
    } else if (traits.bushes === "heavy" && roles.includes("Assassin")) {
      insights.push(`Bush-heavy map gives assassins free approach routes — can ambush without being seen.`);
    } else if (traits.openness === "closed" && (roles.includes("Tank") || roles.includes("Assassin"))) {
      insights.push(`Tight map with plenty of cover to close gaps — ${roleText.toLowerCase()}s can get in range without getting melted.`);
    }

    // Counter safety
    const myCounters = (HARD_COUNTERS[brawlerId] || []);
    const activeCounters = enemyPicks.filter((e) => myCounters.includes(e));
    if (activeCounters.length === 0 && enemyPicks.length > 0) {
      insights.push("Safe pick — no hard counters on the enemy team right now.");
    }

    // Role description from tags
    if (insights.length === 0) {
      if (tagStr.includes("heist")) {
        insights.push(`${roleText} built for Heist — focuses on safe damage and wall breaking.`);
      } else if (tagStr.includes("hot zone")) {
        insights.push(`${roleText} that excels at holding zones — sustained presence and area denial.`);
      } else if (tagStr.includes("knockout")) {
        insights.push(`${roleText} suited for Knockout — high single-target value in elimination rounds.`);
      } else if (tagStr.includes("bounty")) {
        insights.push(`${roleText} that plays well in Bounty — picks off targets and stays alive.`);
      } else if (tagStr.includes("brawl ball")) {
        insights.push(`${roleText} with strong Brawl Ball presence — good at controlling the ball and lanes.`);
      } else if (tagStr.includes("gem grab")) {
        insights.push(`${roleText} that holds mid well in Gem Grab — controls the gem mine area.`);
      } else if (roles.includes("Tank")) {
        insights.push(`Frontline ${roleText.toLowerCase()} — absorbs pressure and creates space for your damage dealers.`);
      } else if (roles.includes("Support")) {
        insights.push(`${roleText} that keeps your team alive — sustain wins extended fights.`);
      } else if (roles.includes("Assassin")) {
        insights.push(`${roleText} that can eliminate key targets — high kill potential on backline brawlers.`);
      } else if (roles.includes("Control")) {
        insights.push(`${roleText} with strong zone control — denies area and forces the enemy to play around you.`);
      } else if (roles.includes("Sharpshooter")) {
        insights.push(`${roleText} that applies pressure from range — punishes bad positioning.`);
      } else {
        insights.push(`Solid ${roleText.toLowerCase()} option — fills a gap in your comp without getting hard-countered.`);
      }
    }
  }

  // ── Build final output ──

  // Short: punchy one-liner with the strongest insight
  const shortInsight = insights[0] || `Solid ${roleText} pick for this map and mode.`;
  const short = shortInsight.length > 80 ? shortInsight.slice(0, 77) + "..." : shortInsight;

  // Long: all insights + warnings
  const allParts = [...insights, ...warnings.map((w) => `⚠ ${w}`)];
  const long = allParts.join(" ") || short;

  // Non-advanced: show top 2 insights + first warning if any
  const brief = [...insights.slice(0, 2), ...(warnings.length > 0 ? [`⚠ ${warnings[0]}`] : [])].join(" ");

  return { short, long: advanced ? long : brief };
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
  const ids = MODE_BAN_PRIORITY[modeKey] || [];
  return ids.map((id) => {
    const b = INDEX[id];
    const rd = ROLE_DATA[id];
    return {
      id,
      name: b?.name || id,
      image: b?.image,
      roles: rd?.roles || [],
      tags: rd?.tags || [],
      reason: getBanReason(id, modeKey),
    };
  });
}

function getBanReason(id, mode) {
  const wr = WIN_RATES[id];
  const rd = ROLE_DATA[id];
  const tags = rd?.tags || [];
  const wrStr = wr ? `${Math.round(wr * 100)}% WR` : "";

  // Specific ban reasons based on meta knowledge
  const reasons = {
    crow:      "Poison poke + slow is oppressive. High presence across all modes.",
    sirius:    "Shadow clone creates impossible 2v1s. Rising ban priority post-patch.",
    leon:      "Invisible flank is unreadable in draft — you can't comp around what you can't see.",
    chester:   "Random kit makes him unpredictable to draft against. Consistently high pick rate.",
    sandy:     "Sandstorm makes an entire zone unreadable. Gem Grab nightmare.",
    otis:      "Silence super shuts down key abilities at the worst time.",
    mortis:    "Dash + lifesteal in Bounty is nearly unbeatable. Must-ban in Bounty/KO.",
    gene:      "Pull super sets up guaranteed kills. KO/Bounty game-changer.",
    glowy:     "Perma-banned for a reason — heal/damage flex is too versatile.",
    ziggy:     "Frequently banned — high zone control value in Hot Zone.",
    brock:     "Knockout specialist — long range burst + rocket rain zone denial.",
    lou:       "Freeze locks down Hot Zone entirely. Uncounterable in zone modes.",
    finx:      "Hot Zone specialist — hard to remove from the zone.",
    cordelius: "Shadow realm 1v1 removes a player from the fight. Anti-heal shuts down comps.",
    chuck:     "Rail mobility creates unpredictable flanks in Heist.",
    angelo:    "Long range poke + flight is oppressive in Knockout.",
    nita:      "Bear + Nita dual pressure overwhelms in Heist.",
  };

  if (reasons[id]) return reasons[id];
  if (wrStr) return `Strong in ${mode} — ${wrStr} competitive.`;
  return `High priority ban in ${mode}.`;
}

// ============================================================
// POST-DRAFT ANALYSIS — win probability + how to play it
// ============================================================

export function getPostDraftAnalysis(ourPicks, enemyPicks, map) {
  const analysis = analyzeDraftState(ourPicks, enemyPicks, map);
  const mode = map?.mode || "";
  const traits = map?.traits || {};
  const meta = META_BY_MAP[map?.name] || {};

  // ── Calculate draft favorability ──
  let ourScore = 50; // start neutral

  // Counter matchup advantage
  let ourCountered = 0, enemyCountered = 0;
  for (const p of ourPicks) {
    for (const e of enemyPicks) {
      if ((HARD_COUNTERS[p] || []).includes(e)) ourCountered++;
      if ((HARD_COUNTERS[e] || []).includes(p)) enemyCountered++;
    }
  }
  ourScore += (enemyCountered - ourCountered) * 4;

  // Win rate comparison
  const ourWR = ourPicks.map((p) => WIN_RATES[p]).filter((w) => w !== undefined);
  const enemyWR = enemyPicks.map((p) => WIN_RATES[p]).filter((w) => w !== undefined);
  const avgOur = ourWR.length ? ourWR.reduce((a, b) => a + b, 0) / ourWR.length : 0.5;
  const avgEnemy = enemyWR.length ? enemyWR.reduce((a, b) => a + b, 0) / enemyWR.length : 0.5;
  ourScore += (avgOur - avgEnemy) * 30;

  // Map meta — how often were these brawlers picked on this map
  const ourMapPicks = ourPicks.reduce((s, p) => s + (meta[p] || 0), 0);
  const enemyMapPicks = enemyPicks.reduce((s, p) => s + (meta[p] || 0), 0);
  if (ourMapPicks + enemyMapPicks > 0) {
    ourScore += (ourMapPicks - enemyMapPicks) * 1.5;
  }

  // Role balance — penalize if missing key roles
  if (analysis.our.supports === 0 && analysis.enemy.supports > 0) ourScore -= 4;
  if (analysis.our.tanks === 0 && analysis.our.assassins === 0) ourScore -= 3;
  if (analysis.our.antiTank === 0 && analysis.enemy.tanks >= 2) ourScore -= 5;
  if (analysis.enemy.antiTank === 0 && analysis.our.tanks >= 2) ourScore += 5;

  // Anti-tank vs tanks mismatch
  if (analysis.our.antiTank >= 2 && analysis.enemy.tanks >= 2) ourScore += 4;
  if (analysis.enemy.antiTank >= 2 && analysis.our.tanks >= 2) ourScore -= 4;

  // Clamp to 15-85 range (never say 0% or 100%)
  const winPct = Math.max(15, Math.min(85, Math.round(ourScore)));

  // ── Verdict ──
  let verdict;
  if (winPct >= 65) verdict = "Your draft is strong — you have clear advantages in this matchup.";
  else if (winPct >= 55) verdict = "Slight edge to your team — solid comp but don't get comfortable.";
  else if (winPct >= 45) verdict = "Even draft — this one comes down to execution and micro plays.";
  else if (winPct >= 35) verdict = "Enemy draft has the edge — they have better answers to your comp.";
  else verdict = "Tough matchup — enemy comp counters yours hard. You'll need to outplay.";

  // ── How to play it — per brawler tips ──
  const tips = ourPicks.map((id) => {
    const b = INDEX[id];
    const rd = ROLE_DATA[id] || {};
    const roles = rd.roles || [];
    const tags = rd.tags || [];
    const name = b?.name || id;
    const tipParts = [];

    // Role-based positioning
    if (TANKS.has(id)) {
      tipParts.push("Play frontline — absorb pressure and create space.");
      if (traits.openness === "open") tipParts.push("Use any cover available, don't rush into open ground.");
      if (analysis.enemy.antiTank >= 2) tipParts.push("Be careful — enemy has anti-tank tools. Don't overcommit.");
    } else if (ASSASSINS.has(id)) {
      tipParts.push("Look for picks on isolated targets.");
      if (traits.bushes === "heavy") tipParts.push("Use bush cover for ambush approaches.");
      if (analysis.enemy.tanks >= 2) tipParts.push("Avoid the tanks — focus squishier targets.");
    } else if (SHARPSHOOTERS.has(id)) {
      tipParts.push("Hold your lane and apply pressure from range.");
      if (traits.openness === "open") tipParts.push("This map is perfect for you — control sightlines.");
      if (traits.walls === "heavy") tipParts.push("Watch for throwers and wall-peeks — reposition often.");
    } else if (SUPPORTS.has(id)) {
      tipParts.push("Stay behind your frontline and keep the team healthy.");
      if (analysis.enemy.assassins >= 1) tipParts.push("Watch for dives — save your abilities for when they engage.");
    } else if (THROWERS.has(id)) {
      tipParts.push("Play behind walls and deny area.");
      if (analysis.enemy.assassins >= 1) {
        const assassinNames = enemyPicks.filter((e) => ASSASSINS.has(e)).map((e) => INDEX[e]?.name || e);
        tipParts.push(`Stay far from ${assassinNames.join("/")} — they will dive you.`);
      }
    } else if (roles.includes("Control")) {
      tipParts.push("Control the key areas and deny space.");
      if (mode === "Hot Zone") tipParts.push("Prioritize zone presence over kills.");
      if (mode === "Gem Grab") tipParts.push("Hold mid and protect the gem carrier.");
    } else {
      tipParts.push("Play your range and focus on consistent damage output.");
    }

    // Mode-specific
    if (mode === "Heist" && (tags.includes("High DPS") || tags.includes("Heist specialist") || tags.includes("Heist pick"))) {
      tipParts.push("Focus safe damage when you have an opening — that's your primary job.");
    }
    if (mode === "Brawl Ball" && TANKS.has(id)) {
      tipParts.push("Use your body to shield the ball carrier and create goal opportunities.");
    }
    if (mode === "Knockout") {
      tipParts.push("Don't die first — stay alive and trade efficiently.");
    }
    if (mode === "Bounty") {
      tipParts.push("Avoid unnecessary deaths — every kill matters for the star count.");
    }

    // Enemy-specific advice
    for (const e of enemyPicks) {
      if ((HARD_COUNTERS[id] || []).includes(e)) {
        tipParts.push(`Avoid direct fights with ${INDEX[e]?.name || e} — they hard-counter you.`);
        break;
      }
    }
    for (const e of enemyPicks) {
      const ec = HARD_COUNTERS[e] || [];
      if (ec.includes(id)) {
        tipParts.push(`You counter ${INDEX[e]?.name || e} — prioritize targeting them.`);
        break;
      }
    }

    return { id, name, image: b?.image, role: roles[0] || "Flex", tips: tipParts };
  });

  return { winPct, verdict, tips, analysis };
}

// ============================================================
// SETUP INTEL — contextual data for the setup side panel
// ============================================================

export function getModeIntel(mode) {
  if (!mode) return null;
  const banIds = MODE_BAN_PRIORITY[mode] || [];
  const bans = banIds.slice(0, 5).map((id) => ({
    id, name: INDEX[id]?.name || id, image: INDEX[id]?.image,
    reason: getBanReason(id, mode),
  }));

  // Aggregate top picks across all maps for this mode
  const modeMaps = MAPS.filter((m) => m.mode === mode);
  const pickCounts = {};
  for (const m of modeMaps) {
    const meta = META_BY_MAP[m.name] || {};
    for (const [bid, count] of Object.entries(meta)) {
      pickCounts[bid] = (pickCounts[bid] || 0) + count;
    }
  }
  const topPicks = Object.entries(pickCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id, picks]) => ({
      id, name: INDEX[id]?.name || id, image: INDEX[id]?.image, picks,
      wr: WIN_RATES[id] !== undefined ? Math.round(WIN_RATES[id] * 100) : null,
    }));

  // Mode-level insight
  const modeInsights = {
    "Gem Grab": "Control and sustain dominate. Hold mid, protect the gem carrier. Assassins can work but need the right map.",
    "Brawl Ball": "Aggro meta — tanks, knockback, and ball carriers. Gale is trap-tier (27% WR). Leon and Charlie are kings.",
    "Bounty": "Long range and pick potential. Mortis is either banned or dominant. Gene pull = guaranteed kills.",
    "Heist": "Safe DPS is everything — Colt, Rico, Melodie. Wall breakers open angles in overtime. Protect or destroy the safe.",
    "Hot Zone": "Zone presence and sustained damage. Lou is the mode king (69% WR). Single-zone maps favor AoE and healing.",
    "Knockout": "Elimination format — every death matters. Sharpshooters and control brawlers excel. Don't die first.",
  };

  return { bans, topPicks, insight: modeInsights[mode] || "", mapCount: modeMaps.length };
}

export function getMapIntel(mapId) {
  const map = MAPS.find((m) => m.id === mapId);
  if (!map) return null;
  const meta = META_BY_MAP[map.name] || {};

  const topPicks = Object.entries(meta)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, picks]) => ({
      id, name: INDEX[id]?.name || id, image: INDEX[id]?.image, picks,
      wr: WIN_RATES[id] !== undefined ? Math.round(WIN_RATES[id] * 100) : null,
    }));

  const totalPicks = Object.values(meta).reduce((a, b) => a + b, 0);
  const traits = map.traits || {};

  return { map, topPicks, totalPicks, traits };
}

// Expose role data for UI grouping
export function getBrawlerRole(id) {
  return ROLE_DATA[id] || null;
}

export function getAllRoles() {
  return ROLE_DATA;
}

// ============================================================
// META TIER LIST — AshBS April 2026 Edition
// Star rating system (6 = dominant, 1 = weak)
// Display only — does NOT feed into engine scoring.
// Engine uses BSC pro data, counters, synergies, and map logic.
// ============================================================
const META_TIERS = {
  6: ["sirius", "pierce", "bull", "bibi", "leon", "crow", "mortis", "clancy", "chester", "najia", "emz"],
  5: ["poco", "colt", "otis", "kaze", "kenji", "angelo", "amber", "cordelius", "lily", "gray", "byron", "rico", "frank", "gene", "gus", "nani", "nita", "bo", "charlie", "ruffs", "glowy", "mina", "brock", "ziggy", "spike"],
  4: ["tara", "alli", "belle", "r_t", "penny", "janet", "meeple", "juju", "squeak", "piper", "shade", "shelly", "ollie", "pam", "max", "moe", "carl", "finx", "bea"],
  3: ["willow", "jae_yong", "kit", "8_bit", "griff", "berry", "hank", "barley", "gigi", "melodie", "trunk", "buster", "sandy", "gale", "stu", "doug"],
  2: ["dynamike", "buzz", "sprout", "fang", "pearl", "lumi", "tick", "mandy", "ash", "eve", "rosa", "draco", "meg", "lola", "bonnie", "mico", "darryl", "colette", "maisie", "lou"],
  1: ["edgar", "el_primo", "grom", "jacky", "jessie", "chuck", "mr_p", "sam", "surge"],
};

export function getMetaTierList() {
  const tiers = {};
  for (const [stars, ids] of Object.entries(META_TIERS)) {
    tiers[stars] = ids.map((id) => {
      const brawler = BRAWLERS.find((b) => b.id === id);
      return {
        id,
        name: brawler?.name || id,
        image: brawler?.image || "",
        role: ROLE_DATA[id]?.roles?.[0] || "Damage",
      };
    });
  }
  return tiers;
}
