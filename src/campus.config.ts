/**
 * Single source of truth for campus-specific config.
 *
 * A fork changes this file (and the data — see /wiki/fork-for-your-campus).
 * Run `bun run fork:check` after editing to catch stray Example University strings elsewhere.
 *
 * Values are plain literals so astro.config.mjs can import this module at
 * config-eval time (no process.env reads at module top level).
 */

export const campusSite = {
  url: "https://room-tba.campus.tools",
  name: "Room TBA",
  title: "Room TBA | Find Rooms, Buildings, Colleges, and Divisions on Your Campus",
  description:
    "Room TBA helps students find rooms, buildings, colleges, and divisions across their campus.",
} as const;

export const campusMap: {
  maxBounds: [[number, number], [number, number]];
  defaultCamera: {
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  };
} = {
  /** [lng, lat] — west/south corner, then east/north corner. */
  maxBounds: [
    // West/south corner, then east/north corner — replace with your campus bounds.
    // Defaults below match the bundled sample campus (Golden Gate Park).
    [-122.51, 37.75],
    [-122.41, 37.79],
  ],
  /** Default camera: center [lng, lat], zoom, pitch (0 = top-down, 60 = tilted 3D), bearing. */
  defaultCamera: {
    center: [-122.4602, 37.7714],
    zoom: 15,
    pitch: 60,
    bearing: -30,
  },
};

export const campusTerrain: {
  enabled: boolean;
  demTilesUrl: string;
  maxBounds: [[number, number], [number, number]];
  camera: {
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  };
} = {
  /** 3D terrain (raster-dem + hillshade). false = flat map, no terrain controls. */
  enabled: true,
  /** TileJSON for the elevation source; __MAPTILER_KEY__ is replaced with PUBLIC_MAPTILER_KEY at runtime. */
  demTilesUrl:
    "https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=__MAPTILER_KEY__",
  /** [lng, lat] corners the terrain view may cover (Mount Summit and surroundings). */
  maxBounds: [
    [-122.51, 37.75],
    [-122.41, 37.79],
  ],
  /** Camera the map flies to when terrain mode turns on. */
  camera: { center: [-122.4602, 37.7714], zoom: 13, pitch: 68, bearing: 190 },
};

export const campusTransit: {
  enabled: boolean;
  label: string;
  routeDataModule: string;
} = {
  /** Campus transit overlay: map layer, sidebar browse tab, /transit/ links, sitemap entries.
   *  Disabled by default: enable after seeding your campus's transit data. */
  enabled: false,
  /** Menu / browse-tab label; title case and singular copy are derived from it. */
  label: "Transit routes",
  /** Bundled route/stop data a fork replaces (runtime rows come from the transit tables). */
  routeDataModule: "src/constants/jeepney-routes.ts",
};

/** Reference points inside campus bounds for the E2E suite (seeded by scripts/e2e-reset-db.ts). */
export const campusTestFixtures = {
  buildingLat: 37.7715,
  buildingLon: -122.4605,
  dormLat: 37.772,
  dormLon: -122.461,
} as const;

export const campusCommunity = {
  orgUrl: "https://campus.tools",
  githubUrl: "https://github.com/campus-tools/room-tba",
  discordUrl: "https://discord.gg/YOUR_INVITE",
  facebookUrl: "https://facebook.com/campus.tools",
  instagramUrl: "https://instagram.com/campus.tools",
  osaOrganizationsUrl: "https://orgs.campus.tools/orgs",
  /** Messenger group chat invites (targets for redirect workers). */
  messengerContributeTarget: "https://m.me/j/YOUR_GROUP/",
  messengerMaintainTarget: "https://m.me/j/YOUR_GROUP/",
} as const;
