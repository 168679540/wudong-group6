import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Spin, message, Button, Modal, Descriptions, Tag } from 'antd';
import { EnvironmentOutlined, HomeOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getHomestayList, Homestay } from '../api/homestay';
import { createOrder } from '../api/order';

const { Header, Content, Footer } = Layout;

const PublicHomestay: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Homestay | null>(null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    getHomestayList({ pageSize: 50 }).then((r: any) => {
      if (r.success) setData(r.data || []);
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, []);

  const handleBook = async (h: Homestay) => {
    setBooking(true);
    try {
      const res: any = await createOrder({ type: '住宿', amount: h.pricePerNight, merchantId: h.merchantId, itemName: h.name, itemImage: h.coverImage });
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
        <Menu mode="horizontal" defaultSelectedKeys={['homestay']} style={{ border: 'none' }}
          items={[
            { key: 'home', label: '首页', icon: <ArrowLeftOutlined /> },
            { key: 'homestay', label: '住·民宿住宿', icon: <HomeOutlined /> },
          ]}
          onClick={({ key }) => { if (key === 'home') navigate('/pc'); }}
        />
      </Header>

      <Content style={{ padding: '32px 80px', minHeight: '80vh', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>🏠 住·民宿住宿</h2>

          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> : (
            <Row gutter={[20, 20]}>
              {data.map(h => (
                <Col key={h.id} xs={24} sm={12} md={8} lg={8}>
                  <Card
                    hoverable
                    cover={
                      <img alt={h.name} src={h.coverImage || 'https://via.placeholder.com/400x200?text=民宿住宿'} style={{ height: 220, objectFit: 'cover' }} />
                    }
                    actions={[
                      <Button type="link" onClick={() => setDetail(h)}>查看详情</Button>,
                      <Button type="primary" loading={booking} onClick={() => handleBook(h)}>预订房间</Button>,
                    ]}
                  >
                    <Card.Meta
                      title={h.name}
                      description={
                        <div>
                          <div style={{ marginBottom: 4 }}><EnvironmentOutlined /> {h.address}</div>
                          <div style={{ marginBottom: 8 }}>
                            <span style={{ color: '#f5222d', fontSize: 22, fontWeight: 'bold' }}>¥{h.pricePerNight}</span>
                            <span style={{ color: '#999' }}> /晚</span>
                          </div>
                          <div style={{ marginBottom: 4 }}>
                            <Tag color="blue">{h.roomCount}间房</Tag>
                            {h.amenities?.split(',').map((a: string) => (
                              <Tag key={a} color="green">{a.trim()}</Tag>
                            ))}
                          </div>
                          <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6 }}>
                            {h.description?.slice(0, 60)}{(h.description?.length || 0) > 60 ? '...' : ''}
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
                    <HomeOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                    <p style={{ fontSize: 16 }}>暂无民宿房源，敬请期待</p>
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
            预订房间 ¥{detail?.pricePerNight}/晚
          </Button>,
        ]}
        width={680}
        title={detail?.name}
      >
        {detail && (
          <div>
            <img src={detail.coverImage || 'https://via.placeholder.com/600x400?text=民宿住宿'} alt={detail.name}
              style={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="价格"><span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>¥{detail.pricePerNight}</span> /晚</Descriptions.Item>
              <Descriptions.Item label="房间数">{detail.roomCount} 间</Descriptions.Item>
              <Descriptions.Item label="地址" span={2}><EnvironmentOutlined /> {detail.address}</Descriptions.Item>
              <Descriptions.Item label="设施服务" span={2}>
                {detail.amenities?.split(',').map((a: string) => (
                  <Tag key={a} color="green" style={{ marginBottom: 4 }}><CheckCircleOutlined /> {a.trim()}</Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="介绍" span={2}>{detail.description || '暂无介绍'}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px 50px' }}>
        <div>🏯 乌东文旅 · 住·民宿住宿 | © 2026 第6组</div>
      </Footer>
    </Layout>
  );
};

export default PublicHomestay;
