'use client';

import { useGetCurrentSprint } from '@sprintstack/api-client/sprints';
import type { Option } from '@ui/types';
import { useMemo } from 'react';
import { useProjectContext } from '@/providers/(main)/project';
import { NONE } from './data';

/** The sprints a new item can go in: the project's active sprint (if any), then the backlog. */
export const useSprintOptions = () => {
  const { projectId } = useProjectContext();
  const { data: currentSprint } = useGetCurrentSprint(projectId);

  const options = useMemo<Option[]>(
    () => [
      ...(currentSprint
        ? [{ value: currentSprint.id, label: currentSprint.name, description: 'Active' }]
        : []),
      { value: NONE, label: 'Backlog', description: 'No sprint' },
    ],
    [currentSprint],
  );

  return { options, currentSprintId: currentSprint?.id ?? null };
};
