import { ActionType, ProTable } from '@ant-design/pro-components';
import request from 'src/request';
import React, { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { CreateFinancial } from 'src/routes/financial/create-financial';
import { showModal } from 'src/share/ui/show-modal';
import { ConfirmButton, useConsulSelectOptions } from 'src/components';
import { useRoute } from 'src/share/hooks/use-route';
import { DEFAULT_TAB_KEY } from 'src/share/hooks/use-tabs';
import dayjs from 'dayjs';

export const FinancialTab = () => {
  const { setParams } = useRoute();
  const financialActionRef = useRef<ActionType>(null);

  const { valueEnum } = useConsulSelectOptions('financial_channel');

  return (
    <ProTable
      actionRef={financialActionRef}
      scroll={{ x: 700 }}
      columns={[
        { title: '基金名称', dataIndex: 'name', width: 250 },
        {
          title: '购买渠道',
          dataIndex: 'channel',
          width: 100,
          valueEnum,
        },
        { title: '基金编码', dataIndex: 'code', width: 90 },
        { title: '余额', fixed: 'right', dataIndex: 'balance', width: 90, valueType: 'money' },
        {
          title: '昨日收益',
          fixed: 'right',
          dataIndex: 'yesterdayProfit',
          width: 90,
          valueType: 'money',
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          hideInSearch: true,
          width: 260,
          render(_, entity) {
            return (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    showModal({
                      title: '编辑基金',
                      content: <CreateFinancial initialValues={entity} />,
                      onOk: () => {
                        financialActionRef.current?.reload();
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
                      .updateFinancialNetValue({
                        code: entity.code,
                        from: dayjs().subtract(1, 'y').valueOf(),
                      })
                      .then(() => {
                        message.success('更新成功');
                      })
                  }
                >
                  更新净值
                </ConfirmButton>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setParams({ code: entity.code, [DEFAULT_TAB_KEY]: 'transactions' });
                  }}
                >
                  查看交易
                </Button>
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
      ]}
      request={request.listFinancial}
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
  );
};
