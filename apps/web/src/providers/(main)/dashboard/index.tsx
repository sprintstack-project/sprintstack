'use client';

import React from 'react';

type IDashboardContext = {};

const DashboardContext = React.createContext<IDashboardContext | undefined>(undefined);

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const value = {}; // Add your context value here
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
