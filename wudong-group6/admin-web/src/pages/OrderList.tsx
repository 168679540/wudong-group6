import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, message } from 'antd';
import { getOrderList, Order } from '../api/order';

const { Option } = Select;

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrderList({
        type: filterType || undefined,
        status: filterStatus,
      });
      setOrders(res.data || []);
    } catch (err) {
      message.error('获取订单列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filterType, filterStatus]);

  const getStatusText = (status: number) => {
    const map: Record<number, string> = {
      0: '待支付',
      1: '已支付',
      2: '已确认',
      3: '已完成',
      4: '已取消',
    };
    return map[status] || '未知';
  };

  const getStatusColor = (status: number) => {
    const map: Record<number, string> = {
      0: 'orange',
      1: 'blue',
      2: 'green',
      3: 'success',
      4: 'red',
    };
    return map[status] || 'default';
  };

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
    },
    { title: '金额', dataIndex: 'amount', key: 'amount', render: (v: number) => `¥${v}` },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="订单类型"
          allowClear
          style={{ width: 120, marginRight: 8 }}
          onChange={setFilterType}
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
          onChange={(v) => setFilterStatus(v)}
        >
          <Option value={0}>待支付</Option>
          <Option value={1}>已支付</Option>
          <Option value={2}>已确认</Option>
          <Option value={3}>已完成</Option>
          <Option value={4}>已取消</Option>
        </Select>
      </div>
      <Table columns={columns} dataSource={orders} loading={loading} rowKey="id" />
    </div>
  );
};

export default OrderList;