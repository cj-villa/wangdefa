import { ActionType, ProTable } from '@ant-design/pro-components';
import request from 'src/request';
import React, { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { CreateFund } from 'src/routes/fund/create-fund';
import { showModal } from 'src/share/show-modal';
import { ConfirmButton } from 'src/components';

export const FundPage = () => {
  const actionRef = useRef<ActionType>(null);

  return (
    <ProTable
      actionRef={actionRef}
      columns={[
        { title: '基金名称', dataIndex: 'name', width: 150 },
        { title: '基金编码', dataIndex: 'code', width: 120 },
        {
          title: '操作',
          dataIndex: 'action',
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
                        actionRef.current?.reload();
                      },
                    });
                  }}
                >
                  编辑
                </Button>
                <ConfirmButton
                  confirmText={`是否确认删除基金 "${entity.name}"？`}
                  onClick={async () => {
                    await request.deleteFund({ id: entity.id });
                    actionRef.current?.reload();
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
      request={async (params) => {
        const { data } = await request.listFund(params);
        return {
          data: data?.list || [],
          total: data?.total || 0,
          success: true,
        };
      }}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            showModal({
              title: '添加基金',
              content: <CreateFund />,
              onOk: () => {
                actionRef.current?.reload();
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
