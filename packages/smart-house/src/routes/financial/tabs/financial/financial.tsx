import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmButton, useConsulSelectOptions } from 'src/components';
import request from 'src/request';
import { CreateFinancial } from 'src/routes/financial/tabs/financial/create-financial';
import { FinancialProfitDashboard } from 'src/routes/financial/tabs/financial/dashboard';
import { NetValueTable } from 'src/routes/financial/tabs/financial/net-value-table';
import { useRoute } from 'src/share/hooks/use-route';
import { DEFAULT_TAB_KEY } from 'src/share/hooks/use-tabs';
import { showModal } from 'src/share/ui/show-modal';
import { buildFinancialBaseColumns } from './columns';

export const FinancialTab = () => {
  const { setParams } = useRoute();
  const financialActionRef = useRef<ActionType>(null);
  const navigate = useNavigate();

  const { valueEnum } = useConsulSelectOptions('financial_channel');
  const columns = useMemo(() => {
    const baseColumns = buildFinancialBaseColumns({ valueEnum });

    return [
      ...baseColumns,
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right' as const,
        hideInSearch: true,
        width: 300,
        render(_: any, entity: any) {
          return (
            <div style={{ display: 'flex', gap: '8px' }}>
              <ConfirmButton
                type="text"
                size="small"
                onClick={() => navigate(`/financial/detail?id=${entity.id}`)}
              >
                查看详情
              </ConfirmButton>
              <ConfirmButton
                type="text"
                size="small"
                onClick={() => {
                  showModal({
                    title: '编辑基金',
                    content: <CreateFinancial initialValues={entity} />,
                    onOk: () => financialActionRef.current?.reload(),
                  });
                }}
              >
                编辑
              </ConfirmButton>
              <ConfirmButton
                type="text"
                size="small"
                onClick={() =>
                  showModal({
                    width: 700,
                    title: `${entity.name}净值`,
                    content: <NetValueTable code={entity.code} />,
                  })
                }
              >
                查看净值
              </ConfirmButton>
              <ConfirmButton
                type="text"
                size="small"
                onClick={() => {
                  setParams({
                    financialId: entity.id,
                    code: entity.code,
                    [DEFAULT_TAB_KEY]: 'transactions',
                  });
                }}
              >
                查看交易
              </ConfirmButton>
              <ConfirmButton
                confirmText={`是否确认删除基金 "${entity.name}"？`}
                onClick={async () => {
                  await request.deleteFinancial({ id: entity.id });
                  financialActionRef.current?.reload();
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
  }, [valueEnum, navigate, setParams]);

  return (
    <div>
      <FinancialProfitDashboard />
      <ProTable
        actionRef={financialActionRef}
        scroll={{ x: 700 }}
        columns={columns}
        request={request.listFinancial}
        search={{
          defaultCollapsed: false,
          labelWidth: 78,
          span: 8,
        }}
        form={{
          syncToUrl: false,
        }}
        tableAlertRender={false}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              showModal({
                title: '添加基金',
                content: <CreateFinancial />,
                onOk: () => {
                  financialActionRef.current?.reload();
                },
              });
            }}
            type="primary"
          >
            新建基金
          </Button>,
        ]}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  );
};
