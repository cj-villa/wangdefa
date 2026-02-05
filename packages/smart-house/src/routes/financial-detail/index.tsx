import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Empty } from 'antd';
import request from 'src/request';
import { useRoute } from 'src/share/hooks/use-route';
import { CustomPageHeader, PortalBody } from 'src/components';
import { useRequest } from 'ahooks';
import { ProSkeleton } from '@ant-design/pro-components';
import { Dashboard } from 'src/routes/financial-detail/dashboard';
import { Transactions } from 'src/routes/financial-detail/tabs/transactions';
import { Charts } from 'src/routes/financial-detail/tabs/charts';
import { CalendarStatistics } from 'src/routes/financial-detail/tabs/calendar';

export const FinancialDetailPage = () => {
  const { params } = useRoute();
  const { id } = params;
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');

  const { data: detailData, loading } = useRequest<any, any>(() =>
    request.getFinancialDetail({ id: id as string, range: timeRange })
  );

  if (loading) {
    return <ProSkeleton type="descriptions" />;
  }

  if (!detailData) {
    return <Empty />;
  }

  const { financial } = detailData;

  const tabItems = [
    {
      key: 'charts',
      label: '图表分析',
      children: <Charts detail={detailData} />,
    },
    {
      key: 'calendar',
      label: '日历图',
      children: <CalendarStatistics detail={detailData} />,
    },
    {
      key: 'transactions',
      label: '交易记录',
      children: <Transactions />,
    },
  ];

  return (
    <>
      <PortalBody id="__page-header__">
        <CustomPageHeader title={financial.name} onBack={() => navigate(-1)} />
      </PortalBody>
      {/* 头部信息 */}
      <Dashboard detail={detailData} />

      {/* 主要内容区域 */}
      <Tabs items={tabItems} defaultActiveKey="calendar" />
    </>
  );
};
