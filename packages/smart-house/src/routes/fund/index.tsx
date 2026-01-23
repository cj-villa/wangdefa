import React from 'react';
import { Tabs, Card } from 'antd';
import { FundTab } from './fund';
import { FundTransaction } from 'src/routes/fund/fund-transaction';
import { useTab } from 'src/share/hooks/use-tabs';
import { TabsProps } from 'antd/es/tabs';
import { useRoute } from 'src/share/hooks/use-route';

const tabItems: NonNullable<TabsProps['items']> = [
  {
    label: '基金列表',
    key: 'funds',
    children: <FundTab />,
  },
  {
    label: '基金交易',
    key: 'transactions',
    children: <FundTransaction />,
  },
];

export const FundPage = () => {
  const { activeKey, onChange } = useTab(['funds', 'transactions']);
  const { removeParam } = useRoute();

  return (
    <Card>
      <Tabs
        activeKey={activeKey}
        onChange={(key) => {
          onChange(key);
        }}
        items={tabItems}
      />
    </Card>
  );
};
