import React, { useMemo } from 'react';
import { PageHeader, ProBreadcrumb } from '@ant-design/pro-components';
import { PageHeaderProps } from '@ant-design/pro-layout/es/components/PageHeader';
import { useNavigate } from 'react-router-dom';

interface CustomPageHeaderProps extends Pick<PageHeaderProps, 'title' | 'extra'> {
  onBack?: PageHeaderProps['onBack'] | true;
}

export const CustomPageHeader: React.FC<CustomPageHeaderProps> = ({ onBack, ...props }) => {
  const navigate = useNavigate();

  const handlerBack = useMemo(() => {
    if (!onBack) {
      return undefined;
    }
    if (onBack === true) {
      return () => navigate(-1);
    }
    if (typeof onBack === 'function') {
      return onBack;
    }
    return undefined;
  }, [onBack]);

  return (
    <PageHeader
      className="ant-pro-page-container-warp-page-header"
      breadcrumb={<ProBreadcrumb />}
      onBack={handlerBack}
      {...props}
    />
  );
};
