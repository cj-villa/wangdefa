import type { ProColumns } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { FinancialTransactionType } from 'src/request/type/financial';

export const buildTransactionColumns = (defaultCode?: string | string[]): ProColumns<any>[] => {
  return [
    {
      title: '基金名称',
      dataIndex: 'name',
      hideInTable: true,
    },
    {
      title: '基金编码',
      dataIndex: 'code',
      hideInTable: true,
      initialValue: defaultCode,
    },
    { title: '基金名称', dataIndex: ['financial', 'name'], width: 250 },
    { title: '基金编码', dataIndex: ['financial', 'code'], width: 120 },
    {
      title: '交易类型',
      dataIndex: 'transactionType',
      width: 100,
      valueEnum: {
        [FinancialTransactionType.BUY]: { text: '购买', status: 'Success' },
        [FinancialTransactionType.SELL]: { text: '卖出', status: 'Error' },
      },
    },
    {
      title: '交易金额',
      dataIndex: 'amount',
      width: 120,
    },
    {
      title: '交易日期',
      dataIndex: 'transactionDate',
      width: 100,
      valueType: 'date' as const,
    },
    {
      title: '份额确认日期',
      dataIndex: 'ensureDate',
      width: 100,
      valueType: 'date' as const,
    },
    {
      title: '确认日期范围',
      dataIndex: 'dateRange',
      valueType: 'dateRange' as const,
      hideInTable: true,
      search: {
        transform: (value: [string, string]) => ({
          from: dayjs(value[0]).startOf('day').toISOString(),
          to: dayjs(value[1]).endOf('day').toISOString(),
        }),
      },
    },
  ];
};
