import type { ProColumns } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import React from 'react';
import { ListSelect } from 'src/components';
import { FinancialTransactionType } from 'src/request/type/financial';

export const buildTransactionColumns = (defaultFinancialId?: string): ProColumns<any>[] => {
  return [
    {
      title: '基金',
      dataIndex: 'financialId',
      hideInTable: true,
      initialValue: defaultFinancialId,
      renderFormItem: () => (
        <ListSelect
          request="/api/financial/list"
          fieldNames={{ label: 'name', value: 'id' }}
          tips="code"
          allowClear
          placeholder="请选择基金"
        />
      ),
    },
    { title: '基金名称', hideInSearch: true, dataIndex: ['financial', 'name'], width: 250 },
    { title: '基金编码', hideInSearch: true, dataIndex: ['financial', 'code'], width: 120 },
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
