import type { Project } from '@sprintstack/api-client/documents/projects';
import { useProjects } from '@sprintstack/api-client/projects';
import { pickProject } from '@sprintstack/shared/pick-project';
import React, { useState } from 'react';

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

const ProjectContext = React.createContext<IProjectContext | undefined>(undefined);

/** The selected project, kept in memory: the app starts on the first project each launch. */
const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: projects } = useProjects();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const project = projects ? pickProject(projects, selectedId) : undefined;

  const setProjectId = (id: string) => {
    if (id !== project?.id) setSelectedId(id);
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
