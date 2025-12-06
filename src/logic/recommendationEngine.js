import { BRAWLERS } from "../data/brawlers";
import { MAPS } from "../data/maps";
import { META_BY_MAP } from "../data/metaByMap";

const INDEX = Object.fromEntries(BRAWLERS.map((b) => [b.id, b]));

/**
 * Very lightweight role / tag data so the engine has some idea of what each
 * brawler actually does, beyond just “was it picked at Worlds”.
 */
const ROLE_DATA = {
  frank: { roles: ["Tank"], tags: ["Huge HP", "Stun threat"], antiTank: false },
  bibi: { roles: ["Tank"], tags: ["Knockback", "Lane bully"], antiTank: false },
  meg: { roles: ["Tank"], tags: ["Hybrid"], antiTank: false },
  bull: { roles: ["Tank"], tags: ["Close burst"], antiTank: false },
  ash: { roles: ["Tank"], tags: ["Snowball tank"], antiTank: false },
  sam: { roles: ["Tank"], tags: ["Scrapper"], antiTank: true },
  doug: { roles: ["Tank", "Support"], tags: ["Revive"], antiTank: false },

  piper: { roles: ["Sharpshooter"], tags: ["Long range"], antiTank: false },
  belle: { roles: ["Sharpshooter"], tags: ["Marking"], antiTank: false },
  rico: { roles: ["Sharpshooter"], tags: ["Wall bounce"], antiTank: false },
  brock: { roles: ["Sharpshooter"], tags: ["Area denial"], antiTank: false },
  colt: { roles: ["Sharpshooter"], tags: ["High DPS"], antiTank: true },
  mandy: { roles: ["Sharpshooter"], tags: ["Piercing snipe"], antiTank: false },
  nani: { roles: ["Sharpshooter"], tags: ["Burst, Piper counter"], antiTank: false },

  gus: { roles: ["Support", "Mid"], tags: ["Shields"], antiTank: true },
  pam: { roles: ["Support", "Mid"], tags: ["Healing"], antiTank: false },
  poco: { roles: ["Support"], tags: ["Team heal"], antiTank: false },
  max: { roles: ["Support", "Hybrid"], tags: ["Speed"], antiTank: false },

  spike: { roles: ["Damage"], tags: ["Tank shredder"], antiTank: true },
  emz: { roles: ["Control"], tags: ["Anti-tank cone"], antiTank: true },
  colette: { roles: ["Damage"], tags: ["Tank cutter"], antiTank: true },
  cassidy: { roles: ["Damage"], tags: ["Burst"], antiTank: true },
  clancy: { roles: ["Damage"], tags: ["High DPS"], antiTank: true },

  tara: { roles: ["Control"], tags: ["Pull"], antiTank: false },
  sprout: { roles: ["Thrower"], tags: ["Wall control"], antiTank: false },
  barley: { roles: ["Thrower"], tags: ["Area denial"], antiTank: false },
  tick: { roles: ["Thrower"], tags: ["Zone control"], antiTank: false },

  cordelius: { roles: ["Assassin"], tags: ["Anti-heal"], antiTank: true },
  lou: { roles: ["Control"], tags: ["Freeze"], antiTank: true },
};

const TANKS = new Set([
  "frank",
  "bibi",
  "meg",
  "bull",
  "ash",
  "sam",
  "doug",
  "jacky",
  "rosa",
  "buzz",
  "el_primo",
]);

/**
 * Very small hard-counter table so niche picks like Nani vs Piper actually
 * get surfaced correctly.
 */
const HARD_COUNTERS = {
  piper: ["nani", "mandy", "belle"],
  belle: ["mandy", "nani"],
  rico: ["spike"], // spike punishes tight lanes Rico likes
  frank: ["colette", "spike", "emz", "cassidy", "clancy"],
  bibi: ["colette", "spike", "emz", "cassidy", "clancy"],
  meg: ["colette", "spike", "emz", "cassidy", "clancy"],
};

function getMapMeta(mapId) {
  const map = MAPS.find((m) => m.id === mapId);
  if (!map) return { map: null, meta: {} };
  const entry = META_BY_MAP[map.name] || {};
  return { map, meta: entry };
}

