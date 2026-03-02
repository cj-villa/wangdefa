import { Line } from '@ant-design/charts';
import { type LineConfig } from '@ant-design/plots/es/components/line';
import { Card, Flex, Segmented, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { FinancialDetail } from 'src/request/type/financial';
import { roundPrice } from 'src/share/toolkits/tookit';

const getStart = (count = 0) => Math.max(1 - 30 / count, 0);
const formatNetValue = (value: number) => Number(value || 0).toFixed(4);
const toNetValueNumber = (value: number) => Number(formatNetValue(value));
type TrendView = 'chart' | 'table';

const assertNetValueFormat = () => {
  if (formatNetValue(1) !== '1.0000') {
    throw new Error('net value formatter assertion failed');
  }
};

if (process.env.NODE_ENV !== 'production') {
  assertNetValueFormat();
}

export const Charts: React.FC<{ detail: FinancialDetail }> = ({ detail }) => {
  const { valueTrends, netValueTrends } = detail;
  const [balanceView, setBalanceView] = useState<TrendView>('chart');
  const [netValueView, setNetValueView] = useState<TrendView>('chart');
  const netValueTitle = `${detail.financial.channel === 'icbc_currency' ? '万份利润' : '净值'}趋势`;

  const lineValue = useMemo(
    () => valueTrends.map((i) => ({ ...i, balance: roundPrice(Number(i.balance || 0)) })),
    [valueTrends]
  );
  const lineNetValue = useMemo(
    () => netValueTrends.map((i) => ({ ...i, value: toNetValueNumber(Number(i.value || 0)) })),
    [netValueTrends]
  );
  const tableBalanceData = useMemo(
    () =>
      [...lineValue].sort((a: any, b: any) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()),
    [lineValue]
  );
  const tableNetValueData = useMemo(
    () =>
      [...lineNetValue].sort((a: any, b: any) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()),
    [lineNetValue]
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
      y: {
        labelFormatter: (v: string) => formatNetValue(Number(v)),
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: netValueTitle,
        value: formatNetValue(Number(datum.value || 0)),
      }),
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
    tooltip: {
      formatter: (datum: any) => ({
        name: '余额',
        value: String(roundPrice(Number(datum.balance || 0))),
      }),
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
      <Flex vertical gap={16}>
        <Card
          title="余额趋势"
          size="small"
          extra={
            <Segmented
              value={balanceView}
              onChange={(value) => setBalanceView(value as TrendView)}
              options={[
                { label: '折线图', value: 'chart' },
                { label: '列表', value: 'table' },
              ]}
            />
          }
        >
          {balanceView === 'chart' ? (
            <Line {...balanceConfig} data={lineValue} height={300} />
          ) : (
            <Table
              size="small"
              rowKey="date"
              pagination={{ pageSize: 10 }}
              dataSource={tableBalanceData}
              columns={[
                {
                  title: '日期',
                  dataIndex: 'date',
                  render: (value: string) => dayjs(value).format('YYYY-MM-DD'),
                },
                {
                  title: '余额',
                  dataIndex: 'balance',
                  render: (value: number) => roundPrice(Number(value || 0)),
                },
              ]}
            />
          )}
        </Card>
        <Card
          title={netValueTitle}
          size="small"
          extra={
            <Segmented
              value={netValueView}
              onChange={(value) => setNetValueView(value as TrendView)}
              options={[
                { label: '折线图', value: 'chart' },
                { label: '列表', value: 'table' },
              ]}
            />
          }
        >
          {netValueView === 'chart' ? (
            <Line {...netValueConfig} data={lineNetValue} height={300} />
          ) : (
            <Table
              size="small"
              rowKey="date"
              pagination={{ pageSize: 10 }}
              dataSource={tableNetValueData}
              columns={[
                {
                  title: '日期',
                  dataIndex: 'date',
                  render: (value: string) => dayjs(value).format('YYYY-MM-DD'),
                },
                {
                  title: detail.financial.channel === 'icbc_currency' ? '万份利润' : '净值',
                  dataIndex: 'value',
                  render: (value: number) => formatNetValue(Number(value || 0)),
                },
              ]}
            />
          )}
        </Card>
      </Flex>
    </Card>
  );
};
