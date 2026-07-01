import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Tag } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, ClockCircleOutlined, OrderedListOutlined, ShopOutlined } from '@ant-design/icons';
import request from '../api/request';

const MerchantDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({ todayOrders: 0, todayGMV: 0, totalOrders: 0, pendingCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.get('/merchant-dashboard/stats', { params: { merchantId: 1 } }).then((r: any) => {
      if (r.success) setStats(r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;

  return (
    <div>
      <h2>🏪 商家工作台</h2>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="今日订单" value={stats.todayOrders} prefix={<ShoppingCartOutlined />} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日营业额" value={stats.todayGMV} prefix={<DollarOutlined />} suffix="元" precision={2} valueStyle={{ color: '#f5222d' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="累计订单" value={stats.totalOrders} prefix={<OrderedListOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待处理订单" value={stats.pendingCount} prefix={<ClockCircleOutlined />}
              valueStyle={{ color: stats.pendingCount > 0 ? '#faad14' : '#52c41a' }} />
            {stats.pendingCount > 0 && <Tag color="orange" style={{ marginTop: 8 }}>有 {stats.pendingCount} 笔待确认</Tag>}
          </Card>
        </Col>
      </Row>

      <Card title={<><ShopOutlined /> 快速入口</>}>
        <Row gutter={16}>
          {[{label:'衣·商品管理',url:'/products'},{label:'食·餐厅管理',url:'/food'},{label:'住·民宿管理',url:'/homestay'},{label:'行·票务管理',url:'/tickets'}].map(item => (
            <Col span={6} key={item.url}><Card size="small" hoverable onClick={() => window.location.href = item.url} style={{textAlign:'center',cursor:'pointer'}}>{item.label}</Card></Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};
export default MerchantDashboard;
