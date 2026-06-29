import React, { useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Spin, message } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, ShopOutlined, TeamOutlined } from '@ant-design/icons';
import ECharts from '../components/ECharts';
import request from '../api/request';

const EMPTY_TREND = [0, 0, 0, 0, 0, 0, 0];
const X_LABELS = ['6天前', '5天前', '4天前', '3天前', '前天', '昨天', '今天'];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = () => {
    setLoading(true);
    setError(false);
    request.get('/dashboard/stats')
      .then((res: any) => {
        if (res && res.success) {
          setStats(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
        message.error('获取数据概览失败，请检查后端服务');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 使用 useMemo 确保 option 只在数据变化时重新生成
  const orderTrend = stats?.orderTrend?.length ? stats.orderTrend : EMPTY_TREND;
  const userTrend = stats?.userTrend?.length ? stats.userTrend : EMPTY_TREND;
  const pieRaw = stats?.orderTypeDistribution?.length
    ? stats.orderTypeDistribution
    : [{ name: '暂无数据', value: 1 }];

  const orderChartOption = useMemo(() => ({
    tooltip: { trigger: 'axis' as const },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: { type: 'category' as const, data: X_LABELS },
    yAxis: { type: 'value' as const, name: '订单数' },
    series: [{
      data: orderTrend,
      type: 'line' as const,
      smooth: true,
      areaStyle: { color: 'rgba(24,144,255,0.2)' },
      itemStyle: { color: '#1890ff' },
    }],
  }), [orderTrend]);

  const userChartOption = useMemo(() => ({
    tooltip: { trigger: 'axis' as const },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: { type: 'category' as const, data: X_LABELS },
    yAxis: { type: 'value' as const, name: '新增用户' },
    series: [{
      data: userTrend,
      type: 'line' as const,
      smooth: true,
      areaStyle: { color: 'rgba(82,196,26,0.2)' },
      itemStyle: { color: '#52c41a' },
    }],
  }), [userTrend]);

  const pieChartOption = useMemo(() => ({
    tooltip: { trigger: 'item' as const },
    legend: { bottom: 0 },
    series: [{
      type: 'pie' as const,
      radius: ['45%', '70%'],
      center: ['50%', '50%'],
      data: pieRaw,
      label: { show: true, formatter: '{b}\n{d}%' },
    }],
  }), [pieRaw]);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 100 }} />;

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <h3 style={{ color: '#ff4d4f' }}>数据加载失败</h3>
        <p style={{ color: '#999' }}>请检查后端服务是否正常运行</p>
        <a onClick={fetchStats} style={{ cursor: 'pointer', color: '#1890ff' }}>点击重试</a>
      </div>
    );
  }

  const s = stats || {};

  return (
    <div>
      <h2>数据看板</h2>

      {/* 第一行：今日数据 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="今日新增用户" value={s.todayUsers || 0} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日订单数" value={s.todayOrders || 0} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日GMV" value={s.todayGMV || 0} prefix={<DollarOutlined />} suffix="元" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="待审核商家" value={s.pendingMerchants || 0} prefix={<ShopOutlined />}
            valueStyle={{ color: (s.pendingMerchants || 0) > 0 ? '#faad14' : undefined }} />
          </Card>
        </Col>
      </Row>

      {/* 第二行：累计汇总 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="累计用户" value={s.totalUsers || 0} prefix={<TeamOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="累计订单" value={s.totalOrders || 0} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="累计GMV" value={s.totalGMV || 0} prefix={<DollarOutlined />} suffix="元" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="商家总数" value={s.totalMerchants || 0} prefix={<ShopOutlined />} /></Card>
        </Col>
      </Row>

      {/* 第三行：折线图 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="近7日订单趋势">
            <ECharts key={`order-${orderTrend.join(',')}`} option={orderChartOption} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="近7日新增用户">
            <ECharts key={`user-${userTrend.join(',')}`} option={userChartOption} />
          </Card>
        </Col>
      </Row>

      {/* 第四行：饼图 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="订单类型分布">
            <ECharts key="pie" option={pieChartOption} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
