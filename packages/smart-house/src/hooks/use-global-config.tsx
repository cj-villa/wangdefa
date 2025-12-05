import React, { createContext, useContext } from 'react';

export interface GlobalConfig {}

const GlobalConfigContext = createContext<GlobalConfig>({});

export const GlobalConfigProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <GlobalConfigContext.Provider value={{}}>{children}</GlobalConfigContext.Provider>;
};

export const useGlobalConfig = () => {
  const globalConfig = useContext(GlobalConfigContext);
  if (!globalConfig) {
    throw new Error('GlobalConfigContext is not initialized');
  }
  return globalConfig;
};
