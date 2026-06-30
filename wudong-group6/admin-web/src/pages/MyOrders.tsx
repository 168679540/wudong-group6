import React, { useEffect, useState } from 'react';
import { Layout, Menu, Table, Tag, Image, Button, Spin, Empty, message, Popconfirm } from 'antd';
import { ArrowLeftOutlined, OrderedListOutlined, UndoOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getOrderList, returnOrder, refundOrder, Order } from '../api/order';
import CartDrawer from '../components/CartDrawer';

const { Header, Content, Footer } = Layout;

const formatTime = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}:${s}`;
};

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待支付', color: 'orange' },
  1: { text: '已支付', color: 'blue' },
  2: { text: '已发货', color: 'green' },
  3: { text: '已完成', color: 'cyan' },
  4: { text: '已取消/退款', color: 'red' },
};

const typeColors: Record<string, string> = {
  '商品': 'blue', '餐位': 'green', '住宿': 'orange', '门票': 'purple', '路线': 'magenta',
};

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchOrders = (page = 1, pageSize = 10) => {
    setLoading(true);
    getOrderList({ page, pageSize })
      .then((res: any) => {
        if (res.success) { setOrders(res.data || []); setPagination({ current: page, pageSize, total: res.total || 0 }); }
      })
      .catch(() => message.error('加载订单失败'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleReturn = async (id: number) => {
    try {
      const res: any = await returnOrder(id);
      if (res.success) { message.success('退货退款申请成功'); fetchOrders(pagination.current, pagination.pageSize); }
      else message.error(res.message || '退货失败');
    } catch { message.error('操作失败'); }
  };

  const handleCancel = async (id: number) => {
    try {
      const res: any = await refundOrder(id);
      if (res.success) { message.success('订单已取消'); fetchOrders(pagination.current, pagination.pageSize); }
      else message.error(res.message || '取消失败');
    } catch { message.error('操作失败'); }
  };

  const columns = [
    { title: '序号', key: 'index', width: 55, render: (_: any, __: any, i: number) => (pagination.current - 1) * pagination.pageSize + i + 1 },
    { title: '商品图', dataIndex: 'itemImage', width: 80, render: (v: string) => <Image src={v || 'https://via.placeholder.com/60'} width={55} height={55} style={{ borderRadius: 6, objectFit: 'cover' }} fallback="https://via.placeholder.com/60" /> },
    { title: '商品名称', dataIndex: 'itemName', ellipsis: true, render: (v: string) => v || '-' },
    { title: '订单号', dataIndex: 'orderNo', width: 200 },
    { title: '类型', dataIndex: 'type', width: 65, render: (v: string) => <Tag color={typeColors[v] || 'default'}>{v}</Tag> },
    { title: '状态', dataIndex: 'status', width: 90, render: (v: number) => { const s = statusMap[v] || { text: '未知', color: 'default' }; return <Tag color={s.color}>{s.text}</Tag>; } },
    { title: '金额', dataIndex: 'amount', width: 90, render: (v: number) => <span style={{ color: '#f5222d', fontWeight: 'bold', fontSize: 15 }}>¥{v}</span> },
    { title: '物流', key: 'express', width: 160, render: (_: any, r: Order) => r.expressNo ? <span style={{ fontSize: 12 }}>{r.expressCompany}<br />{r.expressNo}</span> : <span style={{ color: '#999' }}>-</span> },
    { title: '下单时间', dataIndex: 'createdAt', width: 160, render: (v: string) => formatTime(v) },
    { title: '操作', key: 'action', width: 80,
      render: (_: any, r: Order) => (
        <>
          {r.status === 1 && <Popconfirm title="确定取消？" onConfirm={() => handleCancel(r.id)}><Button size="small" danger>取消</Button></Popconfirm>}
          {r.status === 2 && r.type === '商品' && <Popconfirm title="确定退货退款？(7天内)" onConfirm={() => handleReturn(r.id)}><Button size="small" icon={<UndoOutlined />}>退货</Button></Popconfirm>}
        </>
      )},
  ];

  return (
    <Layout>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }} onClick={() => navigate('/pc')}>🏯 乌东文旅</div>
        <Menu mode="horizontal" defaultSelectedKeys={['orders']} style={{ border: 'none' }}
          items={[{ key: 'home', label: '首页', icon: <ArrowLeftOutlined /> }, { key: 'orders', label: '我的订单', icon: <OrderedListOutlined /> }]}
          onClick={({ key }) => { if (key === 'home') navigate('/pc'); }} />
        <CartDrawer />
      </Header>
      <Content style={{ padding: '32px 80px', minHeight: '80vh', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>📋 我的订单</h2>
          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> :
            orders.length === 0 ? <Empty description="还没有任何订单，去逛逛吧" /> :
            <Table columns={columns} dataSource={orders} loading={loading} rowKey="id" size="middle"
              pagination={{ ...pagination, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => fetchOrders(p, ps) }} />
          }
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px 50px' }}>
        <div>🏯 乌东文旅 · 我的订单 | © 2026 第6组</div>
      </Footer>
    </Layout>
  );
};

export default MyOrders;
