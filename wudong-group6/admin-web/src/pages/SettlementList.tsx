import React, { useEffect, useState } from 'react';
import { Table, Tag, message, Row, Col, Card, Statistic } from 'antd';
import { DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { getSettlementList, getSettlementStats, SettlementSummary } from '../api/settlement';

const typeLabels: Record<string, string> = {
  '商品': '衣-非遗商品',
  '餐位': '食-餐饮美食',
  '住宿': '住-住宿预订',
  '门票': '行-门票',
  '路线': '行-路线',
};

const SettlementList: React.FC = () => {
  const [data, setData] = useState<SettlementSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [summary, setSummary] = useState({
    totalAmount: 0, totalSettlementAmount: 0, totalServiceFee: 0,
    totalOrders: 0, pendingCount: 0, settledCount: 0, moduleCount: 0,
  });

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res: any = await getSettlementList({ page, pageSize });
      if (res.success) {
        setData(res.data);
        setPagination({ ...pagination, current: page, total: res.total });
      }
    } catch {
      message.error('获取结算数据失败');
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res: any = await getSettlementStats();
      if (res.success) {
        setSummary(res.data.summary);
      }
    } catch {}
  };

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const columns = [
    { title: '业务类型', dataIndex: 'type', key: 'type', width: 120,
      render: (t: string) => typeLabels[t] || t,
    },
    { title: '总订单', dataIndex: 'totalOrders', key: 'totalOrders', width: 80 },
    { title: '已付', dataIndex: 'paidCount', key: 'paidCount', width: 60, render: (v: number) => <Tag color="green">{v}</Tag> },
    { title: '未付', dataIndex: 'unpaidCount', key: 'unpaidCount', width: 60, render: (v: number) => <Tag color="orange">{v}</Tag> },
    { title: '总金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 110, render: (v: number) => <b>¥{v.toLocaleString()}</b> },
    { title: '服务费(5%)', dataIndex: 'serviceFee', key: 'serviceFee', width: 110, render: (v: number) => `¥${v.toLocaleString()}` },
    { title: '结算金额', dataIndex: 'settlementAmount', key: 'settlementAmount', width: 120, render: (v: number) => <b style={{ color: '#52c41a' }}>¥{v.toLocaleString()}</b> },
  ];

  return (
    <div>
      <h2>财务结算（按业务类型汇总）</h2>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card><Statistic title="订单总数" value={summary.totalOrders} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
        <Col span={4}>
          <Card><Statistic title="总金额" value={summary.totalAmount} prefix="¥" precision={2} /></Card>
        </Col>
        <Col span={4}>
          <Card><Statistic title="结算金额" value={summary.totalSettlementAmount} prefix="¥" precision={2} /></Card>
        </Col>
        <Col span={4}>
          <Card><Statistic title="服务费收入" value={summary.totalServiceFee} prefix="¥" precision={2} /></Card>
        </Col>
        <Col span={4}>
          <Card><Statistic title="待处理" value={summary.pendingCount} prefix={<DollarOutlined />} valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
        <Col span={4}>
          <Card><Statistic title="已处理" value={summary.settledCount} prefix={<DollarOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} loading={loading} rowKey="type"
        pagination={{ ...pagination, onChange: (page, pageSize) => fetchData(page, pageSize) }} />
    </div>
  );
};

export default SettlementList;
