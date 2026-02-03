import { createBrowserRouter, type RouteObject } from 'react-router';
import { Layout } from 'src/layout';
import { TokenPage } from 'src/routes/system/token';
import { FinancialPage } from 'src/routes/financial';
import { SystemConfig } from 'src/routes/system/config';
import { FinancialDetailPage } from 'src/routes/financial/tabs/financial-detail/financial-detail';

export const routes = [
  {
    name: '源数据管理',
    path: '',
    children: [
      {
        path: 'financial',
        name: '基金管理',
        Component: FinancialPage,
        children: [{ path: 'detail', name: '基金详情', Component: FinancialDetailPage }],
      },
    ],
  },
  {
    name: '系统管理',
    path: 'system',
    children: [
      {
        path: 'config',
        name: '系统设置',
        Component: SystemConfig,
      },
      { path: 'token', name: '密钥设置', Component: TokenPage },
    ],
  },
].map((item) => {
  (item as any).firstChildPath = item.children?.[0].path;
  return item;
});

export const browserRouter = createBrowserRouter(
  (routes as RouteObject[]).map((item) => {
    item.Component = Layout;
    return item;
  })
);
