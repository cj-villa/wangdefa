import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import { FundTab } from './fund';
import { FundTransaction } from 'src/routes/fund/fund-transaction';

const { TabPane } = Tabs;

export const FundPage = () => {
  const [activeTab, setActiveTab] = useState('funds');

  return (
    <Card>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="基金列表" key="funds">
          <FundTab />
        </TabPane>

        <TabPane tab="基金交易" key="transactions">
          <FundTransaction />
        </TabPane>
      </Tabs>
    </Card>
  );
};