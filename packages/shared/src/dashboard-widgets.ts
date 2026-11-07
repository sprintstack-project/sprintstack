// The dashboard's widgets, shared so the web (which reorders them) and mobile (which follows the
// saved order) agree on the keys stored in the user's preferences.

export const WIDGET_KEYS = ['next-items', 'activity', 'burndown', 'status'] as const;

export type WidgetKey = (typeof WIDGET_KEYS)[number];

/** The order before the person has saved one. */
export const DEFAULT_WIDGETS: WidgetKey[] = [...WIDGET_KEYS];

const isWidgetKey = (key: string): key is WidgetKey =>
  (WIDGET_KEYS as readonly string[]).includes(key);

/**
 * The saved order, minus any keys this version doesn't know. A missing key is a removed widget, so
 * only an unsaved order (null or undefined) falls back to the default.
 */
export const widgetOrder = (saved: readonly string[] | null | undefined): WidgetKey[] =>
  saved ? saved.filter(isWidgetKey) : DEFAULT_WIDGETS;
