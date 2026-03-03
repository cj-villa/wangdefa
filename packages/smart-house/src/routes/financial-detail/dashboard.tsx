import { FallOutlined, RiseOutlined } from '@ant-design/icons';
import { Card, Flex, Statistic } from 'antd';
import React from 'react';
import { FinancialDetail } from 'src/request/type/financial';
import { roundPrice } from 'src/share/toolkits/tookit';

export const Dashboard: React.FC<{ detail: FinancialDetail }> = ({ detail }) => {
  const totalProfit = detail.totalAssets - detail.totalCost;

  return (
    <Card style={{ marginBottom: 16 }}>
      <Flex>
        <Statistic
          style={{ flex: 1 }}
          title="当前余额"
          value={roundPrice(detail.totalAssets)}
          prefix="¥"
          valueStyle={{ color: '#cf1322' }}
        />
        <Statistic style={{ flex: 1 }} title="份额" value={roundPrice(detail.shares)} />
        <Statistic
          style={{ flex: 1 }}
          title="累计收益"
          value={roundPrice(totalProfit)}
          prefix="¥"
          valueStyle={{ color: totalProfit >= 0 ? '#cf1322' : '#3f8600' }}
          suffix={totalProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
        />
        <Statistic
          style={{ flex: 1 }}
          title="昨日收益"
          value={roundPrice(detail.preDayProfit)}
          prefix="¥"
          valueStyle={{ color: detail.preDayProfit >= 0 ? '#cf1322' : '#3f8600' }}
          suffix={detail.preDayProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
        />
      </Flex>
    </Card>
  );
};
