import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Tag, Spin, message, Button, Modal, Descriptions } from 'antd';
import { CompassOutlined, EnvironmentOutlined, ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getTicketList, Ticket } from '../api/ticket';
import { createOrder } from '../api/order';

const { Header, Content, Footer } = Layout;

const PublicTickets: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [detail, setDetail] = useState<Ticket | null>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTicketList({ type: type || undefined, pageSize: 50 }).then((r: any) => {
      if (r.success) setData(r.data || []);
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, [type]);

  const handleBuy = async (t: Ticket) => {
    setBuying(true);
    try {
      const res: any = await createOrder({ type: t.type, amount: t.price, merchantId: t.merchantId, itemName: t.name, itemImage: t.coverImage });
      if (res.success) message.success(`购买成功！订单号：${res.data.orderNo}`);
      else message.error(res.message || '下单失败');
    } catch { message.error('下单失败，请稍后重试'); }
    finally { setBuying(false); }
  };

  return (
    <Layout>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }} onClick={() => navigate('/pc')}>
          🏯 乌东文旅
        </div>
        <Menu mode="horizontal" defaultSelectedKeys={['tickets']} style={{ border: 'none' }}
          items={[
            { key: 'home', label: '首页', icon: <ArrowLeftOutlined /> },
            { key: 'tickets', label: '行·线路门票', icon: <CompassOutlined /> },
          ]}
          onClick={({ key }) => { if (key === 'home') navigate('/pc'); }}
        />
      </Header>

      <Content style={{ padding: '32px 80px', minHeight: '80vh', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>🎫 行·线路门票</h2>

          <div style={{ marginBottom: 24 }}>
            <Tag color={!type ? '#1890ff' : 'default'} style={{ cursor: 'pointer', padding: '4px 16px', fontSize: 14 }}
              onClick={() => setType('')}>全部</Tag>
            <Tag color={type === '门票' ? '#1890ff' : 'default'} style={{ cursor: 'pointer', padding: '4px 16px', fontSize: 14 }}
              onClick={() => setType('门票')}>🎫 景区门票</Tag>
            <Tag color={type === '路线' ? '#1890ff' : 'default'} style={{ cursor: 'pointer', padding: '4px 16px', fontSize: 14 }}
              onClick={() => setType('路线')}>🗺️ 旅游路线</Tag>
          </div>

          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> : (
            <Row gutter={[20, 20]}>
              {data.map(t => (
                <Col key={t.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: 'relative' }}>
                        <img alt={t.name} src={t.coverImage || 'https://via.placeholder.com/300x200?text=线路门票'} style={{ height: 200, objectFit: 'cover', width: '100%' }} />
                        <Tag color={t.type === '门票' ? 'blue' : 'orange'} style={{ position: 'absolute', top: 8, left: 8, fontSize: 13 }}>
                          {t.type === '门票' ? '🎫 门票' : '🗺️ 路线'}
                        </Tag>
                      </div>
                    }
                    actions={[
                      <Button type="link" onClick={() => setDetail(t)}>查看详情</Button>,
                      <Button type="primary" loading={buying}
                        onClick={() => handleBuy(t)}>
                        {t.type === '门票' ? '立即购票' : '立即预订'}
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={<span style={{ fontSize: 16 }}>{t.name}</span>}
                      description={
                        <div>
                          <div style={{ marginBottom: 8 }}>
                            <span style={{ color: '#f5222d', fontSize: 22, fontWeight: 'bold' }}>¥{t.price}</span>
                            {t.type === '门票' && <span style={{ color: '#999', marginLeft: 8 }}>/人</span>}
                            {t.type === '路线' && <span style={{ color: '#999', marginLeft: 8 }}>/团</span>}
                          </div>
                          <Tag color={t.stock > 0 ? 'green' : 'red'}>
                            {t.stock > 0 ? `库存 ${t.stock}` : '已售罄'}
                          </Tag>
                          <p style={{ color: '#666', marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
                            {t.description?.slice(0, 60)}{(t.description?.length || 0) > 60 ? '...' : ''}
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
                    <CompassOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                    <p style={{ fontSize: 16 }}>暂无票务信息，敬请期待</p>
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
          <Button key="buy" type="primary" loading={buying}
            disabled={detail?.stock === 0}
            onClick={() => detail && handleBuy(detail)}>
            {detail?.type === '门票' ? '立即购票' : '立即预订'} ¥{detail?.price}
          </Button>,
        ]}
        width={680}
        title={detail?.name}
      >
        {detail && (
          <div>
            <img src={detail.coverImage || 'https://via.placeholder.com/600x400?text=线路门票'} alt={detail.name}
              style={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="类型"><Tag color={detail.type === '门票' ? 'blue' : 'orange'}>{detail.type}</Tag></Descriptions.Item>
              <Descriptions.Item label="价格"><span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>¥{detail.price}</span></Descriptions.Item>
              <Descriptions.Item label="库存">
                <Tag color={detail.stock > 0 ? 'green' : 'red'}>{detail.stock > 0 ? `${detail.stock} 份` : '已售罄'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="时长">{detail.type === '路线' ? '2天1晚' : '1天'}</Descriptions.Item>
              <Descriptions.Item label="介绍" span={2}>{detail.description || '暂无介绍'}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px 50px' }}>
        <div>🏯 乌东文旅 · 行·线路门票 | © 2026 第6组</div>
      </Footer>
    </Layout>
  );
};

export default PublicTickets;
