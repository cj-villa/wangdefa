import { TransactionOutlined } from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo, useRef } from 'react';
import { ConfirmButton } from 'src/components';
import request from 'src/request';
import { useRoute } from 'src/share/hooks/use-route';
import { showModal } from 'src/share/ui/show-modal';
import { buildTransactionColumns } from './columns';
import { CreateFinancialTransaction } from './create-Financial-transaction';

export const FinancialTransaction = () => {
  const { params } = useRoute();
  const transactionActionRef = useRef<ActionType>(null);

  const columns = useMemo(() => {
    const baseColumns = buildTransactionColumns();

    return [
      ...baseColumns,
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right' as const,
        width: 170,
        render(_: any, entity: any) {
          return (
            <div style={{ display: 'flex', gap: '8px' }}>
              <ConfirmButton
                type="text"
                size="small"
                onClick={() => {
                  showModal({
                    title: '编辑交易',
                    content: <CreateFinancialTransaction initialValues={entity} />,
                    onOk: () => transactionActionRef.current?.reload(),
                  });
                }}
              >
                编辑
              </ConfirmButton>
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
    ];
  }, []);

  return (
    <ProTable
      actionRef={transactionActionRef}
      scroll={{ x: 800 }}
      columns={columns}
      request={request.listFinancialTransaction}
      search={{
        defaultCollapsed: false,
        labelWidth: 88,
        span: 8,
      }}
      form={{
        syncToUrl: false,
        initialValues: {
          financialId: params.financialId,
        },
      }}
      tableAlertRender={false}
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
