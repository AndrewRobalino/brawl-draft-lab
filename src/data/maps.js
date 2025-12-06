// ============================================================
//  AUTO-IMPORT MAP IMAGES (Vite dynamic import)
// ============================================================

// Grab all .png and .webp files inside /maps/
const images = import.meta.glob("./maps/*.{png,webp}", { eager: true });

// Extract map ID from filename: "./maps/hot_potato.png" → "hot_potato"
function extractId(path) {
  return path.split("/").pop().replace(/\.(png|webp)$/, "");
}

// Pretty name: "hot_potato" → "Hot Potato"
function prettyName(id) {
  return id
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Determine mode from map name
function inferMode(name) {
  const lower = name.toLowerCase();
  if (lower.includes("gem")) return "Gem Grab";
  if (lower.includes("brawl") || lower.includes("ball")) return "Brawl Ball";
  if (lower.includes("bounty")) return "Bounty";
  if (lower.includes("heist")) return "Heist";
  if (lower.includes("zone") || lower.includes("hot")) return "Hot Zone";
  if (lower.includes("knock")) return "Knockout";

  // default fallback mode if unable to detect
  return "Gem Grab";
}

// Build MAP objects dynamically
export const MAPS = Object.keys(images).map((path) => {
  const id = extractId(path);
  const name = prettyName(id);

  return {
    id,
    name,
    mode: inferMode(name), // attempt auto-detection
    image: images[path].default,
  };
});

// Alphabetize maps for consistent UI
MAPS.sort((a, b) => a.name.localeCompare(b.name));
