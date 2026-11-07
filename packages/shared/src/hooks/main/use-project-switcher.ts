import type { Project } from '@sprintstack/api-client/documents/projects';
import { useProjects } from '@sprintstack/api-client/projects';
import { useMemo, useState } from 'react';

const METHODOLOGY_LABEL: Record<Project['methodology'], string> = {
  scrum: 'Scrum',
  kanban: 'Kanban',
};

type Selection = {
  selectedId: string | null | undefined;
  onSelect: (id: string) => void;
};

/**
 * The sidebar's project switcher (SidebarProject), from the viewer's projects. Pass `selection` to
 * control which project is picked (the web keeps it in a cookie); without it the switcher keeps
 * its own state. Falls back to the first project; undefined while they load or when the viewer has
 * none. Returns the sidebar's shape without depending on @sprintstack/ui.
 *
 *   <Sidebar.Root project={useProjectSwitcher().switcher} />
 */
export const useProjectSwitcher = (selection?: Selection) => {
  const { data: projects } = useProjects();
  const [localId, setLocalId] = useState<string | null>(null);
  const selectedId = selection ? selection.selectedId : localId;
  const onSelect = selection ? selection.onSelect : setLocalId;
  const current = projects?.find((p) => p.id === selectedId) ?? projects?.[0];

  const switcher = useMemo(
    () =>
      current && {
        code: current.key,
        name: current.name,
        meta: `${METHODOLOGY_LABEL[current.methodology]} · ${current.memberCount} ${
          current.memberCount === 1 ? 'member' : 'members'
        }`,
        options: projects?.map((p) => ({
          value: p.id,
          label: p.name,
          avatar: p.key,
          description: METHODOLOGY_LABEL[p.methodology],
        })),
        value: current.id,
        onValueChange: (value: string | null) => value && onSelect(value),
      },
    [current, projects, onSelect],
  );

  return { project: current, switcher };
};