function scoreBrawler({ id, map, meta, ourPicks, enemyPicks }) {
  const baseMeta = meta[id] || 0;
  let score = baseMeta * 1.7;

  const roleInfo = ROLE_DATA[id] || {};
  const roles = roleInfo.roles || [];
  const antiTankFlag = !!roleInfo.antiTank;
  const mode = map?.mode || "";

  // Mode preferences
  if (mode === "Brawl Ball") {
    if (roles.includes("Tank")) score += 3.4;
    if (roles.includes("Sharpshooter")) score += 2.2;
  } else if (mode === "Gem Grab") {
    if (roles.includes("Support") || roles.includes("Mid") || roles.includes("Control"))
      score += 2.6;
  } else if (mode === "Bounty") {
    if (roles.includes("Sharpshooter")) score += 3.4;
    if (roles.includes("Thrower")) score += 1.9;
  } else if (mode === "Hot Zone") {
    if (roles.includes("Control") || roles.includes("Tank")) score += 2.8;
  } else if (mode === "Heist") {
    if (roles.includes("Damage") || roles.includes("Tank")) score += 2.4;
  } else if (mode === "Knockout") {
    if (roles.includes("Sharpshooter") || roles.includes("Control")) score += 2.7;
  }

  // Anti-tank value
  const enemyTankCount = enemyPicks.filter((p) => TANKS.has(p)).length;
  if (enemyTankCount >= 2 && antiTankFlag) {
    score += 6;
  } else if (enemyTankCount === 1 && antiTankFlag) {
    score += 3.6;
  }

  // Don't over-stack tanks unless mode really wants it
  const ourTankCount = ourPicks.filter((p) => TANKS.has(p)).length;
  if (
    ourTankCount >= 2 &&
    TANKS.has(id) &&
    mode !== "Brawl Ball" &&
    mode !== "Heist"
  ) {
    score -= 3.2;
  }

  // Light permanent bumps for very meta brawlers
  if (["piper", "belle", "meg", "gus", "spike", "rico"].includes(id)) {
    score += 1.1;
  }

  // Explicit hard counters (e.g. Nani vs Piper)
  for (const enemy of enemyPicks) {
    const counters = HARD_COUNTERS[enemy];
    if (counters && counters.includes(id)) {
      score += 5.5;
    }
  }

  return { id, score, roles, antiTank: antiTankFlag };
}

function buildExplanation({
  brawlerId,
  map,
  meta,
  enemyPicks,
  roles,
  antiTank,
  advanced,
}) {
  const b = INDEX[brawlerId];
  if (!b) return { short: "", long: "" };

  const mode = map?.mode || "";
  const name = b.name;
  const picksOnMap = meta[brawlerId] || 0;
  const enemyTankCount = enemyPicks.filter((p) => TANKS.has(p)).length;
  const roleText = roles.length ? roles.join(" / ") : "flex";

  const metaSnippet =
    picksOnMap > 0
      ? `${name} showed up ${picksOnMap} time${
          picksOnMap > 1 ? "s" : ""
        } on this map in recent drafts.`
      : `${name} wasn't a common pick here, but fits the current comp.`;

  let antiTankSnippet = "";
  if (enemyTankCount >= 2 && antiTank) {
    antiTankSnippet =
      " It directly punishes tank-heavy comps and helps flip otherwise rough lanes.";
  } else if (enemyTankCount === 1 && antiTank) {
    antiTankSnippet =
      " It gives you a clean answer into the enemy tank without over-committing your whole draft.";
  }

  const modeSnippet = (() => {
    if (!mode) return "";
    if (mode === "Brawl Ball")
      return " Ball rewards engage tools and lane control, which this pick supports.";
    if (mode === "Gem Grab")
      return " Gem Grab values mid stability and setup, which this pick helps with.";
    if (mode === "Bounty")
      return " Bounty is all about safe range and not feeding, which suits this brawler's kit.";
    if (mode === "Hot Zone")
      return " Hot Zone needs space control and hold power, which this brawler can provide.";
    if (mode === "Heist")
      return " In Heist, consistent DPS and safe damage routes are huge, which this pick offers.";
    if (mode === "Knockout")
      return " Knockout rewards value trades and staying alive, which this pick enables when played well.";
    return "";
  })();

  const short = `${name} acts as a ${roleText} pick on ${map?.name || "this map"}.`;
  const longBase = metaSnippet + antiTankSnippet + modeSnippet;
  const long = advanced ? longBase : metaSnippet + antiTankSnippet;

  return { short, long };
}

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

  // Keep top 3 to stay fast in draft
  const top = scored.slice(0, 3);
  const best = top[0]?.score ?? 0;
  const second = top[1]?.score ?? best - 1;

  return top.map((entry, idx) => {
    const b = INDEX[entry.id];
    const expl = buildExplanation({
      brawlerId: entry.id,
      map,
      meta,
      enemyPicks: enemyPicks || [],
      roles: entry.roles,
      antiTank: entry.antiTank,
      advanced,
    });

    const tags = [];
    if ((meta[entry.id] || 0) > 0) tags.push("Meta");
    if (entry.roles && entry.roles.length) tags.push(entry.roles.join(" / "));
    if (entry.antiTank) tags.push("Anti-tank");
    if (idx === 0) tags.push("Safest pick");

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
