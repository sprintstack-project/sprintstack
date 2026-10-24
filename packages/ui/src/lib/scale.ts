/**
 * The size of the whole system on native, matching --ui-scale on web (keep the two in step).
 * Classes scale through Uniwind's rem base (apps/mobile/metro.config.js); numeric props such as
 * Lucide's `size` go through `scaled()`.
 */
export const UI_SCALE = 0.75;

/** A spec size in px (from the design), at the current scale. */
export const scaled = (specPx: number) => Math.round(specPx * UI_SCALE * 2) / 2;

/** Touch targets stay at least 44pt however small the control draws: hitSlop for a control of `specPx`. */
export const touchSlop = (specPx: number) => Math.max(0, Math.ceil((44 - scaled(specPx)) / 2));
