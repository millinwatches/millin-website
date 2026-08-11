// ─── MILLIN Visual Library ─────────────────────────────────────────────────────
//
// Single source of truth for every visual asset used across the MILLIN Digital Maison.
//
// RULE: Components never reference image URLs directly.
//       They call asset(SLOT_NAME, w, h) — this file resolves the URL.
//
// TO REPLACE A PLACEHOLDER with a production MILLIN asset:
//   1. Add the file to src/imports/ (or your CDN)
//   2. Import it below under "MILLIN ORIGINAL ASSETS"
//   3. Update the MILLIN_ARCHIVE entry — status changes to "MILLIN_ORIGINAL"
//   4. Done. Components are untouched.
//
// Naming: MILLIN_[CATEGORY]_[SUBJECT]_[NUMBER]
// Categories: PROLOGUE | HOUSE | ATELIER | CRAFT | HUMAN | CREATION | BESPOKE | SERVICE | JOURNAL
//
// Status: MILLIN_ORIGINAL = produced asset · PLACEHOLDER = Unsplash proxy

// ─── MILLIN ORIGINAL ASSETS ────────────────────────────────────────────────────
// Architecture v1.0 — four spaces of the House, produced for this project.

import _HOUSE_ARC_001    from "../imports/HOUSE-ARC-001.png";
import _SALON_ARC_001    from "../imports/SALON-ARC-001.png";
import _LIBRARY_ARC_001  from "../imports/LIBRARY-ARC-001.png";
import _ATELIER_ARC_001  from "../imports/ATELIER-ARC-001.png"; // superseded — kept for reference
import _ATELIER_ARC_002  from "../imports/ATELIER-ARC-002.png"; // ARC v1.1 — approved, replaces v1.0
import _MASTER_001       from "../imports/MASTER.png";          // CRAFT v1.0 — approved via MASTER-005
import _HUMAN_REF_001   from "../imports/image_1785173326221_mqd4fi.png"; // ARTISAN-001 — CHARACTER LOCK · LOCKED
import _HUMAN_ACT_001   from "../imports/image_1785428218359_2nzr1a.png"; // MASTER-006 — HERO HUMAN · LOCKED
import _ENAMEL_CRA_001  from "../imports/ENAMEL-CRA-001.png";             // CRAFT · Enamel firing · MILLIN ORIGINAL
import _ENGRAVING_001   from "../imports/ENGRAVING-CRA-001.png";          // CRAFT · Hand engraving · MILLIN ORIGINAL
import _BESPOKE_M001    from "../imports/image_1785511697495_4bbb6k.png"; // MASTER-010 · HERO COLLECTOR · LOCKED
import _BESPOKE_COL_001 from "../imports/BESPOKE-COL-001.png";           // BESPOKE-COL-001 · Production asset · Collector Conversation
import _BESPOKE_CRA_001 from "../imports/BESPOKE-CRA-001.png";           // MASTER-011 · The Bespoke Sketch · LOCKED
import _CREATION_YT_001 from "../imports/CREATION-YT-001.png";           // CREATION · Yellow Tiger · MILLIN ORIGINAL
import _GUILLOCHE_001   from "../imports/GUILLOCHE-CRA-001.png";          // CRAFT · Guilloché · MILLIN ORIGINAL

// ─── Asset metadata ────────────────────────────────────────────────────────────
// Used by the Visual World Board. Not used by components.

export type AssetStatus = "MILLIN_ORIGINAL" | "PLACEHOLDER";

export interface AssetMeta {
  status: AssetStatus;
  category: string;
  file?: string;          // filename if local asset
  description?: string;   // one-line visual note
  version?: string;       // production batch
}

