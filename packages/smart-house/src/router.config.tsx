import { SmileFilled } from '@ant-design/icons';
import { type Route } from '@ant-design/pro-layout/lib/typing';
import { Route as ReactRoute } from 'react-router';
import React from 'react';

export const getRoutes = (): Route[] => {
  return [
    {
      index: true,
      path: '/',
      name: '地图定位',
      icon: <SmileFilled />,
      component: 'src/router/map-pin',
    },
  ];
};

export const useRoutes = (routes: Route[]): React.ReactElement[] => {
  return routes.reduce<React.ReactElement[]>((acc, route) => {
    const { index, path = '/', component, children } = route;
    if (children) {
      acc.push(
        <ReactRoute path={path} element={component}>
          {useRoutes(children)}
        </ReactRoute>
      );
      return acc;
    }
    if (index) {
      acc.push(<ReactRoute index element={component} />);
    }
    acc.push(<ReactRoute path={path} element={component} />);
    return acc;
  }, []);
};
