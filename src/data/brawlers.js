// ============================================================
//  AUTO-IMPORT BRAWLER IMAGES (Vite dynamic import)
// ============================================================

// Import every .webp file inside the brawlers folder
const images = import.meta.glob("./brawlers/*.webp", { eager: true });

// Helper: turn "./brawlers/8_bit.webp" → "8_bit"
function extractId(path) {
  return path.split("/").pop().replace(".webp", "");
}

// Helper: convert ID → Display Name (simple formatting)
function prettyName(id) {
  return id
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Build the BRAWLERS array dynamically from the files
export const BRAWLERS = Object.keys(images).map((path) => {
  const id = extractId(path);

  return {
    id,
    name: prettyName(id),
    image: images[path].default,
  };
});

// Sort alphabetically for consistent UI
BRAWLERS.sort((a, b) => a.name.localeCompare(b.name));
