// 收益看板组件
import { FallOutlined, RiseOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Card, Flex, Statistic } from 'antd';
import { useMemo } from 'react';
import request from 'src/request';
import type { FinancialSummary } from 'src/request/type/financial';
import { roundPrice } from 'src/share/toolkits/tookit';
import { FINANCIAL_MASKED_DASHBOARD_KEYS } from './display-config';
import { MaskableValue } from './maskable-value';

const DefaultData: FinancialSummary = {
  // 总资产
  totalAssets: 0,
  // 总手续费
  totalFee: 0,
  // 总支出
  totalCost: 0,
  // 累计收益
  totalProfit: 0,
  // 昨日收益
  preDayProfit: 0,
  // 产品数量
  productCount: 0,
};

export const FinancialProfitDashboard = () => {
  const { data = DefaultData, loading } = useRequest(request.getFinancialSummary);
  const maskedMetricKeys = FINANCIAL_MASKED_DASHBOARD_KEYS as readonly string[];

  const totalProfit = data.totalProfit;
  const metrics = useMemo(
    () => [
      {
        key: 'totalAssets',
        title: '总资产',
        value: roundPrice(data.totalAssets),
        prefix: '¥',
        valueStyle: { color: '#cf1322' },
      },
      {
        key: 'totalFee',
        title: '总手续费',
        value: roundPrice(data.totalFee),
        prefix: '¥',
        valueStyle: { color: '#cf1322' },
      },
      {
        key: 'totalProfit',
        title: '累计收益',
        value: roundPrice(totalProfit),
        prefix: '¥',
        valueStyle: { color: totalProfit >= 0 ? '#cf1322' : '#3f8600' },
        suffix: totalProfit >= 0 ? <RiseOutlined /> : <FallOutlined />,
      },
      {
        key: 'preDayProfit',
        title: '昨日收益',
        value: roundPrice(data.preDayProfit),
        prefix: '¥',
        valueStyle: { color: data.preDayProfit >= 0 ? '#cf1322' : '#3f8600' },
        suffix: data.preDayProfit >= 0 ? <RiseOutlined /> : <FallOutlined />,
      },
      {
        key: 'productCount',
        title: '持有产品',
        value: data.productCount,
        suffix: '个',
      },
    ],
    [data.preDayProfit, data.productCount, data.totalAssets, data.totalFee, totalProfit]
  );

  return (
    <Card style={{ marginBottom: 16 }}>
      <Flex gap={16} wrap>
        {metrics.map((metric) => {
          const masked = maskedMetricKeys.includes(metric.key);

          return (
            <Statistic
              key={metric.key}
              style={{
                flex: 1,
                minWidth: 160,
                opacity: masked ? 0.72 : 1,
              }}
              title={metric.title}
              value={0}
              formatter={() => (
                <MaskableValue value={metric.value} defaultMasked={masked} suffix={metric.suffix} />
              )}
              prefix={metric.prefix}
              valueStyle={metric.valueStyle}
              loading={loading}
            />
          );
        })}
      </Flex>
    </Card>
  );
};
