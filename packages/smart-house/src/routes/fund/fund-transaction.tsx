import { ActionType, ProTable } from '@ant-design/pro-components';
import request from 'src/request';
import React, { useRef } from 'react';
import { TransactionOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { CreateFundTransaction } from 'src/routes/fund/create-fund-transaction';
import { showModal } from 'src/share/ui/show-modal';
import { ConfirmButton } from 'src/components';
import { useTableColumns } from 'src/share/hooks/use-table-columns';

export const FundTransaction = () => {
  const transactionActionRef = useRef<ActionType>(null);

  const columns = useTableColumns<any>([
    { title: '基金名称', dataIndex: ['fund', 'name'], width: 150 },
    { title: '基金编码', dataIndex: ['fund', 'code'], width: 120 },
    {
      title: '交易类型',
      dataIndex: 'transactionType',
      width: 100,
    },
    {
      title: '交易份额',
      dataIndex: 'shares',
      width: 120,
    },
    {
      title: '交易日期',
      dataIndex: 'transactionDate',
      width: 200,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
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
      request={request.listFundTransaction}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<TransactionOutlined />}
          onClick={() => {
            showModal({
              title: '添加交易',
              width: 600,
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
      ]}
      rowKey="id"
      pagination={{
        pageSize: 10,
      }}
    />
  );
};
