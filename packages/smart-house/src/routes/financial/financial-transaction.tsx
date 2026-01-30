import { ActionType, ProTable } from '@ant-design/pro-components';
import request from 'src/request';
import React, { useRef } from 'react';
import { TransactionOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { CreateFinancialTransaction } from 'src/routes/financial/create-Financial-transaction';
import { showModal } from 'src/share/ui/show-modal';
import { ConfirmButton } from 'src/components';
import { useTableColumns } from 'src/share/hooks/use-table-columns';
import dayjs from 'dayjs';
import { FinancialTransactionType } from 'src/request/type/financial';

export const FinancialTransaction = () => {
  const transactionActionRef = useRef<ActionType>(null);

  const columns = useTableColumns<any>([
    { title: '基金名称', dataIndex: ['financial', 'name'], width: 250 },
    { title: '基金编码', dataIndex: ['financial', 'code'], width: 120, initIndex: 'code' },
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
    // {
    //   title: '交易份额',
    //   dataIndex: 'shares',
    //   width: 120,
    // },
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
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 200,
      render(_, entity: any) {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              type="link"
              size="small"
              onClick={() => {
                showModal({
                  title: '编辑交易',
                  content: <CreateFinancialTransaction initialValues={entity} />,
                  onOk: () => {
                    transactionActionRef.current?.reload();
                  },
                });
              }}
            >
              编辑
            </Button>
            <ConfirmButton
              type="text"
              size="small"
              onClick={() =>
                request
                  .updateFinancialValue({
                    code: entity.financial.code,
                    from: dayjs(entity.ensureDate).valueOf(),
                  })
                  .then(() => {
                    message.success('更新成功');
                  })
              }
            >
              更新净值
            </ConfirmButton>
            <ConfirmButton
              confirmText="是否确认删除该交易记录？"
              onClick={async () => {
                await request.deleteFinancialTransaction({ id: entity.id });
                transactionActionRef.current?.reload();
                message.success('删除成功');
              }}
              type="text"
              size="small"
            >
              删除
            </ConfirmButton>
          </div>
        );
      },
    },
  ]);

  return (
    <ProTable
      actionRef={transactionActionRef}
      scroll={{ x: 800 }}
      columns={columns}
      request={request.listFinancialTransaction}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<TransactionOutlined />}
          onClick={() => {
            showModal({
              title: '添加交易',
              width: 600,
              content: <CreateFinancialTransaction />,
              onOk: () => {
                transactionActionRef.current?.reload();
              },
            });
          }}
          type="primary"
        >
          新建交易
        </Button>,
      ]}
      rowKey="id"
      pagination={{
        pageSize: 10,
      }}
    />
  );
};
