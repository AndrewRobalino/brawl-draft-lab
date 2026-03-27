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
  leon:      { roles: ["Assassin"], tags: ["Invis", "Buffy", "Clone swap"], antiTank: false },
  crow:      { roles: ["Assassin", "Control"], tags: ["Poison", "Buffy", "Bouncing kunai"], antiTank: false },
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
  clancy:   { roles: ["Damage"], tags: ["High DPS"], antiTank: true },
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
  gigi:     { roles: ["Damage"], tags: ["Projectile"], antiTank: false },
  maisie:   { roles: ["Damage"], tags: ["Charged shot"], antiTank: true },
  najia:    { roles: ["Damage"], tags: ["Poison stacker"], antiTank: false },
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
  eve: 0.833, pam: 0.800, colt: 0.800, kaze: 0.750, lily: 0.700,
  lou: 0.692, nani: 0.667, mortis: 0.650, leon: 0.650, brock: 0.625,
  emz: 0.615, nita: 0.615, charlie: 0.611, shelly: 0.600, melodie: 0.600,
  darryl: 0.600, belle: 0.571, sandy: 0.571, penny: 0.571, kit: 0.556,
  ruffs: 0.524, pierce: 0.526, spike: 0.500, otis: 0.500, stu: 0.500,
  r_t: 0.500, crow: 0.500, chester: 0.481, bo: 0.471, gene: 0.462,
  gale: 0.438, bull: 0.429, bibi: 0.429, janet: 0.444,
  meeple: 0.400, rico: 0.400, squeak: 0.400, gus: 0.385,
  byron: 0.353, kenji: 0.231,
};

// Mode-specific pick weights — from BSC 2026 mode analysis
// Higher = stronger in that mode based on actual competitive results
const MODE_WEIGHTS = {
  "Brawl Ball": {
    leon: 5, charlie: 5, max: 5, bibi: 4, meeple: 3, pierce: 3,
    emz: 3, poco: 3, gale: 2, chester: 2, otis: 2, stu: 2,
    el_primo: 2, bull: 2, nita: 2, buzz: 2,
  },
  "Gem Grab": {
    chester: 5, lily: 4, otis: 4, sandy: 3, charlie: 3, emz: 3,
    mortis: 2, janet: 3, spike: 3, nita: 3, bibi: 2, ruffs: 2,
    pam: 2, shelly: 2, bo: 2, tara: 2,
  },
  "Knockout": {
    eve: 5, gene: 5, brock: 4, crow: 4, r_t: 3, byron: 3,
    nani: 3, gus: 3, belle: 3, pierce: 3, bo: 2, leon: 2,
    squeak: 2, jae_yong: 2, pearl: 2, ollie: 2, darryl: 2,
  },
  "Hot Zone": {
    lou: 5, ruffs: 4, stu: 3, emz: 3, chester: 2, spike: 2,
    finx: 2, poco: 2, mina: 2, draco: 2, pierce: 2, kenji: 2,
    griff: 2, bibi: 1, bo: 2, mortis: 2, bull: 2,
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
  },
};

// Brawlers that should always be banned per-mode (from BSC ban data)
const MODE_BAN_PRIORITY = {
  "Brawl Ball": ["crow", "otis", "chester", "emz", "leon"],
  "Gem Grab": ["crow", "sandy", "emz", "chester", "otis"],
  "Knockout": ["angelo", "gene", "leon", "brock", "crow"],
  "Hot Zone": ["crow", "ziggy", "poco", "finx", "lou"],
  "Bounty": ["mortis", "crow", "byron", "leon", "gene"],
  "Heist": ["crow", "cordelius", "chuck", "nita", "otis"],
};

