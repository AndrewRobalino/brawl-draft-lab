// Maps data — BSC 2026 competitive map pool + legacy maps
// Modes corrected based on BSC 2026 March Monthly Finals data
//
// traits: map-specific metadata that affects drafting logic
//   walls:    "heavy" | "moderate" | "light" | "open" — wall density
//   lanes:    number of distinct lanes / choke points
//   bushes:   "heavy" | "moderate" | "light" — bush coverage
//   zones:    (Hot Zone only) 1 or 2 — number of capture zones
//   openness: "closed" | "mixed" | "open" — how exposed the map is
//   notes:    short freeform text for engine context

export const MAPS = [
  // ---------- GEM GRAB ----------
  {
    id: "hard_rock_mine",
    name: "Hard Rock Mine",
    mode: "Gem Grab",
    image: "/assets/maps/hard_rock_mine.png",
    traits: { walls: "heavy", lanes: 3, bushes: "moderate", openness: "closed", notes: "Tight 3-lane with heavy walls; throwers and control excel. Gem mine in center." },
  },
  {
    id: "double_swoosh",
    name: "Double Swoosh",
    mode: "Gem Grab",
    image: "/assets/maps/double_swoosh.png",
    traits: { walls: "moderate", lanes: 3, bushes: "moderate", openness: "mixed", notes: "Curved wall formations create wide mid lane. Good for control + aggro hybrid." },
  },
  {
    id: "deathcap_trap",
    name: "Deathcap Trap",
    mode: "Gem Grab",
    image: "/assets/maps/deathcap_trap.png",
    traits: { walls: "moderate", lanes: 3, bushes: "heavy", openness: "closed", notes: "Heavy bush coverage makes assassins and invis brawlers strong. Ambush-heavy." },
  },
  {
    id: "undermine",
    name: "Undermine",
    mode: "Gem Grab",
    image: "/assets/maps/undermine.png",
    traits: { walls: "moderate", lanes: 3, bushes: "moderate", openness: "mixed", notes: "Balanced Gem Grab layout. Center gem mine with moderate cover. Versatile picks do well." },
  },
  {
    id: "temple_ruins",
    name: "Temple Ruins",
    mode: "Gem Grab",
    image: "/assets/maps/temple_ruins.png",
    traits: { walls: "heavy", lanes: 3, bushes: "heavy", openness: "closed", notes: "Dense layout with heavy walls and bushes. Close range and assassins thrive. Throwers strong behind walls." },
  },

  // ---------- BRAWL BALL ----------
  {
    id: "pinhole_punt",
    name: "Pinhole Punt",
    mode: "Brawl Ball",
    image: "/assets/maps/pinhole_punt.png",
    traits: { walls: "heavy", lanes: 2, bushes: "light", openness: "closed", notes: "Tight choke points around the goal. Knockback and stun dominate. Walls break in OT opening the map." },
  },
  {
    id: "sneaky_fields",
    name: "Sneaky Fields",
    mode: "Brawl Ball",
    image: "/assets/maps/sneaky_fields.png",
    traits: { walls: "moderate", lanes: 3, bushes: "heavy", openness: "mixed", notes: "Heavy bush lanes favor assassins and ambush plays. Bush-checking is critical." },
  },
  {
    id: "triple_dribble",
    name: "Triple Dribble",
    mode: "Brawl Ball",
    image: "/assets/maps/triple_dribble.png",
    traits: { walls: "moderate", lanes: 3, bushes: "moderate", openness: "mixed", notes: "Wide mid lane with side paths. Balanced map, most comps viable." },
  },
  {
    id: "super_beach",
    name: "Super Beach",
    mode: "Brawl Ball",
    image: "/assets/maps/super_beach.png",
    traits: { walls: "light", lanes: 3, bushes: "light", openness: "open", notes: "Open map — long range and DPS thrive. Tanks struggle with no cover to approach." },
  },

  // ---------- BOUNTY ----------
  {
    id: "layer_cake",
    name: "Layer Cake",
    mode: "Bounty",
    image: "/assets/maps/layer_cake.png",
    traits: { walls: "moderate", lanes: 3, bushes: "moderate", openness: "mixed", notes: "4-layer map, each with wall clumps and bush strips. Long range strong; walls break late exposing positions." },
  },
  {
    id: "shooting_star",
    name: "Shooting Star",
    mode: "Bounty",
    image: "/assets/maps/shooting_star.png",
    traits: { walls: "light", lanes: 3, bushes: "light", openness: "open", notes: "Very open map with minimal cover. Sharpshooters dominate. Assassins struggle to approach." },
  },
  {
    id: "hideout",
    name: "Hideout",
    mode: "Bounty",
    image: "/assets/maps/hideout.png",
    traits: { walls: "heavy", lanes: 2, bushes: "heavy", openness: "closed", notes: "Dense walls and bushes. Assassins and close-range thrive. Long range gets ambushed." },
  },

  // ---------- HEIST ----------
  {
    id: "hot_potato",
    name: "Hot Potato",
    mode: "Heist",
    image: "/assets/maps/hot_potato.png",
    traits: { walls: "moderate", lanes: 3, bushes: "light", openness: "mixed", notes: "Center lane is main safe approach. Wall-break DPS opens safe angles. Moderate choke points." },
  },
  {
    id: "safe_zone",
    name: "Safe Zone",
    mode: "Heist",
    image: "/assets/maps/safe_zone.png",
    traits: { walls: "heavy", lanes: 2, bushes: "moderate", openness: "closed", notes: "Tight corridors to safe. Throwers and wall-break brawlers strong. Hard to rush." },
  },
  {
    id: "kaboom_canyon",
    name: "Kaboom Canyon",
    mode: "Heist",
    image: "/assets/maps/kaboom_canyon.png",
    traits: { walls: "light", lanes: 3, bushes: "moderate", openness: "open", notes: "Mostly open with scattered edge walls. Sharpshooters and safe DPS from range. Bushes arc around safes." },
  },
  {
    id: "pit_stop",
    name: "Pit Stop",
    mode: "Heist",
    image: "/assets/maps/pit_stop.png",
    traits: { walls: "moderate", lanes: 3, bushes: "moderate", openness: "mixed", notes: "Balanced Heist map. Multiple approach angles to safe. Versatile picks work." },
  },

  // ---------- HOT ZONE ----------
  {
    id: "open_business",
    name: "Open Business",
    mode: "Hot Zone",
    image: "/assets/maps/open_business.png",
    traits: { walls: "light", lanes: 3, bushes: "moderate", zones: 1, openness: "open", notes: "Single zone, limited cover near zone. Side bush strips stop midway. Open fights favor range and control." },
  },
  {
    id: "dueling_beetles",
    name: "Dueling Beetles",
    mode: "Hot Zone",
    image: "/assets/maps/dueling_beetles.png",
    traits: { walls: "moderate", lanes: 4, bushes: "moderate", zones: 1, openness: "mixed", notes: "Single center zone with 4 closed lane entrances and 2 bush entrances. Choke-heavy; zone control and knockback strong." },
  },
  {
    id: "ring_of_fire",
    name: "Ring of Fire",
    mode: "Hot Zone",
    image: "/assets/maps/ring_of_fire.png",
    traits: { walls: "light", lanes: 3, bushes: "heavy", zones: 1, openness: "mixed", notes: "Single zone with large bush clusters across center. Few covers near zone. AoE and sustained damage thrive; bushes enable ambush plays." },
  },

  // ---------- KNOCKOUT ----------
  {
    id: "out_in_the_open",
    name: "Out in the Open",
    mode: "Knockout",
    image: "/assets/maps/out_in_the_open.png",
    traits: { walls: "light", lanes: 3, bushes: "light", openness: "open", notes: "Very open with minimal cover. Long range and mobility dominate. Assassins and tanks exposed." },
  },
  {
    id: "goldarm_gulch",
    name: "Goldarm Gulch",
    mode: "Knockout",
    image: "/assets/maps/goldarm_gulch.png",
    traits: { walls: "heavy", lanes: 3, bushes: "moderate", openness: "closed", notes: "Walled near spawns, throwers viable. Walls provide safe fall-back positions. Mixed range works." },
  },
  {
    id: "belles_rock",
    name: "Belle's Rock",
    mode: "Knockout",
    image: "/assets/maps/belles_rock.png",
    traits: { walls: "moderate", lanes: 3, bushes: "moderate", openness: "mixed", notes: "Balanced KO map. Mid-range brawlers and snipers both viable. Moderate cover." },
  },
  {
    id: "new_horizons",
    name: "New Horizons",
    mode: "Knockout",
    image: "/assets/maps/new_horizons.png",
    traits: { walls: "moderate", lanes: 3, bushes: "moderate", openness: "mixed", notes: "Balanced layout; versatile picks do well. Center is semi-open." },
  },
];
