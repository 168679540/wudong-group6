import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, Image, message } from 'antd';
import { getOrderList, Order } from '../api/order';

const { Option } = Select;

// 格式化时间，解决 "000Z" 问题
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
  2: { text: '已确认', color: 'green' },
  3: { text: '已完成', color: 'cyan' },
  4: { text: '已取消', color: 'red' },
};

const typeColors: Record<string, string> = {
  '商品': 'blue',
  '餐位': 'green',
  '住宿': 'orange',
  '门票': 'purple',
  '路线': 'magenta',
};

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchOrders = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res: any = await getOrderList({
        page,
        pageSize,
        type: filterType || undefined,
        status: filterStatus,
      });
      if (res.success) {
        setOrders(res.data || []);
        setPagination({ current: page, pageSize, total: res.total || 0 });
      }
    } catch (err) {
      message.error('获取订单列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(1, pagination.pageSize);
  }, [filterType, filterStatus]);

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '商品图',
      dataIndex: 'itemImage',
      key: 'itemImage',
      width: 80,
      render: (img: string) => (
        <Image
          src={img || 'https://via.placeholder.com/60x60?text=无图'}
          alt="商品图"
          width={60}
          height={60}
          style={{ borderRadius: 6, objectFit: 'cover' }}
          fallback="https://via.placeholder.com/60x60?text=无图"
        />
      ),
    },
    {
      title: '商品名称',
      dataIndex: 'itemName',
      key: 'itemName',
      ellipsis: true,
      render: (name: string) => name || '-',
    },
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 200 },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={typeColors[type] || 'default'}>{type}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => {
        const s = statusMap[status] || { text: '未知', color: 'default' };
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (v: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold', fontSize: 15 }}>¥{v}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (v: string) => formatTime(v),
    },
  ];

  return (
    <div>
      <h2>全局订单</h2>

      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="订单类型"
          allowClear
          style={{ width: 120, marginRight: 8 }}
          value={filterType || undefined}
          onChange={(v) => setFilterType(v || '')}
        >
          <Option value="商品">商品</Option>
          <Option value="餐位">餐位</Option>
          <Option value="住宿">住宿</Option>
          <Option value="门票">门票</Option>
          <Option value="路线">路线</Option>
        </Select>
        <Select
          placeholder="订单状态"
          allowClear
          style={{ width: 120 }}
          value={filterStatus}
          onChange={(v) => setFilterStatus(v)}
        >
          <Option value={0}>待支付</Option>
          <Option value={1}>已支付</Option>
          <Option value={2}>已确认</Option>
          <Option value={3}>已完成</Option>
          <Option value={4}>已取消</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="id"
        size="middle"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => fetchOrders(page, pageSize),
        }}
      />
    </div>
  );
};

export default OrderList;
