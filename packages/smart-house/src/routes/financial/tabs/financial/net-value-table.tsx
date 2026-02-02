import React from 'react';
import { ActionType, ProTable } from '@ant-design/pro-components';
import request from 'src/request';
import dayjs from 'dayjs';
import { message } from 'antd';
import { ConfirmButton } from 'src/components';

export const NetValueTable = ({ code }: { code: string }) => {
  const actionRef = React.useRef<ActionType>(null);
  return (
    <ProTable
      actionRef={actionRef}
      params={{ code }}
      request={request.listFinancialNetValue}
      search={false}
      pagination={{ defaultPageSize: 10 }}
      columns={[
        {
          title: '日期',
          dataIndex: 'date',
          valueType: 'date',
        },
        {
          title: '万份收益/净值',
          dataIndex: 'value',
        },
      ]}
      toolBarRender={() => [
        <ConfirmButton
          type="button"
          onClick={() =>
            request
              .updateFinancialNetValue({
                code: code,
                from: dayjs().subtract(1, 'y').valueOf(),
              })
              .then(() => {
                message.success('更新成功');
                actionRef.current?.reload();
              })
          }
        >
          更新净值
        </ConfirmButton>,
      ]}
    />
  );
};
