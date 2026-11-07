'use client';

import { useGetUserPreferences, useUpdateUserPreferences } from '@sprintstack/api-client/users';
import { type WidgetKey, widgetOrder } from '@sprintstack/shared/dashboard-widgets';
import { useProjectContext } from '@sprintstack/shared/providers/project';
import React, { useEffect, useState } from 'react';

type IDashboardContext = {
  widgets: WidgetKey[];
  rearrangeWidgets: (newWidgets: WidgetKey[]) => void;
};

const DashboardContext = React.createContext<IDashboardContext | undefined>(undefined);

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const { projectId } = useProjectContext();
  const { data: userPreferences } = useGetUserPreferences(projectId);
  const [, updateUserPreferences] = useUpdateUserPreferences();

  const [widgets, setWidgets] = useState<WidgetKey[]>(widgetOrder(userPreferences?.widgets));

  useEffect(() => {
    setWidgets(widgetOrder(userPreferences?.widgets));
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
