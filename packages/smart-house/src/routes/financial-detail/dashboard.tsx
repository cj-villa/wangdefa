import React, { useMemo } from 'react';
import { Card, Col, Flex, Row, Statistic } from 'antd';
import { FallOutlined, RiseOutlined } from '@ant-design/icons';
import { FinancialDetail } from 'src/request/type/financial';
import { roundPrice } from 'src/share/toolkits/tookit';
import dayjs from 'dayjs';

export const Dashboard: React.FC<{ detail: FinancialDetail }> = ({ detail }) => {
  const { valueTrends } = detail;
  const totalProfit = detail.totalAssets - detail.totalCost;

  const yearProfit = useMemo(() => {
    const now = dayjs();
    // 最多366天咯
    let profit = 0;
    valueTrends.slice(-366).forEach((i) => {
      if (i.balance !== 0) {
        profit += i.balance;
      }
    });
    return profit;
  }, []);

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
