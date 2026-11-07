'use client';

import { useGetUserPreferences, useUpdateUserPreferences } from '@sprintstack/api-client/users';
import React, { useEffect, useState } from 'react';
import { useProjectContext } from '../project';

export type WidgetKey = 'next-items' | 'activity' | 'burndown' | 'status';

type IDashboardContext = {
  widgets: WidgetKey[];
  rearrangeWidgets: (newWidgets: WidgetKey[]) => void;
};

const DashboardContext = React.createContext<IDashboardContext | undefined>(undefined);

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const { projectId } = useProjectContext();
  const { data: userPreferences } = useGetUserPreferences(projectId);
  const [, updateUserPreferences] = useUpdateUserPreferences();

  const [widgets, setWidgets] = useState<WidgetKey[]>(
    (userPreferences?.widgets as WidgetKey[]) ?? ['next-items', 'activity', 'burndown', 'status'],
  );

  useEffect(() => {
    setWidgets(
      (userPreferences?.widgets as WidgetKey[]) ?? ['next-items', 'activity', 'burndown', 'status'],
    );
  }, [userPreferences?.widgets]);

  const rearrangeWidgets = (newWidgets: WidgetKey[]) => {
    setWidgets(newWidgets);
    projectId && updateUserPreferences({ projectId, widgets: newWidgets });
  };

  const value: IDashboardContext = {
    widgets,
    rearrangeWidgets,
  };
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = () => {
  const context = React.useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardProvider;
