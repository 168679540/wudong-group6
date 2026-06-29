import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Rate, Spin, message, Button } from 'antd';
import { EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import { getRestaurantList, Restaurant } from '../api/restaurant';
import { createOrder } from '../api/order';

const FoodList: React.FC = () => {
  const [data, setData] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestaurantList({ pageSize: 50 }).then((r: any) => {
      if (r.success) setData(r.data);
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, []);

  const handleBook = async (r: Restaurant) => {
    try {
      const res: any = await createOrder({ type: '餐位', amount: r.avgPrice, merchantId: r.id + 1, itemName: r.name, itemImage: r.coverImage });
      if (res.success) message.success(`已预订：${r.name}（${res.data.orderNo}）`);
    } catch { message.error('预订失败'); }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;

  return (
    <div>
      <h2>餐饮美食（食）</h2>
      <Row gutter={[16, 16]}>
        {data.map(r => (
          <Col key={r.id} xs={24} sm={12} md={8} lg={8}>
            <Card hoverable cover={<img alt={r.name} src={r.coverImage} style={{ height: 200, objectFit: 'cover' }} />}
              actions={[<Button type="primary" size="small" onClick={() => handleBook(r)}>预订餐位</Button>]}>
              <Card.Meta title={<>{r.name} <Rate disabled value={r.rating} style={{ fontSize: 14 }} /></>}
                description={<><EnvironmentOutlined /> {r.address}<br /><DollarOutlined /> 人均 ¥{r.avgPrice}<br /><span style={{ color: '#666' }}>{r.description?.slice(0, 60)}...</span></>} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FoodList;
