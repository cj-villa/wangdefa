import { ActionType, ProTable } from '@ant-design/pro-components';
import { message } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { ConfirmButton } from 'src/components';
import request from 'src/request';
import { DEFAULT_TABLE_PAGINATION } from 'src/share/ui/pagination';

type NetValueRecord = {
  date?: string;
  value?: string | number;
  dailyComputedChangeRate?: number | null;
};

const parseDailyChangeValue = (raw: string | number | undefined): number | null => {
  if (raw === undefined || raw === null || raw === '') {
    return null;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatDailyChange = (record: NetValueRecord): string => {
  const parsed = record.dailyComputedChangeRate;
  if (parsed === null || parsed === undefined) {
    return '--';
  }
  return `${(parsed * 100).toFixed(2)}%`;
};

const getDailyChangeColor = (record: NetValueRecord): string | undefined => {
  const parsed = record.dailyComputedChangeRate;
  if (parsed === null || parsed === undefined || parsed === 0) {
    return undefined;
  }
  return parsed > 0 ? '#cf1322' : '#389e0d';
};

const buildDailyChangeRate = (
  current?: string | number,
  previous?: string | number
): number | null => {
  const currentValue = parseDailyChangeValue(current);
  const previousValue = parseDailyChangeValue(previous);
  if (currentValue === null || previousValue === null || previousValue === 0) {
    return null;
  }
  return (currentValue - previousValue) / previousValue;
};

export const NetValueTable = ({ code }: { code: string }) => {
  const actionRef = React.useRef<ActionType>(null);
  return (
    <ProTable
      actionRef={actionRef}
      params={{ code }}
      request={async (params) => {
        const response = await request.listFinancialNetValue({ ...params, extraLimit: 1 } as {
          code: string;
        });
        const rows = Array.isArray(response?.data) ? response.data : [];
        const data = rows
          .map((row: NetValueRecord, index: number) => ({
            ...row,
            dailyComputedChangeRate: buildDailyChangeRate(row.value, rows[index + 1]?.value),
          }))
          .slice(0, params.pageSize ?? 10);
        return {
          ...response,
          data,
        };
      }}
      search={false}
      pagination={DEFAULT_TABLE_PAGINATION}
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
        {
          title: '日涨幅',
          dataIndex: 'dailyComputedChangeRate',
          render: (_: unknown, record: NetValueRecord) => (
            <span style={{ color: getDailyChangeColor(record) }}>{formatDailyChange(record)}</span>
          ),
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
