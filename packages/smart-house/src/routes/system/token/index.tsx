import { ActionType, ProTable } from '@ant-design/pro-components';
import request from 'src/request';
import React, { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { CreateToken } from 'src/routes/system/token/create-token';
import { showModal } from 'src/share/ui/show-modal';
import { ConfirmButton } from 'src/components';

export const TokenPage = () => {
  const actionRef = useRef<ActionType>(null);

  return (
    <ProTable
      actionRef={actionRef}
      columns={[
        { title: '名称', dataIndex: 'name', width: 100 },
        { title: 'token', dataIndex: 'token', valueType: 'password', width: 300 },
        {
          title: '操作',
          dataIndex: 'action',
          width: 100,
          render(_, entity) {
            return (
              <ConfirmButton
                confirmText={`是否确认删除 ${entity.name}`}
                onClick={async () => {
                  await request.deleteToken({ id: entity.id });
                  actionRef.current?.reload();
                  message.success('删除成功');
                }}
              >
                删除
              </ConfirmButton>
            );
          },
        },
      ]}
      search={false}
      request={request.listToken}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            showModal({
              content: <CreateToken />,
              onOk: () => {
                actionRef.current?.reload();
              },
            });
          }}
          type="primary"
        >
          新建
        </Button>,
      ]}
    />
  );
};
