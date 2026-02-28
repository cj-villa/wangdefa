import { ProConfigProvider } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { PortalProvider } from 'src/components';
import { browserRouter } from 'src/routes';

import './index.less';

const App = () => {
  return (
    <PortalProvider>
      <ProConfigProvider hashed={false}>
        <ConfigProvider>
          <RouterProvider router={browserRouter} />
        </ConfigProvider>
      </ProConfigProvider>
    </PortalProvider>
  );
};

createRoot(document.body).render(<App />);
