import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components';
import { Link, useLocation, useNavigate } from 'react-router';
import { getRoutes } from 'src/router.config';
import { ContainerActions } from './actions';
import s from './index.module.less';
import { useMemo } from 'react';

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const routes = useMemo(() => getRoutes(), []);

  return (
    <div style={{ height: '100vh' }}>
      <ProLayout
        fixSiderbar
        splitMenus
        layout="top"
        onMenuHeaderClick={() => {
          navigate('/');
        }}
        route={{ path: '/', routes }}
        location={location}
        menu={{ type: 'group' }}
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          size: 'small',
          title: '七妮妮',
        }}
        actionsRender={(props) => <ContainerActions {...props} />}
        menuItemRender={(item, dom) => <Link to={item.path || '/'}>{dom}</Link>}
      >
        <PageContainer className={s['page-container']}>
          <ProCard
            bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1 }}
            className={s['page-container-card']}
          >
            {children}
          </ProCard>
        </PageContainer>
      </ProLayout>
    </div>
  );
};