export const MILLIN_META: Record<string, AssetMeta> = {

  // ── PROLOGUE ────────────────────────────────────────────────────────────────
  MILLIN_PROLOGUE_HAND_001:      { status: "PLACEHOLDER", category: "PROLOGUE", description: "Craftsman's hand, close register" },
  MILLIN_PROLOGUE_TOOL_001:      { status: "PLACEHOLDER", category: "PROLOGUE", description: "Precision tool set, laid out" },
  MILLIN_PROLOGUE_MECHANISM_001: { status: "PLACEHOLDER", category: "PROLOGUE", description: "Movement, internal structure" },
  MILLIN_PROLOGUE_GESTURE_001:   { status: "PLACEHOLDER", category: "PROLOGUE", description: "Technical sketch, geometric" },
  MILLIN_PROLOGUE_MATERIAL_001:  { status: "PLACEHOLDER", category: "PROLOGUE", description: "Torch flame — working fire" },

  // ── HOUSE ───────────────────────────────────────────────────────────────────
  MILLIN_HOUSE_ENTRANCE_001:     { status: "MILLIN_ORIGINAL", category: "HOUSE", file: "HOUSE-ARC-001.png",   description: "Limestone corridor, arched vault, MILLIN nameplate, dark oak double doors", version: "ARC v1.0" },
  MILLIN_HOUSE_PRIVATE_SALON_001:{ status: "MILLIN_ORIGINAL", category: "HOUSE", file: "SALON-ARC-001.png",   description: "Private salon — round walnut table, leather chairs, sketches, empty canvas", version: "ARC v1.0" },
  MILLIN_HOUSE_LIBRARY_001:      { status: "MILLIN_ORIGINAL", category: "HOUSE", file: "LIBRARY-ARC-001.png", description: "Library — mahogany shelves, green banker's lamp, open book, garden window", version: "ARC v1.0" },
  MILLIN_HOUSE_HERO_001:         { status: "MILLIN_ORIGINAL", category: "HOUSE", file: "SALON-ARC-001.png",   description: "Hero image — salon (same as PRIVATE_SALON_001)", version: "ARC v1.0" },

  // ── ATELIER ─────────────────────────────────────────────────────────────────
  MILLIN_ATELIER_WORKBENCH_001:  { status: "MILLIN_ORIGINAL", category: "ATELIER", file: "ATELIER-ARC-002.png", description: "Atelier workbench — walnut paneling, window-led light, precision tools, formal garden", version: "ARC v1.1 · APPROVED" },
  MILLIN_ATELIER_SKETCH_001:     { status: "PLACEHOLDER", category: "ATELIER", description: "Technical drawing, sketchbook" },
  MILLIN_ATELIER_TOOLS_001:      { status: "PLACEHOLDER", category: "ATELIER", description: "Carving and precision tools" },
  MILLIN_ATELIER_MECHANISM_001:  { status: "PLACEHOLDER", category: "ATELIER", description: "Watch movement, internal" },

  // ── CRAFT ───────────────────────────────────────────────────────────────────
  MILLIN_CRAFT_MASTER_001:               { status: "MILLIN_ORIGINAL", category: "CRAFT", file: "MASTER.png", description: "Craft workbench — walnut panels, French window, precision tools, watch sketch", version: "CRAFT v1.0 · APPROVED" },
  MILLIN_CRAFT_ENAMEL_FIRE_001:          { status: "MILLIN_ORIGINAL", category: "CRAFT", file: "ENAMEL-CRA-001.png", description: "Enamel firing — hand with spatula applying pigment to miniature dial, kiln glowing orange behind", version: "CRA v1.0 · APPROVED" },
  MILLIN_CRAFT_ENGRAVING_001:            { status: "MILLIN_ORIGINAL", category: "CRAFT", file: "ENGRAVING-CRA-001.png", description: "Hand engraving — burin on gold watch case, scrollwork, shavings, engraver's bench pin", version: "CRA v1.0 · APPROVED" },
  MILLIN_CRAFT_GUILLOCHE_001:            { status: "MILLIN_ORIGINAL", category: "CRAFT", file: "GUILLOCHE-CRA-001.png", description: "Guilloché — fan wave engine-turned pattern, raking light, gold dial blank, rose engine in bokeh", version: "CRA v1.0 · APPROVED" },
  MILLIN_CRAFT_MINIATURE_PAINTING_001:   { status: "PLACEHOLDER", category: "CRAFT", description: "Fine paintbrushes, silver ferrule" },

  // ── HUMAN ───────────────────────────────────────────────────────────────────
  MILLIN_HUMAN_REFERENCE_001:            { status: "MILLIN_ORIGINAL", category: "HUMAN", file: "image_1785173326221_mqd4fi.png", description: "ARTISAN-001 — Character Lock · 6-view reference sheet · The Master Artisan of House MILLIN", version: "LOCK v1.0 · LOCKED" },
  MILLIN_HUMAN_ATELIER_ACTIVE_001:       { status: "MILLIN_ORIGINAL", category: "HUMAN", file: "image_1785428218359_2nzr1a.png", description: "ARTISAN-001 at the workbench — engraving, absorbed, full scene with tools and window", version: "MASTER-006 · LOCKED" },
  MILLIN_HUMAN_MASTER_HAND_001:          { status: "PLACEHOLDER", category: "HUMAN", description: "The master's hand — through-line" },
  MILLIN_HUMAN_SKETCH_001:               { status: "PLACEHOLDER", category: "HUMAN", description: "I — Hand opens sketchbook" },
  MILLIN_HUMAN_MATERIAL_001:             { status: "PLACEHOLDER", category: "HUMAN", description: "II — Hand touches material" },
  MILLIN_HUMAN_BURIN_001:                { status: "PLACEHOLDER", category: "HUMAN", description: "III — Burin meets metal" },
  MILLIN_HUMAN_ENAMEL_BRUSH_001:         { status: "PLACEHOLDER", category: "HUMAN", description: "IV — Brush meets enamel" },
  MILLIN_HUMAN_ARTISAN_OBSERVES_001:     { status: "PLACEHOLDER", category: "HUMAN", description: "V — The artisan observes" },
  MILLIN_HUMAN_COLLECTOR_MOMENT_001:     { status: "PLACEHOLDER", category: "HUMAN", description: "VI — The collector understands" },

  // ── CREATION ────────────────────────────────────────────────────────────────
  MILLIN_CREATION_YELLOW_TIGER_001:      { status: "MILLIN_ORIGINAL", category: "CREATION", file: "CREATION-YT-001.png", description: "Yellow Tiger — rose gold case, hand-engraved bezel, miniature painting dial, limestone House backdrop", version: "CREATION v1.0 · APPROVED" },
  MILLIN_CREATION_GRACEFUL_CRANE_001:    { status: "PLACEHOLDER", category: "CREATION", description: "Museum — Fuji with cranes" },
  MILLIN_CREATION_GOLDEN_PEACOCK_001:    { status: "PLACEHOLDER", category: "CREATION", description: "Close-up peacock" },
  MILLIN_CREATION_STARRY_NIGHT_001:      { status: "PLACEHOLDER", category: "CREATION", description: "Van Gogh Starry Night — macro" },
  MILLIN_CREATION_ROYAL_WAVE_001:        { status: "PLACEHOLDER", category: "CREATION", description: "Hokusai Great Wave — Art Institute of Chicago" },

  // ── BESPOKE ─────────────────────────────────────────────────────────────────
  MILLIN_BESPOKE_MASTER_001:             { status: "MILLIN_ORIGINAL", category: "BESPOKE", file: "image_1785511697495_4bbb6k.png", description: "MASTER-010 — The Collector Conversation · Private Salon · ARTISAN-001 listening, collector with sketches, no product", version: "HERO COLLECTOR v1.0 · LOCKED" },
  MILLIN_BESPOKE_COLLECTOR_001:          { status: "MILLIN_ORIGINAL", category: "BESPOKE", file: "BESPOKE-COL-001.png", description: "Collector Conversation — production file. Private Salon, ARTISAN-001 listening, collector with sketches. Same scene as MASTER-010.", version: "BESPOKE v1.0 · APPROVED" },
  MILLIN_BESPOKE_SALON_001:              { status: "MILLIN_ORIGINAL", category: "BESPOKE", file: "SALON-ARC-001.png", description: "01 CONVERSATION — private salon", version: "ARC v1.0" },
  MILLIN_BESPOKE_MASTER_002:             { status: "MILLIN_ORIGINAL", category: "BESPOKE", file: "BESPOKE-CRA-001.png", description: "MASTER-011 — The Bespoke Sketch · ARTISAN-001 drawing watch studies, handmade paper, construction lines, leather and metal samples", version: "BESPOKE v1.1 · LOCKED" },
  MILLIN_BESPOKE_SKETCH_001:             { status: "MILLIN_ORIGINAL", category: "BESPOKE", file: "BESPOKE-CRA-001.png", description: "02 SKETCH — idea takes form · same as MASTER-011 production file", version: "BESPOKE v1.1 · APPROVED" },
  MILLIN_BESPOKE_MATERIAL_001:           { status: "PLACEHOLDER", category: "BESPOKE", description: "03 MATERIAL — selection" },
  MILLIN_BESPOKE_CRAFT_001:              { status: "PLACEHOLDER", category: "BESPOKE", description: "04 CRAFT — hand at work" },
  MILLIN_BESPOKE_CREATION_001:           { status: "PLACEHOLDER", category: "BESPOKE", description: "05 CREATION — the work complete" },
  MILLIN_BESPOKE_PRESENTATION_001:       { status: "MILLIN_ORIGINAL", category: "BESPOKE", file: "LIBRARY-ARC-001.png", description: "Library — bespoke copy backdrop", version: "ARC v1.0" },

  // ── SERVICE ─────────────────────────────────────────────────────────────────
  MILLIN_SERVICE_CREATION_001:           { status: "PLACEHOLDER", category: "SERVICE", description: "Creation stage" },
  MILLIN_SERVICE_CARE_001:               { status: "PLACEHOLDER", category: "SERVICE", description: "Care stage" },
  MILLIN_SERVICE_PRESERVATION_001:       { status: "PLACEHOLDER", category: "SERVICE", description: "Preservation stage" },

  // ── JOURNAL ─────────────────────────────────────────────────────────────────
  MILLIN_JOURNAL_ENAMEL_FIRE_001:        { status: "PLACEHOLDER", category: "JOURNAL", description: "Feature: On the Art of Impossibility" },
  MILLIN_JOURNAL_ENGRAVER_001:           { status: "PLACEHOLDER", category: "JOURNAL", description: "Supporting: A Year in the Life of an Engraver" },
  MILLIN_JOURNAL_ATELIER_001:            { status: "PLACEHOLDER", category: "JOURNAL", description: "Supporting: When the Machine Meets the Hand" },
};

