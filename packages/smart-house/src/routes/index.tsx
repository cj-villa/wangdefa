import { createBrowserRouter, type RouteObject } from 'react-router';
import { Layout } from 'src/layout';
import { Dashboard } from 'src/routes/dashboard';
import { TokenPage } from 'src/routes/token';

export const routes = [
  { name: '主页', path: '', children: [{ path: '/', name: '概览', Component: Dashboard }] },
  {
    name: '设置',
    path: 'config',
    children: [
      { path: 'token', name: '密钥设置', Component: TokenPage },
      {
        path: 'token2',
        name: '密钥设置2',
        Component: TokenPage,
      },
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
