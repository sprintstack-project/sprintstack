// Shared by the server (server/queries/projects.ts) and the browser (providers/(main)/project), so
// both resolve the same project from the same cookie.

/** Holds the selected project's id. Not httpOnly: the browser writes it when the person switches. */
export const PROJECT_COOKIE = 'sprintstack.project';

/** A year; refreshed on every switch. */
export const PROJECT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * The selected project, or the first one when the cookie is missing or stale (a project the viewer
 * left, or one from another organization). Undefined only when the viewer has no projects.
 */
export const pickProject = <P extends { id: string }>(
  projects: readonly P[],
  selectedId: string | null | undefined,
): P | undefined => projects.find((project) => project.id === selectedId) ?? projects[0];
