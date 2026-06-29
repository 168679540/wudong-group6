import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Spin, message, Button, Modal, Descriptions, Rate, Tag } from 'antd';
import { EnvironmentOutlined, DollarOutlined, PhoneOutlined, ArrowLeftOutlined, CoffeeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getRestaurantList, Restaurant } from '../api/restaurant';
import { createOrder } from '../api/order';

const { Header, Content, Footer } = Layout;

const PublicFood: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Restaurant | null>(null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    getRestaurantList({ pageSize: 50 }).then((r: any) => {
      if (r.success) setData(r.data || []);
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, []);

  const handleBook = async (r: Restaurant) => {
    setBooking(true);
    try {
      const res: any = await createOrder({ type: '餐位', amount: r.avgPrice, merchantId: r.merchantId || r.id, itemName: r.name, itemImage: r.coverImage });
      if (res.success) message.success(`预订成功！订单号：${res.data.orderNo}`);
      else message.error(res.message || '预订失败');
    } catch { message.error('预订失败，请稍后重试'); }
    finally { setBooking(false); }
  };

  return (
    <Layout>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }} onClick={() => navigate('/pc')}>
          🏯 乌东文旅
        </div>
        <Menu mode="horizontal" defaultSelectedKeys={['food']} style={{ border: 'none' }}
          items={[
            { key: 'home', label: '首页', icon: <ArrowLeftOutlined /> },
            { key: 'food', label: '食·餐饮美食', icon: <CoffeeOutlined /> },
          ]}
          onClick={({ key }) => { if (key === 'home') navigate('/pc'); }}
        />
      </Header>

      <Content style={{ padding: '32px 80px', minHeight: '80vh', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>🍽️ 食·餐饮美食</h2>

          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> : (
            <Row gutter={[20, 20]}>
              {data.map(r => (
                <Col key={r.id} xs={24} sm={12} md={8} lg={8}>
                  <Card
                    hoverable
                    cover={
                      <img alt={r.name} src={r.coverImage || 'https://via.placeholder.com/400x200?text=餐饮美食'} style={{ height: 220, objectFit: 'cover' }} />
                    }
                    actions={[
                      <Button type="link" onClick={() => setDetail(r)}>查看详情</Button>,
                      <Button type="primary" loading={booking} onClick={() => handleBook(r)}>预订餐位</Button>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{r.name}</span>
                          <Rate disabled value={r.rating} style={{ fontSize: 14 }} />
                        </div>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: 4 }}><EnvironmentOutlined /> {r.address}</div>
                          <div style={{ marginBottom: 8 }}>
                            <span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>¥{r.avgPrice}</span>
                            <span style={{ color: '#999' }}> /人</span>
                          </div>
                          <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6 }}>
                            {r.description?.slice(0, 80)}{(r.description?.length || 0) > 80 ? '...' : ''}
                          </p>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
              {data.length === 0 && (
                <Col span={24}>
                  <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
                    <CoffeeOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                    <p style={{ fontSize: 16 }}>暂无餐饮商家，敬请期待</p>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </div>
      </Content>

      {/* 详情弹窗 */}
      <Modal
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={[
          <Button key="back" onClick={() => setDetail(null)}>返回</Button>,
          <Button key="book" type="primary" loading={booking}
            onClick={() => detail && handleBook(detail)}>
            预订餐位 ¥{detail?.avgPrice}/人
          </Button>,
        ]}
        width={640}
        title={detail?.name}
      >
        {detail && (
          <div>
            <img src={detail.coverImage || 'https://via.placeholder.com/600x400?text=餐饮美食'} alt={detail.name}
              style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="评分"><Rate disabled value={detail.rating} /></Descriptions.Item>
              <Descriptions.Item label="人均消费"><span style={{ color: '#f5222d', fontSize: 18, fontWeight: 'bold' }}>¥{detail.avgPrice}</span> /人</Descriptions.Item>
              <Descriptions.Item label="地址"><EnvironmentOutlined /> {detail.address}</Descriptions.Item>
              <Descriptions.Item label="介绍">{detail.description || '暂无介绍'}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px 50px' }}>
        <div>🏯 乌东文旅 · 食·餐饮美食 | © 2026 第6组</div>
      </Footer>
    </Layout>
  );
};

export default PublicFood;
