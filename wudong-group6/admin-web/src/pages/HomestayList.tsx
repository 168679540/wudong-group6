import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, message, Button } from 'antd';
import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons';
import { getHomestayList, Homestay } from '../api/homestay';
import { createOrder } from '../api/order';

const HomestayList: React.FC = () => {
  const [data, setData] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomestayList({ pageSize: 50 }).then((r: any) => {
      if (r.success) setData(r.data);
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, []);

  const handleBook = async (h: Homestay) => {
    try {
      const res: any = await createOrder({ type: '住宿', amount: h.pricePerNight, merchantId: h.merchantId });
      if (res.success) message.success(`已预订：${h.name}（${res.data.orderNo}）`);
    } catch { message.error('预订失败'); }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;

  return (
    <div>
      <h2>住宿预订（住）</h2>
      <Row gutter={[16, 16]}>
        {data.map(h => (
          <Col key={h.id} xs={24} sm={12} md={8} lg={8}>
            <Card hoverable cover={<img alt={h.name} src={h.coverImage} style={{ height: 200, objectFit: 'cover' }} />}
              actions={[<Button type="primary" size="small" onClick={() => handleBook(h)}>预订房间</Button>]}>
              <Card.Meta title={h.name}
                description={<>
                  <EnvironmentOutlined /> {h.address}<br />
                  <span style={{ color: '#f5222d', fontSize: 18, fontWeight: 'bold' }}>¥{h.pricePerNight}</span> /晚<br />
                  <HomeOutlined /> {h.roomCount}间房 | {h.amenities}<br />
                  <span style={{ color: '#666' }}>{h.description?.slice(0, 60)}...</span>
                </>} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomestayList;
