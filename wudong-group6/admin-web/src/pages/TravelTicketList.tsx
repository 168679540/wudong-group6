import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Spin, message, Button } from 'antd';
import { getTicketList, Ticket } from '../api/ticket';
import { createOrder } from '../api/order';

const TravelTicketList: React.FC = () => {
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');

  useEffect(() => {
    setLoading(true);
    getTicketList({ type: type || undefined, pageSize: 50 }).then((r: any) => {
      if (r.success) setData(r.data);
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, [type]);

  const handleBuy = async (t: Ticket) => {
    try {
      const res: any = await createOrder({ type: t.type, amount: t.price, merchantId: t.merchantId });
      if (res.success) message.success(`已购买：${t.name}（${res.data.orderNo}）`);
    } catch { message.error('购买失败'); }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;

  return (
    <div>
      <h2>线路门票（行）</h2>
      <div style={{ marginBottom: 16 }}>
        <Tag color={!type ? '#1890ff' : 'default'} style={{ cursor: 'pointer' }} onClick={() => setType('')}>全部</Tag>
        <Tag color={type === '门票' ? '#1890ff' : 'default'} style={{ cursor: 'pointer' }} onClick={() => setType('门票')}>门票</Tag>
        <Tag color={type === '路线' ? '#1890ff' : 'default'} style={{ cursor: 'pointer' }} onClick={() => setType('路线')}>路线</Tag>
      </div>
      <Row gutter={[16, 16]}>
        {data.map(t => (
          <Col key={t.id} xs={24} sm={12} md={8} lg={6}>
            <Card hoverable cover={<img alt={t.name} src={t.coverImage} style={{ height: 200, objectFit: 'cover' }} />}
              actions={[<Button type="primary" size="small" onClick={() => handleBuy(t)}>{t.type === '门票' ? '购票' : '预订'}</Button>]}>
              <Card.Meta title={t.name} description={<><Tag color={t.type === '门票' ? 'blue' : 'orange'}>{t.type}</Tag><span style={{ color: '#f5222d', fontSize: 18, fontWeight: 'bold' }}>¥{t.price}</span><br /><span style={{ color: '#999' }}>库存: {t.stock}</span></>} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TravelTicketList;
