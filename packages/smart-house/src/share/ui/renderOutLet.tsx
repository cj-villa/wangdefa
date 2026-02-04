import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export const renderOutLetFactory = (pathname: string, Component: React.ComponentType): React.FC => {
  return () => {
    const location = useLocation();
    if (location.pathname === pathname) {
      return <Component />;
    }
    return <Outlet />;
  };
};
