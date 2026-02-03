import React from 'react';
import { Tabs, Card } from 'antd';
import { FinancialTab } from './tabs/financial/financial';
import { FinancialTransaction } from './tabs/financial-transaction/financial-transaction';
import { useTab } from 'src/share/hooks/use-tabs';
import { TabsProps } from 'antd/es/tabs';

const tabItems: NonNullable<TabsProps['items']> = [
  {
    label: '理财列表',
    key: 'financials',
    children: <FinancialTab />,
  },
  {
    label: '理财交易',
    key: 'transactions',
    children: <FinancialTransaction />,
  },
];

export const FinancialPage = () => {
  const { activeKey, onChange } = useTab(['financials', 'transactions']);

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
