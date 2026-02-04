// 收益看板组件
import { DollarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { Card, Row, Col, Statistic } from 'antd';
import { useRequest } from 'ahooks';
import request from 'src/request';
import type { FinancialSummary } from 'src/request/type/financial';
import { roundPrice } from 'src/share/toolkits/tookit';

const DefaultData: FinancialSummary = {
  // 总资产
  totalAssets: 0,
  // 总支出
  totalCost: 0,
  // 昨日收益
  preDayProfit: 0,
  // 产品数量
  productCount: 0,
};

export const FinancialProfitDashboard = () => {
  const { data = DefaultData, loading } = useRequest(request.getFinancialSummary);

  const totalProfit = data.totalAssets - data.totalCost;

  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title="总资产"
            value={roundPrice(data.totalAssets)}
            prefix="¥"
            valueStyle={{ color: '#cf1322' }}
            loading={loading}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="累计收益"
            value={roundPrice(totalProfit)}
            prefix="¥"
            valueStyle={{ color: totalProfit >= 0 ? '#cf1322' : '#3f8600' }}
            suffix={totalProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
            loading={loading}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="昨日收益"
            value={roundPrice(data.preDayProfit)}
            prefix="¥"
            valueStyle={{ color: data.preDayProfit >= 0 ? '#cf1322' : '#3f8600' }}
            suffix={data.preDayProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
            loading={loading}
          />
        </Col>
        <Col span={6}>
          <Statistic title="持有产品" value={data.productCount} suffix="个" loading={loading} />
        </Col>
      </Row>
    </Card>
  );
};
