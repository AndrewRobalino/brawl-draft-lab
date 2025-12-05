import { DRAFTS } from "../data/drafts";
import { BRAWLERS } from "../data/brawlers";
import { MAPS } from "../data/maps";

const brawlerIndex = Object.fromEntries(BRAWLERS.map(b => [b.id, b]));
const mapIndex = Object.fromEntries(MAPS.map(m => [m.id, m]));

// Precompute pick frequencies per map
const mapPickCounts = {};
for (const d of DRAFTS) {
  if (!mapPickCounts[d.mapId]) mapPickCounts[d.mapId] = {};
  for (const b of d.picks) {
    mapPickCounts[d.mapId][b] = (mapPickCounts[d.mapId][b] || 0) + 1;
  }
}

function computeMetaScore(mapId, brawlerId) {
  const counts = mapPickCounts[mapId] || {};
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (!total) return 0.25; // still allow consideration
  const c = counts[brawlerId] || 0;
  return 0.25 + (c / total) * 1.25; // between 0.25 and 1.5-ish
}

function detectTeamShape(brawlerIds) {
  const counts = { Tank: 0, Sharpshooter: 0, Support: 0, Thrower: 0, Assassin: 0, Control: 0 };
  for (const id of brawlerIds) {
    const b = brawlerIndex[id];
    if (!b || !b.role) continue;
    if (counts[b.role] != null) counts[b.role]++;
  }
  return counts;
}

export function getRecommendations({
  mapId,
  ourPicks,
  enemyPicks,
  bans,
  advanced = false,
}) {
  if (!mapId) return [];

  const unavailable = new Set([...ourPicks, ...enemyPicks, ...bans]);
  const map = mapIndex[mapId];

  const ourShape = detectTeamShape(ourPicks);
  const enemyShape = detectTeamShape(enemyPicks);

  const scores = [];

  for (const b of BRAWLERS) {
    if (unavailable.has(b.id)) continue;

    let score = computeMetaScore(mapId, b.id);
    const tags = new Set();

    // Role-based nudges
    if (b.role === "Tank") {
      if (map.mode === "Brawl Ball" || map.mode === "Knockout") {
        score += 0.15;
        tags.add("Frontline");
      }
      if ((enemyShape.Sharpshooter || 0) >= 2) {
        score -= 0.12;
        tags.add("Risky vs range");
      }
    }

    if (b.role === "Sharpshooter") {
      if (["Bounty", "Knockout"].includes(map.mode)) {
        score += 0.2;
        tags.add("Lane Control");
      }
      if ((enemyShape.Tank || 0) >= 2) {
        score += 0.08;
        tags.add("Anti-frontline");
      }
    }

    if (b.role === "Thrower") {
      if (["Hot Zone", "Gem Grab"].includes(map.mode)) {
        score += 0.12;
        tags.add("Area Denial");
      }
    }

    if (b.role === "Support") {
      if ((ourShape.Tank || 0) >= 1) {
        score += 0.12;
        tags.add("Enables tanks");
      }
    }

    // Niche anti-tank case for things like Clancy-Gus-style DPS
    if (["clancy", "gus", "colt", "rico", "pam"].includes(b.id)) {
      if ((enemyShape.Tank || 0) >= 2) {
        score += 0.16;
        tags.add("Shreds tanks");
      }
    }

    scores.push({ brawler: b, score, extraTags: Array.from(tags) });
  }

  scores.sort((a, b) => b.score - a.score);
  const top = scores.slice(0, 3);

  if (!top.length) return [];

  const bestScore = top[0].score;
  const secondScore = top[1] ? top[1].score : 0;
  const mustPick = bestScore - secondScore >= 0.28; // clear gap

  return top.map((entry, idx) => {
    const { brawler, score, extraTags } = entry;
    const metaScore = computeMetaScore(mapId, brawler.id);

    const labels = [];
    if (metaScore > 0.9) labels.push("Meta");
    else if (metaScore > 0.55) labels.push("Safe Pick");
    else labels.push("Situational");

    if (["Hot Zone", "Gem Grab"].includes(map.mode)) {
      labels.push("Control");
    }

    const allTags = Array.from(new Set([...labels, ...(brawler.tags || []), ...extraTags]));

    let shortExplanation = `${brawler.name} is a solid pick here.`;
    let longExplanation = shortExplanation;

    if (labels.includes("Meta")) {
      shortExplanation = `${brawler.name} is a top meta pick on ${map.name}.`;
    } else if (labels.includes("Safe Pick")) {
      shortExplanation = `${brawler.name} is a safe, consistent option on this map.`;
    } else if (labels.includes("Situational")) {
      shortExplanation = `${brawler.name} shines in specific drafts on this map.`;
    }

    if (extraTags.includes("Shreds tanks")) {
      shortExplanation = `${brawler.name} punishes tank-heavy comps.`;
    }

    if (advanced) {
      const parts = [];
      parts.push(`Pick data: this suggestion is based on how often ${brawler.name} was drafted on ${map.name} and similar maps in Worlds.`);
      if (labels.includes("Meta")) {
        parts.push(`${brawler.name} appears frequently as a winning or highly contested option.`);
      }
      if (extraTags.includes("Shreds tanks")) {
        parts.push(`Enemy comp has multiple frontline/tank-style picks, so high DPS/anti-tank helps swing lanes.`);
      }
      if (b.role) {
        parts.push(`${brawler.name} is categorized as a ${b.role}, helping your team balance roles.`);
      }
      longExplanation = parts.join(" ");
    }

    return {
      id: brawler.id,
      name: brawler.name,
      image: brawler.image,
      role: brawler.role,
      tags: allTags,
      shortExplanation,
      longExplanation,
      score,
      mustPick: mustPick && idx === 0,
    };
  });
}