// ============================================================
// HARD COUNTER TABLE — expanded with BSC 2026 meta awareness
// ============================================================
const HARD_COUNTERS = {
  // Tank counters
  frank:    ["colette", "spike", "emz", "bea", "clancy", "shelly"],
  bibi:     ["colette", "spike", "emz", "bea"],
  bull:     ["colette", "spike", "emz", "shelly", "bea"],
  el_primo: ["colette", "spike", "emz", "crow"],
  rosa:     ["colette", "spike", "emz"],
  darryl:   ["spike", "emz", "shelly"],
  meg:      ["colette", "spike", "emz"],
  // Sharpshooter counters
  piper:    ["nani", "mandy", "belle", "mortis"],
  belle:    ["mandy", "nani"],
  rico:     ["spike"],
  // Assassin counters
  mortis:   ["shelly", "bull", "frank", "bibi"],
  leon:     ["shelly", "bull", "frank", "emz"],
  crow:     ["shelly", "bull"],
  // Support counters
  poco:     ["crow", "cordelius"],
  byron:    ["crow", "cordelius"],
  // Control counters
  sandy:    ["crow", "leon"],
  // Overrated pick punishment
  gale:     ["leon", "mortis", "charlie"],
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
  lou:     ["ruffs", "spike"],
  emz:     ["mortis", "pierce"],
  mortis:  ["emz", "pierce"],
  crow:    ["brock", "pearl"],
  brock:   ["crow"],
  leon:    ["charlie", "pierce"],
  spike:   ["lou"],
};

// ============================================================
// SCORING
// ============================================================

function getMapMeta(mapId) {
  const map = MAPS.find((m) => m.id === mapId);
  if (!map) return { map: null, meta: {} };
  const entry = META_BY_MAP[map.name] || {};
  return { map, meta: entry };
}

function scoreBrawler({ id, map, meta, ourPicks, enemyPicks }) {
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

  // 7. TANK STACKING PENALTY — don't over-stack tanks
  const ourTankCount = ourPicks.filter((p) => TANKS.has(p)).length;
  if (ourTankCount >= 2 && TANKS.has(id) && mode !== "Brawl Ball") {
    score -= 4;
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

  return { id, score, roles, antiTank: antiTankFlag };
}

// ============================================================
// EXPLANATIONS
// ============================================================

function buildExplanation({ brawlerId, map, meta, enemyPicks, ourPicks, roles, antiTank, advanced }) {
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

  const short = `${name} — ${roleText} pick for ${map?.name || "this map"}.`;
  const long = parts.join(" ");

  return { short, long: advanced ? long : parts.slice(0, 2).join(" ") };
}

// ============================================================
// PUBLIC API
// ============================================================

export function getRecommendations({ mapId, ourPicks, enemyPicks, bans, advanced }) {
  const { map, meta } = getMapMeta(mapId);
  if (!map) return [];

  const taken = new Set([
    ...(ourPicks || []),
    ...(enemyPicks || []),
    ...(bans || []),
  ]);

  const scored = [];

  for (const b of BRAWLERS) {
    if (taken.has(b.id)) continue;
    const s = scoreBrawler({
      id: b.id,
      map,
      meta,
      ourPicks: ourPicks || [],
      enemyPicks: enemyPicks || [],
    });
    scored.push(s);
  }

  if (!scored.length) return [];

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 5);
  const best = top[0]?.score ?? 0;
  const second = top[1]?.score ?? best - 1;

  return top.map((entry, idx) => {
    const b = INDEX[entry.id];
    const expl = buildExplanation({
      brawlerId: entry.id,
      map,
      meta,
      enemyPicks: enemyPicks || [],
      ourPicks: ourPicks || [],
      roles: entry.roles,
      antiTank: entry.antiTank,
      advanced,
    });

    const tags = [];
    if ((meta[entry.id] || 0) > 0) tags.push("Map meta");
    if (entry.roles?.length) tags.push(entry.roles.join(" / "));
    if (entry.antiTank) tags.push("Anti-tank");

    const wr = WIN_RATES[entry.id];
    if (wr !== undefined && wr >= 0.65) tags.push("High WR");

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
}

export function getBanSuggestions({ mapId, mode }) {
  const modeKey = mode || MAPS.find((m) => m.id === mapId)?.mode;
  return MODE_BAN_PRIORITY[modeKey] || [];
}