// ─── Main archive ─────────────────────────────────────────────────────────────
// Maps slot name → image source (local module path OR Unsplash base URL).
// asset() resolves the final URL with sizing params.

const MILLIN_ARCHIVE: Record<string, string> = {

  // ── PROLOGUE ─────────────────────────────────────────────────────────────────
  MILLIN_PROLOGUE_HAND_001:               "https://images.unsplash.com/photo-1685022515790-28eddf510f24",
  MILLIN_PROLOGUE_TOOL_001:               "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8",
  MILLIN_PROLOGUE_MECHANISM_001:          "https://images.unsplash.com/photo-1583198432859-635beb4e8600",
  MILLIN_PROLOGUE_GESTURE_001:            "https://images.unsplash.com/photo-1611619899256-5e61d4c46df9",
  MILLIN_PROLOGUE_MATERIAL_001:           "https://images.unsplash.com/photo-1777107508993-7c254c95668c",

  // ── HOUSE — MILLIN ORIGINAL (ARC v1.0) ───────────────────────────────────────
  MILLIN_HOUSE_ENTRANCE_001:              _HOUSE_ARC_001,
  MILLIN_HOUSE_PRIVATE_SALON_001:         _SALON_ARC_001,
  MILLIN_HOUSE_LIBRARY_001:              _LIBRARY_ARC_001,
  MILLIN_HOUSE_HERO_001:                  _SALON_ARC_001,

  // ── ATELIER — MILLIN ORIGINAL (ARC v1.0) ─────────────────────────────────────
  MILLIN_ATELIER_WORKBENCH_001:           _ATELIER_ARC_002,  // ARC v1.1 — approved
  MILLIN_ATELIER_SKETCH_001:              "https://images.unsplash.com/photo-1611619899256-5e61d4c46df9",
  MILLIN_ATELIER_TOOLS_001:               "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8",
  MILLIN_ATELIER_MECHANISM_001:           "https://images.unsplash.com/photo-1583198432859-635beb4e8600",

  // ── CRAFT ─────────────────────────────────────────────────────────────────────
  MILLIN_CRAFT_MASTER_001:               _MASTER_001,
  MILLIN_CRAFT_ENAMEL_FIRE_001:          _ENAMEL_CRA_001,
  MILLIN_CRAFT_ENGRAVING_001:            _ENGRAVING_001,
  MILLIN_CRAFT_GUILLOCHE_001:            _GUILLOCHE_001,
  MILLIN_CRAFT_MINIATURE_PAINTING_001:    "https://images.unsplash.com/photo-1775369335811-28e5c6c6abf3",

  // ── HUMAN ─────────────────────────────────────────────────────────────────────
  MILLIN_HUMAN_REFERENCE_001:            _HUMAN_REF_001,
  MILLIN_HUMAN_ATELIER_ACTIVE_001:       _HUMAN_ACT_001,
  MILLIN_HUMAN_MASTER_HAND_001:           "https://images.unsplash.com/photo-1685022515790-28eddf510f24",
  MILLIN_HUMAN_SKETCH_001:                "https://images.unsplash.com/photo-1611619899256-5e61d4c46df9",
  MILLIN_HUMAN_MATERIAL_001:              "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8",
  MILLIN_HUMAN_BURIN_001:                 "https://images.unsplash.com/photo-1685022515790-28eddf510f24",
  MILLIN_HUMAN_ENAMEL_BRUSH_001:          "https://images.unsplash.com/photo-1777107508993-7c254c95668c",
  MILLIN_HUMAN_ARTISAN_OBSERVES_001:      "https://images.unsplash.com/photo-1725960103635-0a6709f97126",
  MILLIN_HUMAN_COLLECTOR_MOMENT_001:      _SALON_ARC_001,

  // ── CREATION ──────────────────────────────────────────────────────────────────
  MILLIN_CREATION_YELLOW_TIGER_001:      _CREATION_YT_001,
  MILLIN_CREATION_GRACEFUL_CRANE_001:     "https://images.unsplash.com/photo-1784015697868-18cdca13f1e6",
  MILLIN_CREATION_GOLDEN_PEACOCK_001:     "https://images.unsplash.com/photo-1662309905732-0440f31950d4",
  MILLIN_CREATION_STARRY_NIGHT_001:       "https://images.unsplash.com/photo-1775335463671-92bd37ca0ffc",
  MILLIN_CREATION_ROYAL_WAVE_001:         "https://images.unsplash.com/photo-1687382130081-ebd36ecd38a9",

  // ── BESPOKE ───────────────────────────────────────────────────────────────────
  MILLIN_BESPOKE_MASTER_001:             _BESPOKE_M001,
  MILLIN_BESPOKE_COLLECTOR_001:          _BESPOKE_COL_001,
  MILLIN_BESPOKE_MASTER_002:             _BESPOKE_CRA_001,
  MILLIN_BESPOKE_SALON_001:               _SALON_ARC_001,
  MILLIN_BESPOKE_SKETCH_001:             _BESPOKE_CRA_001,
  MILLIN_BESPOKE_MATERIAL_001:            "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8",
  MILLIN_BESPOKE_CRAFT_001:               "https://images.unsplash.com/photo-1685022515790-28eddf510f24",
  MILLIN_BESPOKE_CREATION_001:            "https://images.unsplash.com/photo-1739387137542-dc60de8a0a47",
  MILLIN_BESPOKE_PRESENTATION_001:        _LIBRARY_ARC_001,

  // ── SERVICE ───────────────────────────────────────────────────────────────────
  MILLIN_SERVICE_CREATION_001:            "https://images.unsplash.com/photo-1583198432859-635beb4e8600",
  MILLIN_SERVICE_CARE_001:                "https://images.unsplash.com/photo-1685022515790-28eddf510f24",
  MILLIN_SERVICE_PRESERVATION_001:        "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8",

  // ── JOURNAL ───────────────────────────────────────────────────────────────────
  MILLIN_JOURNAL_ENAMEL_FIRE_001:         "https://images.unsplash.com/photo-1777107508993-7c254c95668c",
  MILLIN_JOURNAL_ENGRAVER_001:            "https://images.unsplash.com/photo-1685022515790-28eddf510f24",
  MILLIN_JOURNAL_ATELIER_001:             "https://images.unsplash.com/photo-1583198432859-635beb4e8600",
};

// ─── URL builder ──────────────────────────────────────────────────────────────

/**
 * Resolve a MILLIN asset slot to a sized image URL.
 *
 * For Unsplash sources: appends ?w=&h=&fit=crop&auto=format&q=80
 * For local MILLIN ORIGINAL assets: returns the Vite-processed module URL as-is
 *
 * @param slot  Semantic MILLIN asset name — e.g. "MILLIN_HOUSE_ENTRANCE_001"
 * @param w     Output width in pixels (ignored for local assets)
 * @param h     Output height in pixels (ignored for local assets)
 */
export function asset(slot: string, w: number, h: number): string {
  const src = MILLIN_ARCHIVE[slot];
  if (!src) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[MILLIN Visual Library] Unknown slot: "${slot}"`);
    }
    return `https://images.unsplash.com/photo-1685022515813-c42e8348639b?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
  }
  // Unsplash — append sizing parameters
  if (src.startsWith("https://images.unsplash.com")) {
    return `${src}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
  }
  // Local MILLIN ORIGINAL — Vite has already resolved this to a hashed URL
  return src;
}

export const MILLIN_SLOTS = Object.keys(MILLIN_ARCHIVE);
