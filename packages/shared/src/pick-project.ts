/**
 * The selected project, or the first one when nothing is picked or the pick is stale (a project the
 * viewer left, or one from another organization). Undefined only when the viewer has no projects.
 * Hook-free, so the web's server components resolve the same project as the provider.
 */
export const pickProject = <P extends { id: string }>(
  projects: readonly P[],
  selectedId: string | null | undefined,
): P | undefined => projects.find((project) => project.id === selectedId) ?? projects[0];
