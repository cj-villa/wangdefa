import React from 'react';
import { createRoot } from 'react-dom/client';
import { browserRouter } from 'src/routes';
import { RouterProvider } from 'react-router-dom';
import { ProConfigProvider } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';

import './index.less';

const App = () => {
  return (
    <ProConfigProvider hashed={false}>
      <ConfigProvider>
        <RouterProvider router={browserRouter} />
      </ConfigProvider>
    </ProConfigProvider>
  );
};

console.log('alive');

createRoot(document.body).render(<App />);
