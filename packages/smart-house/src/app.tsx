import React from 'react';
import { BrowserRouter, Routes } from 'react-router';
import { Container } from 'src/components';
import { GlobalConfigProvider } from 'src/hooks';
import './index.less';
import { getRoutes, useRoutes } from './router.config';

export const App: React.FC = () => {
  const element = useRoutes(getRoutes());

  return (
    <BrowserRouter>
      <GlobalConfigProvider>
        <Container>
          <Routes>{element}</Routes>
        </Container>
      </GlobalConfigProvider>
    </BrowserRouter>
  );
};
