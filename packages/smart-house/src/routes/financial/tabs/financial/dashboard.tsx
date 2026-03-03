// 收益看板组件
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Card, Flex, Statistic } from 'antd';
import request from 'src/request';
import type { FinancialSummary } from 'src/request/type/financial';
import { roundPrice } from 'src/share/toolkits/tookit';

const DefaultData: FinancialSummary = {
  // 总资产
  totalAssets: 0,
  // 总手续费
  totalFee: 0,
  // 总支出
  totalCost: 0,
  // 累计收益
  totalProfit: 0,
  // 昨日收益
  preDayProfit: 0,
  // 产品数量
  productCount: 0,
};

export const FinancialProfitDashboard = () => {
  const { data = DefaultData, loading } = useRequest(request.getFinancialSummary);

  const totalProfit = data.totalProfit;

  return (
    <Card style={{ marginBottom: 16 }}>
      <Flex>
        <Statistic
          style={{ flex: 1 }}
          title="总资产"
          value={roundPrice(data.totalAssets)}
          prefix="¥"
          valueStyle={{ color: '#cf1322' }}
          loading={loading}
        />

        <Statistic
          style={{ flex: 1 }}
          title="总手续费"
          value={roundPrice(data.totalFee)}
          prefix="¥"
          valueStyle={{ color: '#cf1322' }}
          loading={loading}
        />

        <Statistic
          style={{ flex: 1 }}
          title="累计收益"
          value={roundPrice(totalProfit)}
          prefix="¥"
          valueStyle={{ color: totalProfit >= 0 ? '#cf1322' : '#3f8600' }}
          suffix={totalProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
          loading={loading}
        />

        <Statistic
          style={{ flex: 1 }}
          title="昨日收益"
          value={roundPrice(data.preDayProfit)}
          prefix="¥"
          valueStyle={{ color: data.preDayProfit >= 0 ? '#cf1322' : '#3f8600' }}
          suffix={data.preDayProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
          loading={loading}
        />

        <Statistic
          style={{ flex: 1 }}
          title="持有产品"
          value={data.productCount}
          suffix="个"
          loading={loading}
        />
      </Flex>
    </Card>
  );
};
