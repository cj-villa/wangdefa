import { Line } from '@ant-design/charts';
import { type LineConfig } from '@ant-design/plots/es/components/line';
import { Card, Flex } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { FinancialDetail } from 'src/request/type/financial';
import { roundPrice } from 'src/share/toolkits/tookit';

const getStart = (count = 0) => Math.max(1 - 30 / count, 0);

export const Charts: React.FC<{ detail: FinancialDetail }> = ({ detail }) => {
  const { valueTrends, netValueTrends } = detail;

  const lineValue = useMemo(
    () => valueTrends.map((i) => ({ ...i, balance: roundPrice(i.balance) })),
    [valueTrends]
  );
  const lineNetValue = useMemo(
    () => netValueTrends.map((i) => ({ ...i, value: roundPrice(i.value) })),
    [netValueTrends]
  );

  // 净值图表配置
  const netValueConfig: LineConfig = {
    xField: 'date',
    yField: 'value',
    axis: {
      x: {
        size: 30,
        labelFormatter: (d: string) => dayjs(d).format('MM/DD'),
      },
    },
    seriesField: 'type',
    color: ['#1890ff', '#52c41a'],
    interactions: [{ type: 'marker-active' }],
    slider: {
      x: {
        labelFormatter: (d: string) => dayjs(d).format('YYYY/M/D'),
        values: [getStart(netValueTrends.length), 1],
      },
    },
  };

  // 余额图表配置
  const balanceConfig: LineConfig = {
    xField: 'date',
    yField: 'balance',
    axis: {
      x: {
        size: 30,
        labelFormatter: (d: string) => dayjs(d).format('MM/DD'),
      },
    },
    color: '#faad14',
    interactions: [{ type: 'marker-active' }],
    slider: {
      x: {
        labelFormatter: (d: string) => dayjs(d).format('YYYY/M/D'),
        values: [getStart(valueTrends.length), 1],
      },
    },
  };

  return (
    <Card>
      <Flex vertical>
        <Line title="余额趋势" {...balanceConfig} data={lineValue} height={300} />
        <Line
          title={`${detail.financial.channel === 'icbc_currency' ? '万份利润' : '净值'}趋势`}
          {...netValueConfig}
          data={lineNetValue}
          height={300}
        />
      </Flex>
    </Card>
  );
};
