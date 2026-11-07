// Shared by the server (server/queries/projects.ts) and the browser (providers/(main)/project), so
// both resolve the same project (with pickProject from @sprintstack/shared) from the same cookie.

/** Holds the selected project's id. Not httpOnly: the browser writes it when the person switches. */
export const PROJECT_COOKIE = 'sprintstack.project';

/** A year; refreshed on every switch. */
export const PROJECT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
