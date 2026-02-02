// 收益看板组件
import { useEffect, useState } from 'react';
import request from 'src/request';
import { DollarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { message, Card, Row, Col, Statistic } from 'antd';

export const FinancialProfitDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    totalProfit: 0,
    yesterdayProfit: 0,
    financialCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 获取理财列表，其中包含收益统计信息
        const response = await request.listFinancial({ pageSize: 100 });
        const financials = response.data || [];

        let totalBalance = 0;
        let totalProfit = 0;
        let yesterdayProfit = 0;

        financials.forEach((financial: any) => {
          totalBalance += Number(financial.balance || 0);
          totalProfit += Number(financial.totalProfit || 0);
          yesterdayProfit += Number(financial.yesterdayProfit || 0);
        });

        setDashboardData({
          totalBalance,
          totalProfit,
          yesterdayProfit,
          financialCount: financials.length,
        });
      } catch (error) {
        console.error('获取收益看板数据失败:', error);
        message.error('获取收益数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title="总资产"
            value={dashboardData.totalBalance}
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
            value={dashboardData.totalProfit}
            precision={2}
            prefix="¥"
            valueStyle={{ color: dashboardData.totalProfit >= 0 ? '#3f8600' : '#cf1322' }}
            suffix={dashboardData.totalProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
            loading={loading}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="昨日收益"
            value={dashboardData.yesterdayProfit}
            precision={2}
            prefix="¥"
            valueStyle={{ color: dashboardData.yesterdayProfit >= 0 ? '#3f8600' : '#cf1322' }}
            suffix={dashboardData.yesterdayProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
            loading={loading}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="持有产品"
            value={dashboardData.financialCount}
            suffix="个"
            loading={loading}
          />
        </Col>
      </Row>
    </Card>
  );
};
