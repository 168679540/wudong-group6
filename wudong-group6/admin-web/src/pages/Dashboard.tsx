import React, { useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Spin, message, Table, Tag } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, ShopOutlined, TeamOutlined, RiseOutlined, FallOutlined, FileTextOutlined, CommentOutlined } from '@ant-design/icons';
import ECharts from '../components/ECharts';
import request from '../api/request';

const EMPTY_TREND = [0, 0, 0, 0, 0, 0, 0];
const X_LABELS = ['6天前', '5天前', '4天前', '3天前', '前天', '昨天', '今天'];
const MODULE_NAMES: Record<string, string> = { '商品': '衣', '餐位': '食', '住宿': '住', '门票': '行', '路线': '行' };
const MODULE_COLORS: Record<string, string> = {
  '商品': '#1890ff', '餐位': '#52c41a', '住宿': '#faad14', '门票': '#f5222d', '路线': '#722ed1',
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [communityStats, setCommunityStats] = useState<any>({ totalNotes: 0, totalViews: 0, totalLikes: 0, totalComments: 0 });

  const fetchStats = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      request.get('/dashboard/stats'),
      request.get('/community/stats'),
    ]).then(([res1, res2]: any[]) => {
      if (res1?.success) setStats(res1.data);
      if (res2?.success) setCommunityStats(res2.data);
    }).catch(() => {
      setError(true);
      message.error('获取数据概览失败');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStats(); }, []);

  const orderTrend = stats?.orderTrend || EMPTY_TREND;
  const userTrend = stats?.userTrend || EMPTY_TREND;
  const gmvTrend = stats?.gmvTrend || EMPTY_TREND;
  const orderPie = stats?.orderTypeDistribution?.length ? stats.orderTypeDistribution : [{ name: '暂无数据', value: 1 }];
  const gmvPie = stats?.gmvTypeDistribution?.length ? stats.gmvTypeDistribution : [{ name: '暂无数据', value: 1 }];

  // 订单趋势图
  const orderChartOption = useMemo(() => ({
    tooltip: { trigger: 'axis' as const },
    grid: { left: 55, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category' as const, data: X_LABELS },
    yAxis: { type: 'value' as const, name: '单' },
    series: [{ data: orderTrend, type: 'line' as const, smooth: true, areaStyle: { color: 'rgba(24,144,255,0.15)' }, itemStyle: { color: '#1890ff' } }],
  }), [orderTrend]);

  // GMV趋势图
  const gmvChartOption = useMemo(() => ({
    tooltip: { trigger: 'axis' as const },
    grid: { left: 55, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category' as const, data: X_LABELS },
    yAxis: { type: 'value' as const, name: '元' },
    series: [{ data: gmvTrend, type: 'bar' as const, barWidth: '50%', label: { show: true, position: 'top', formatter: '{c}', fontSize: 10 }, itemStyle: { color: '#faad14', borderRadius: [4, 4, 0, 0] } }],
  }), [gmvTrend]);

  // 用户趋势图
  const userChartOption = useMemo(() => ({
    tooltip: { trigger: 'axis' as const },
    grid: { left: 55, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category' as const, data: X_LABELS },
    yAxis: { type: 'value' as const, name: '人' },
    series: [{ data: userTrend, type: 'line' as const, smooth: true, areaStyle: { color: 'rgba(82,196,26,0.15)' }, itemStyle: { color: '#52c41a' } }],
  }), [userTrend]);

  // 订单类型饼图
  const orderPieOption = useMemo(() => ({
    tooltip: { trigger: 'item' as const, formatter: '{b}: {c} 单 ({d}%)' },
    legend: { bottom: 0 },
    series: [{ type: 'pie' as const, radius: ['45%', '70%'], center: ['50%', '50%'], data: orderPie, label: { show: true, formatter: '{b}\n{d}%' } }],
  }), [orderPie]);

  // GMV类型饼图
  const gmvPieOption = useMemo(() => ({
    tooltip: { trigger: 'item' as const, formatter: '{b}: ¥{c} ({d}%)' },
    legend: { bottom: 0 },
    series: [{ type: 'pie' as const, radius: ['45%', '70%'], center: ['50%', '50%'], data: gmvPie, label: { show: true, formatter: '{b}\n{d}%' } }],
  }), [gmvPie]);

  // GMV按模块聚合
  const moduleGMV = useMemo(() => {
    if (!stats?.gmvTypeDistribution) return [];
    const map: Record<string, number> = {};
    stats.gmvTypeDistribution.forEach((r: any) => {
      const mod = MODULE_NAMES[r.name] || r.name;
      map[mod] = (map[mod] || 0) + Number(r.value);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));
  }, [stats]);

  const moduleGMVOption = useMemo(() => ({
    tooltip: { trigger: 'axis' as const, formatter: (p: any) => `${p[0].name}: ¥${p[0].value}` },
    grid: { left: 55, right: 20, top: 10, bottom: 30 },
    xAxis: { type: 'category' as const, data: moduleGMV.map(m => m.name) },
    yAxis: { type: 'value' as const, name: '元' },
    series: [{ type: 'bar' as const, data: moduleGMV.map(m => m.value), barWidth: '50%', label: { show: true, position: 'top', formatter: '¥{c}', fontSize: 10 }, itemStyle: { borderRadius: [4, 4, 0, 0], color: (p: any) => MODULE_COLORS[moduleGMV[p.dataIndex]?.name] || '#999' } }],
  }), [moduleGMV]);

  // 订单量按模块聚合
  const moduleOrders = useMemo(() => {
    if (!stats?.orderTypeDistribution) return [];
    const map: Record<string, number> = {};
    stats.orderTypeDistribution.forEach((r: any) => {
      const mod = MODULE_NAMES[r.name] || r.name;
      map[mod] = (map[mod] || 0) + Number(r.value);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [stats]);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 100 }} />;
  if (error) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h3 style={{ color: '#ff4d4f' }}>数据加载失败</h3>
      <a onClick={fetchStats} style={{ cursor: 'pointer', color: '#1890ff' }}>点击重试</a>
    </div>
  );

  const s = stats || {};

  return (
    <div>
      <h2>数据看板</h2>

      {/* 第一行：今日核心指标 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="今日订单数" value={s.todayOrders || 0} prefix={<ShoppingCartOutlined />} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日GMV" value={s.todayGMV || 0} prefix={<DollarOutlined />} suffix="元" precision={2} valueStyle={{ color: '#f5222d' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日新增用户" value={s.todayUsers || 0} prefix={<UserOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="待审核商家" value={s.pendingMerchants || 0} prefix={<ShopOutlined />} valueStyle={{ color: (s.pendingMerchants || 0) > 0 ? '#faad14' : '#52c41a' }} /></Card>
        </Col>
      </Row>

      {/* 第二行：累计汇总 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card><Statistic title="累计用户" value={s.totalUsers || 0} prefix={<TeamOutlined />} /></Card>
        </Col>
        <Col span={4}>
          <Card><Statistic title="累计订单" value={s.totalOrders || 0} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
        <Col span={4}>
          <Card><Statistic title="累计GMV" value={s.totalGMV || 0} precision={2} prefix={<DollarOutlined />} suffix="元" /></Card>
        </Col>
        <Col span={4}>
          <Card><Statistic title="商家总数" value={s.totalMerchants || 0} prefix={<ShopOutlined />} /></Card>
        </Col>
        <Col span={4}>
          <Card><Statistic title="游记数" value={communityStats.totalNotes || 0} prefix={<FileTextOutlined />} /></Card>
        </Col>
        <Col span={4}>
          <Card><Statistic title="评论数" value={communityStats.totalComments || 0} prefix={<CommentOutlined />} /></Card>
        </Col>
      </Row>

      {/* 第三行：按模块聚合 + 趋势 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card title="模块订单量" size="small">
            {moduleOrders.map(m => (
              <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
                <span><Tag color={MODULE_COLORS[m.name] || 'default'}>{m.name}</Tag></span>
                <span style={{ fontWeight: 'bold' }}>{m.value} 单</span>
              </div>
            ))}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="模块GMV" size="small">
            {moduleGMV.map(m => (
              <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
                <span><Tag color={MODULE_COLORS[m.name] || 'default'}>{m.name}</Tag></span>
                <span style={{ fontWeight: 'bold', color: '#f5222d' }}>¥{m.value.toFixed(2)}</span>
              </div>
            ))}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="内容数据" size="small">
            <Statistic title="总浏览" value={communityStats.totalViews || 0} prefix={<RiseOutlined />} valueStyle={{ fontSize: 20 }} />
            <Statistic title="总点赞" value={communityStats.totalLikes || 0} prefix={<RiseOutlined />} style={{ marginTop: 8 }} valueStyle={{ fontSize: 20, color: '#f5222d' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card title="今日概览" size="small">
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
              今日订单 <b>{s.todayOrders || 0}</b> 笔，成交 <b style={{ color: '#f5222d' }}>¥{(s.todayGMV || 0).toFixed(2)}</b>
            </div>
            <div style={{ fontSize: 13, color: '#666' }}>
              客单价 ≈ <b style={{ color: '#1890ff' }}>¥{s.todayOrders > 0 ? (s.todayGMV / s.todayOrders).toFixed(2) : '0.00'}</b>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 第四行：折线图+柱状图 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="近7日订单趋势">
            <ECharts key={`order-${orderTrend.join(',')}`} option={orderChartOption} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="近7日GMV趋势 (元)">
            <ECharts key={`gmv-${gmvTrend.join(',')}`} option={gmvChartOption} />
          </Card>
        </Col>
      </Row>

      {/* 第五行：用户趋势 + 模块GMV柱状图 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="近7日新增用户">
            <ECharts key={`user-${userTrend.join(',')}`} option={userChartOption} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="模块GMV分布">
            <ECharts key="module-gmv" option={moduleGMVOption} />
          </Card>
        </Col>
      </Row>

      {/* 第六行：饼图 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="订单类型分布 (数量)">
            <ECharts key="pie-order" option={orderPieOption} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="订单类型分布 (金额)">
            <ECharts key="pie-gmv" option={gmvPieOption} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
