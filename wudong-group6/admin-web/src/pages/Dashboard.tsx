import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, ShopOutlined, TeamOutlined } from '@ant-design/icons';
import ECharts from '../components/ECharts';
import request from '../api/request';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({
    todayUsers: 0, todayOrders: 0, todayGMV: 0, pendingMerchants: 0,
    totalUsers: 0, totalOrders: 0, totalGMV: 0, totalMerchants: 0,
    orderTrend: [], userTrend: [], orderTypeDistribution: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.get('/dashboard/stats').then((res: any) => {
      if (res.success) setStats(res.data);
    }).finally(() => setLoading(false));
  }, []);

  const orderChartOption: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: {
      type: 'category',
      data: ['6天前', '5天前', '4天前', '3天前', '前天', '昨天', '今天'],
    },
    yAxis: { type: 'value', name: '订单数' },
    series: [{
      data: stats.orderTrend?.length ? stats.orderTrend : [0, 0, 0, 0, 0, 0, 0],
      type: 'line',
      smooth: true,
      areaStyle: { color: 'rgba(24,144,255,0.2)' },
      itemStyle: { color: '#1890ff' },
    }],
  };

  const userChartOption: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: {
      type: 'category',
      data: ['6天前', '5天前', '4天前', '3天前', '前天', '昨天', '今天'],
    },
    yAxis: { type: 'value', name: '新增用户' },
    series: [{
      data: stats.userTrend?.length ? stats.userTrend : [0, 0, 0, 0, 0, 0, 0],
      type: 'line',
      smooth: true,
      areaStyle: { color: 'rgba(82,196,26,0.2)' },
      itemStyle: { color: '#52c41a' },
    }],
  };

  const pieData = stats.orderTypeDistribution?.length
    ? stats.orderTypeDistribution
    : [{ name: '暂无数据', value: 1 }];

  const pieChartOption: echarts.EChartsOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '50%'],
      data: pieData,
      label: { show: true, formatter: '{b}\n{d}%' },
    }],
  };

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 100 }} />;

  return (
    <div>
      <h2>数据看板</h2>

      {/* 第一行：今日数据 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="今日新增用户" value={stats.todayUsers} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日订单数" value={stats.todayOrders} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日GMV" value={stats.todayGMV} prefix={<DollarOutlined />} suffix="元" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="待审核商家" value={stats.pendingMerchants} prefix={<ShopOutlined />} valueStyle={{ color: stats.pendingMerchants > 0 ? '#faad14' : undefined }} /></Card>
        </Col>
      </Row>

      {/* 第二行：累计汇总 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="累计用户" value={stats.totalUsers} prefix={<TeamOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="累计订单" value={stats.totalOrders} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="累计GMV" value={stats.totalGMV} prefix={<DollarOutlined />} suffix="元" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="商家总数" value={stats.totalMerchants} prefix={<ShopOutlined />} /></Card>
        </Col>
      </Row>

      {/* 第三行：折线图 + 柱状图 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="近7日订单趋势">
            <ECharts option={orderChartOption} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="近7日新增用户">
            <ECharts option={userChartOption} />
          </Card>
        </Col>
      </Row>

      {/* 第四行：饼图 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="订单类型分布">
            <ECharts option={pieChartOption} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
