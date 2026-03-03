import type { ProColumns } from '@ant-design/pro-components';

interface BuildFinancialBaseColumnsArgs {
  valueEnum: any;
}

export const buildFinancialBaseColumns = ({
  valueEnum,
}: BuildFinancialBaseColumnsArgs): ProColumns<any>[] => {
  return [
    { title: '基金名称', dataIndex: 'name', width: 250 },
    { title: '基金编码', dataIndex: 'code', width: 90 },
    {
      title: '昨日收益',
      fixed: 'right' as const,
      dataIndex: 'yesterdayProfit',
      width: 90,
      valueType: 'money' as const,
      hideInSearch: true,
    },
    {
      title: '余额',
      dataIndex: 'balance',
      width: 90,
      valueType: 'money' as const,
      hideInSearch: true,
    },
    {
      title: '累计手续费',
      dataIndex: 'totalFee',
      width: 110,
      valueType: 'money' as const,
      hideInSearch: true,
    },
    {
      title: '购买渠道',
      dataIndex: 'channel',
      width: 130,
      valueEnum,
    },
  ];
};
