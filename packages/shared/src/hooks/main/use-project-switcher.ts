import type { Project } from '@sprintstack/api-client';
import { useProjects } from '@sprintstack/api-client';
import { useMemo, useState } from 'react';

const METHODOLOGY_LABEL: Record<Project['methodology'], string> = {
  scrum: 'Scrum',
  kanban: 'Kanban',
};

/**
 * The sidebar's project switcher (SidebarProject), from the viewer's projects. Starts on the first
 * one; undefined while they load or when the viewer has none. Returns the sidebar's shape without
 * depending on @sprintstack/ui.
 *
 *   <Sidebar.Root project={useProjectSwitcher().switcher} />
 */
export const useProjectSwitcher = () => {
  const { data: projects } = useProjects();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const current = projects?.find((p) => p.id === selectedId) ?? projects?.[0];

  const switcher = useMemo(
    () =>
      current && {
        code: current.key,
        name: current.name,
        meta: `${METHODOLOGY_LABEL[current.methodology as keyof typeof METHODOLOGY_LABEL]} · ${current.memberCount} {
          current.memberCount === 1 ? 'member' : 'members'
        }`,
        options: projects?.map((p) => ({
          value: p.id,
          label: p.name,
          avatar: p.key,
          description: METHODOLOGY_LABEL[p.methodology],
        })),
        value: current.id,
        onValueChange: (value: string | null) => value && setSelectedId(value),
      },
    [current, projects],
  );

  return { project: current, switcher };
};
