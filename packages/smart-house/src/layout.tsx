import { PageContainer, PageHeader, ProBreadcrumb, ProLayout } from '@ant-design/pro-components';
import { ReactComponent as Logo } from 'src/assets/logo.svg';
import { routes } from 'src/routes';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import * as React from 'react';
import { Breadcrumb } from 'antd';
import { useEffect } from 'react';
import type { RouteContextType } from '@ant-design/pro-layout/lib/context/RouteContext';
import { CustomPageHeader, PortalTarget } from 'src/components';

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
        pageHeaderRender={(props) => {
          const deep = (props as RouteContextType).currentMenu?.pro_layout_parentKeys?.length ?? 0;
          return (
            <PortalTarget id="__page-header__">
              <PageHeader
                className="ant-pro-page-container-warp-page-header"
                breadcrumb={<ProBreadcrumb />}
                title={props.title}
                onBack={deep > 1 ? () => navigate(-1) : undefined}
              />
            </PortalTarget>
          );
        }}
      >
        <Outlet />
      </PageContainer>
    </ProLayout>
  );
};
