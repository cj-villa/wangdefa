import React, { useRef } from 'react';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { showModal } from 'src/share/ui/show-modal';
import { UpsertConfigModal } from 'src/routes/system/config/upsert-config-modal';
import request from 'src/request';

export const SystemConfig = () => {
  const actionRef = useRef<ActionType>(null);

  return (
    <ProTable
      actionRef={actionRef}
      scroll={{ x: 300 }}
      columns={[
        { title: '名称', dataIndex: 'name', width: 300 },
        {
          title: '操作',
          dataIndex: 'action',
          width: 100,
          render(_, entity) {
            return (
              <Button
                type="link"
                size="small"
                onClick={() => {
                  showModal({
                    title: '编辑配置',
                    width: 600,
                    content: <UpsertConfigModal name={entity.name} />,
                    onOk: () => {
                      actionRef.current?.reload();
                    },
                  });
                }}
              >
                编辑
              </Button>
            );
          },
        },
      ]}
      search={false}
      request={(args) =>
        request.listSystemConfig(args).then((result) => {
          result.data = result.data.map((i: string) => ({ name: i }));
          return result;
        })
      }
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            showModal({
              title: '新建配置',
              width: 600,
              content: <UpsertConfigModal />,
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
