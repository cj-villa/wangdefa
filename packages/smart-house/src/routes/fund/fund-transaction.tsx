import { ActionType, ProTable } from '@ant-design/pro-components';
import request from 'src/request';
import React, { useRef } from 'react';
import { TransactionOutlined } from '@ant-design/icons';
import { Button, message, Tabs, Card } from 'antd';
import { CreateFundTransaction } from 'src/routes/fund/create-fund-transaction';
import { showModal } from 'src/share/show-modal';
import { ConfirmButton } from 'src/components';

export const FundTransaction = () => {
  const transactionActionRef = useRef<ActionType>(null);

  return (
    <ProTable
      actionRef={transactionActionRef}
      columns={[
        { title: '基金名称', dataIndex: 'fundName', width: 150 },
        { title: '基金编码', dataIndex: 'fundCode', width: 120 },
        {
          title: '交易类型',
          dataIndex: 'transactionType',
          width: 100,
        },
        {
          title: '交易金额',
          dataIndex: 'amount',
          width: 120,
          valueType: 'money',
        },
        {
          title: '交易份额',
          dataIndex: 'shares',
          width: 120,
          render: (_, { shares }) => shares?.toFixed(4),
        },
        {
          title: '交易价格',
          dataIndex: 'transactionPrice',
          width: 120,
          valueType: 'money',
        },
        {
          title: '交易日期',
          dataIndex: 'transactionDate',
          width: 120,
          valueType: 'dateTime',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 150,
          render(_, entity: any) {
            return (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    showModal({
                      title: '编辑交易',
                      content: <CreateFundTransaction initialValues={entity} />,
                      onOk: () => {
                        transactionActionRef.current?.reload();
                      },
                    });
                  }}
                >
                  编辑
                </Button>
                <ConfirmButton
                  confirmText="是否确认删除该交易记录？"
                  onClick={async () => {
                    await request.deleteFundTransaction({ id: entity.id });
                    transactionActionRef.current?.reload();
                    message.success('删除成功');
                  }}
                  type="text"
                  size="small"
                  danger
                >
                  删除
                </ConfirmButton>
              </div>
            );
          },
        },
      ]}
      request={request.listFundTransaction}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<TransactionOutlined />}
          onClick={() => {
            showModal({
              title: '添加交易',
              content: <CreateFundTransaction />,
              onOk: () => {
                transactionActionRef.current?.reload();
              },
            });
          }}
          type="primary"
        >
          新建交易
        </Button>,
        <Button key="back">返回基金列表</Button>,
      ]}
      rowKey="id"
      pagination={{
        pageSize: 10,
      }}
    />
  );
};
