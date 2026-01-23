import { ActionType, ProTable } from '@ant-design/pro-components';
import request from 'src/request';
import React, { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { CreateFund } from 'src/routes/fund/create-fund';
import { showModal } from 'src/share/ui/show-modal';
import { ConfirmButton, useConsulSelectOptions } from 'src/components';
import { useRoute } from 'src/share/hooks/use-route';
import { DEFAULT_TAB_KEY } from 'src/share/hooks/use-tabs';

export const FundTab = () => {
  const { setParams } = useRoute();
  const fundActionRef = useRef<ActionType>(null);

  const { valueEnum } = useConsulSelectOptions('fund_channel');

  return (
    <ProTable
      actionRef={fundActionRef}
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
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          hideInSearch: true,
          width: 150,
          render(_, entity) {
            return (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    showModal({
                      title: '编辑基金',
                      content: <CreateFund initialValues={entity} />,
                      onOk: () => {
                        fundActionRef.current?.reload();
                      },
                    });
                  }}
                >
                  编辑
                </Button>
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
                    await request.deleteFund({ id: entity.id });
                    fundActionRef.current?.reload();
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
      request={request.listFund}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            showModal({
              title: '添加基金',
              content: <CreateFund />,
              onOk: () => {
                fundActionRef.current?.reload();
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
