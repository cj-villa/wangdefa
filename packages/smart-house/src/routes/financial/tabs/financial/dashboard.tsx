// 收益看板组件
import { DollarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { Card, Row, Col, Statistic } from 'antd';
import { useRequest } from 'ahooks';
import request from 'src/request';
import type { FinancialSummary } from 'src/request/type/financial';

const DefaultData: FinancialSummary = {
  // 总资产
  totalAssets: 0,
  // 总支出
  totalCost: 0,
  // 昨日收益
  yesterdayProfit: 0,
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
            value={data.totalAssets}
            precision={2}
            prefix="¥"
            valueStyle={{ color: '#3f8600' }}
            suffix={<DollarOutlined />}
            loading={loading}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="累计收益"
            value={totalProfit}
            precision={2}
            prefix="¥"
            valueStyle={{ color: totalProfit >= 0 ? '#3f8600' : '#cf1322' }}
            suffix={totalProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
            loading={loading}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="昨日收益"
            value={data.yesterdayProfit}
            precision={2}
            prefix="¥"
            valueStyle={{ color: data.yesterdayProfit >= 0 ? '#3f8600' : '#cf1322' }}
            suffix={data.yesterdayProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
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
