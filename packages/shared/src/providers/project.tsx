'use client';

import type { Project } from '@sprintstack/api-client/documents/projects';
import { useProjects } from '@sprintstack/api-client/projects';
import React, { useState } from 'react';
import { pickProject } from '../pick-project';

type IProjectContext = {
  /** The viewer's projects; undefined while they load. */
  projects: Project[] | undefined;
  /** The selected project; undefined while loading or when the viewer has none. */
  project: Project | undefined;
  /** Shorthand for project?.id, for query variables. */
  projectId: string | undefined;
  /** Picks a project; does nothing when it's already the selected one. */
  setProjectId: (id: string) => void;
};

interface ProjectProviderProps {
  /**
   * Where the app keeps the pick (the web: a cookie its server also reads). Without it the
   * provider keeps the pick in memory, starting on the first project.
   */
  selection?: {
    selectedId: string | null | undefined;
    onSelect: (id: string) => void;
  };
  children: React.ReactNode;
}

const ProjectContext = React.createContext<IProjectContext | undefined>(undefined);

/** The selected project, shared by the project switcher and the screens' queries. */
const ProjectProvider = ({ selection, children }: ProjectProviderProps) => {
  const { data: projects } = useProjects();
  const [localId, setLocalId] = useState<string | null>(null);
  const selectedId = selection ? selection.selectedId : localId;
  const onSelect = selection ? selection.onSelect : setLocalId;
  const project = projects ? pickProject(projects, selectedId) : undefined;

  const setProjectId = (id: string) => {
    if (id !== project?.id) onSelect(id);
  };

  const value: IProjectContext = { projects, project, projectId: project?.id, setProjectId };
  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjectContext = () => {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectProvider;
