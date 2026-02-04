import React from 'react';
import { Card } from 'antd';
import request from 'src/request';
import { ProTable } from '@ant-design/pro-components';
import { FinancialTransactionType } from 'src/request/type/financial';

export const Transactions = () => {
  return (
    <Card>
      <ProTable
        request={request.listFinancialTransaction}
        search={false}
        scroll={{ x: 800 }}
        columns={[
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
            valueType: 'date',
          },
          {
            title: '份额确认日期',
            dataIndex: 'ensureDate',
            width: 100,
            valueType: 'date',
          },
        ]}
        rowKey="id"
        pagination={{ defaultPageSize: 10 }}
      />
    </Card>
  );
};
