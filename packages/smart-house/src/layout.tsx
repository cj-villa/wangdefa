import { PageContainer, ProLayout } from '@ant-design/pro-components';
import { ReactComponent as Logo } from 'src/assets/logo.svg';
import { routes } from 'src/routes';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import * as React from 'react';
import { Breadcrumb, type BreadcrumbProps } from 'antd';
import { useEffect } from 'react';

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/financial');
    }
  }, []);

  return (
    <ProLayout
      prefixCls="wdf"
      title="wangdefa"
      logo={<Logo width={22} height={22} />}
      layout="mix"
      splitMenus
      location={location}
      route={{ children: routes }}
      menuItemRender={(item, dom, menuProps) => {
        return (
          <div
            onClick={() => {
              const path =
                menuProps.menuRenderType === 'header'
                  ? [item.path, item.firstChildPath].join('/')
                  : item.path;
              navigate(path || '/');
            }}
          >
            {dom}
          </div>
        );
      }}
    >
      <PageContainer
        breadcrumbRender={(props) => (
          <Breadcrumb items={(props.breadcrumb as BreadcrumbProps)?.items} />
        )}
      >
        <Outlet />
      </PageContainer>
    </ProLayout>
  );
};
