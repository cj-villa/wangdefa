import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Tabs, Table, message, Spin, Button, Radio } from 'antd';
import { ArrowLeftOutlined, DollarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import request from 'src/request';
import dayjs from 'dayjs';
import { useRoute } from 'src/share/hooks/use-route';

export const FinancialDetailPage = () => {
  const { params } = useRoute();
  const { id } = params;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (id) {
      fetchDetailData();
    }
  }, [id, timeRange]);

  const fetchDetailData = async () => {
    try {
      setLoading(true);
      const response = await request.getFinancialDetail({ id: id as string, range: timeRange });
      setDetailData(response);
    } catch (error) {
      console.error('获取理财详情失败:', error);
      message.error('获取理财详情失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!detailData) {
    return <div>理财详情不存在</div>;
  }

  const { financial, netValueTrends, valueTrends, transactions, statistics } = detailData;

  // 净值图表配置
  const netValueConfig = {
    data: netValueTrends,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    color: ['#1890ff', '#52c41a'],
    point: {
      size: 4,
      shape: 'circle',
    },
    interactions: [{ type: 'marker-active' }],
    slider: {
      start: 0,
      end: 1,
    },
  };

  // 余额图表配置
  const balanceConfig = {
    data: valueTrends,
    xField: 'date',
    yField: 'balance',
    color: '#faad14',
    point: {
      size: 4,
      shape: 'circle',
    },
    interactions: [{ type: 'marker-active' }],
    slider: {
      start: 0,
      end: 1,
    },
  };

  // 交易记录表格列
  const transactionColumns = [
    {
      title: '交易日期',
      dataIndex: 'ensureDate',
      key: 'ensureDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '交易类型',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (type: string) => (type === 'BUY' ? '购买' : '卖出'),
    },
    {
      title: '交易金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount?.toFixed(2)}`,
    },
    {
      title: '交易份额',
      dataIndex: 'shares',
      key: 'shares',
      render: (shares: number) => (shares ? shares.toFixed(2) : '-'),
    },
  ];

  const tabItems = [
    {
      key: 'charts',
      label: '图表分析',
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Card title="净值趋势" style={{ marginBottom: 16 }}>
              <Line {...netValueConfig} height={300} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="余额趋势" style={{ marginBottom: 16 }}>
              <Line {...balanceConfig} height={300} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'transactions',
      label: '交易记录',
      children: (
        <Card>
          <Table
            columns={transactionColumns}
            dataSource={transactions}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div>
      {/* 头部信息 */}
      <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            返回
          </Button>
          <div>
            <Radio.Group
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              optionType="button"
            >
              <Radio value="day">日</Radio>
              <Radio value="week">周</Radio>
              <Radio value="month">月</Radio>
              <Radio value="year">年</Radio>
            </Radio.Group>
          </div>
        </div>

        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="基金名称" value={financial.name} prefix={<DollarOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic
              title="当前余额"
              value={statistics.currentBalance}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="累计收益"
              value={statistics.totalProfit}
              precision={2}
              prefix="¥"
              valueStyle={{ color: statistics.totalProfit >= 0 ? '#3f8600' : '#cf1322' }}
              suffix={statistics.totalProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="昨日收益"
              value={statistics.yesterdayProfit}
              precision={2}
              prefix="¥"
              valueStyle={{ color: statistics.yesterdayProfit >= 0 ? '#3f8600' : '#cf1322' }}
              suffix={statistics.yesterdayProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
            />
          </Col>
        </Row>
      </Card>

      {/* 主要内容区域 */}
      <Tabs items={tabItems} defaultActiveKey="charts" />
    </div>
  );
};
