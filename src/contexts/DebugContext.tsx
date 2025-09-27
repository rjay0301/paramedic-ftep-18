import React from 'react';

// This is just a stub since we removed the debug functionality
// We're keeping this file to avoid breaking imports elsewhere
export const useDebug = () => {
  return {
    isDebugMode: false,
    toggleDebugMode: () => {},
    unlockAllPhases: () => {},
    shouldUnlockPhases: false,
    navigateToCoordinatorPortal: () => {}
  };
};

export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
