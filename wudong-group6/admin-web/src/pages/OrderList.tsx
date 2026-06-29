import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, Image, message, Button, Space, Modal, Input, Form } from 'antd';
import { TruckOutlined } from '@ant-design/icons';
import { getOrderList, shipOrder, Order } from '../api/order';

const { Option } = Select;

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
  4: { text: '已取消', color: 'red' },
};

const typeColors: Record<string, string> = {
  '商品': 'blue', '餐位': 'green', '住宿': 'orange', '门票': 'purple', '路线': 'magenta',
};

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [shipModal, setShipModal] = useState<{ open: boolean; id: number }>({ open: false, id: 0 });
  const [shipForm] = Form.useForm();

  const fetchOrders = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res: any = await getOrderList({ page, pageSize, type: filterType || undefined, status: filterStatus });
      if (res.success) { setOrders(res.data || []); setPagination({ current: page, pageSize, total: res.total || 0 }); }
    } catch { message.error('获取订单列表失败'); }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(1, pagination.pageSize); }, [filterType, filterStatus]);

  const handleShip = async () => {
    const vals = await shipForm.validateFields();
    await shipOrder(shipModal.id, vals.expressCompany, vals.expressNo);
    message.success('发货成功'); setShipModal({ open: false, id: 0 }); fetchOrders(pagination.current, pagination.pageSize);
  };

  const columns = [
    { title: '序号', key: 'index', width: 55, render: (_: any, __: any, i: number) => (pagination.current - 1) * pagination.pageSize + i + 1 },
    { title: '商品图', dataIndex: 'itemImage', key: 'itemImage', width: 70,
      render: (v: string) => <Image src={v || 'https://via.placeholder.com/50'} width={50} height={50} style={{ borderRadius: 6, objectFit: 'cover' }} fallback="https://via.placeholder.com/50" /> },
    { title: '商品名称', dataIndex: 'itemName', key: 'itemName', ellipsis: true, render: (v: string) => v || '-' },
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 195 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 65, render: (v: string) => <Tag color={typeColors[v] || 'default'}>{v}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 70, render: (v: number) => { const s = statusMap[v] || { text: '未知', color: 'default' }; return <Tag color={s.color}>{s.text}</Tag>; } },
    { title: '金额', dataIndex: 'amount', key: 'amount', width: 85, render: (v: number) => <span style={{ color: '#f5222d', fontWeight: 'bold' }}>¥{v}</span> },
    { title: '物流', key: 'express', width: 160, render: (_: any, r: Order) =>
      r.expressNo ? <span style={{ fontSize: 12 }}>{r.expressCompany}<br/>{r.expressNo}</span> :
        (r.type === '商品' && r.status === 1) ? <Button size="small" icon={<TruckOutlined />} onClick={() => { shipForm.resetFields(); setShipModal({ open: true, id: r.id }); }}>发货</Button> :
        <span style={{ color: '#999' }}>-</span>
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 155, render: (v: string) => formatTime(v) },
  ];

  return (
    <div>
      <h2>全局订单</h2>
      <Space style={{ marginBottom: 16 }}>
        <Select placeholder="订单类型" allowClear style={{ width: 110 }} value={filterType || undefined} onChange={v => setFilterType(v || '')}>
          <Option value="商品">商品</Option><Option value="餐位">餐位</Option><Option value="住宿">住宿</Option><Option value="门票">门票</Option><Option value="路线">路线</Option>
        </Select>
        <Select placeholder="订单状态" allowClear style={{ width: 110 }} value={filterStatus} onChange={v => setFilterStatus(v)}>
          <Option value={0}>待支付</Option><Option value={1}>已支付</Option><Option value={2}>已发货</Option><Option value={3}>已完成</Option><Option value={4}>已取消</Option>
        </Select>
      </Space>
      <Table columns={columns} dataSource={orders} loading={loading} rowKey="id" size="middle"
        pagination={{ ...pagination, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => fetchOrders(p, ps) }} />
      <Modal title="发货" open={shipModal.open} onCancel={() => setShipModal({ open: false, id: 0 })} onOk={handleShip}>
        <Form form={shipForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="expressCompany" label="快递公司" rules={[{ required: true }]}><Input placeholder="如：顺丰速运" /></Form.Item>
          <Form.Item name="expressNo" label="快递单号" rules={[{ required: true }]}><Input placeholder="SF1234567890" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderList;
