import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Tag, Spin, message, Button, Modal, Descriptions, Select, InputNumber, DatePicker, Space, Rate } from 'antd';
import { CompassOutlined, EnvironmentOutlined, ArrowLeftOutlined, HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getTicketList, Ticket } from '../api/ticket';
import { createOrder } from '../api/order';
import { toggleFavorite, checkFavorite } from '../api/favorite';
import { getTrafficList, TrafficGuide } from '../api/traffic';
import CartDrawer from '../components/CartDrawer';

const { Header, Content, Footer } = Layout;

const PublicTickets: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState<number|undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number|undefined>(undefined);
  const [minRating, setMinRating] = useState<number>(0);
  const [detail, setDetail] = useState<Ticket | null>(null);
  const [favMap, setFavMap] = useState<Record<number, boolean>>({});
  const [buyTarget, setBuyTarget] = useState<Ticket | null>(null);
  const [ticketType, setTicketType] = useState('成人票');
  const [qty, setQty] = useState(1);
  const [visitDate, setVisitDate] = useState<any>(null);
  const [buying, setBuying] = useState(false);
  const [traffic, setTraffic] = useState<TrafficGuide[]>([]);
  const [trafficDetail, setTrafficDetail] = useState<TrafficGuide | null>(null);

  useEffect(() => { getTrafficList({ pageSize: 10 }).then((r: any) => { if (r.success) setTraffic(r.data || []); }).catch(() => {}); }, []);
  useEffect(() => {
    setLoading(true);
    getTicketList({ type: type || undefined, pageSize: 50, minPrice, maxPrice, minRating: minRating || undefined }).then((r: any) => {
      if (r.success) { setData(r.data || []); loadFavs(r.data || []); }
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, [type, minPrice, maxPrice, minRating]);

  const loadFavs = async (items: Ticket[]) => { const m: Record<number, boolean> = {}; await Promise.all(items.map(async t => { try { const rr: any = await checkFavorite('ticket', t.id); m[t.id] = rr?.data?.favorited || false; } catch { m[t.id] = false; } })); setFavMap(m); };
  const handleFav = async (t: Ticket) => { const res: any = await toggleFavorite('ticket', t.id); if (res.success) { setFavMap(p => ({ ...p, [t.id]: res.data.favorited })); } };
  const openBuy = (t: Ticket) => { setBuyTarget(t); setTicketType('成人票'); setQty(1); setVisitDate(null); };

  const handleBuyNow = async () => {
    if (!buyTarget) return; setBuying(true);
    try {
      const total = Number(buyTarget.price) * qty;
      const res: any = await createOrder({ type: buyTarget.type, amount: total, merchantId: buyTarget.merchantId, itemName: `${buyTarget.name} ${ticketType} ×${qty}`, itemImage: buyTarget.coverImage });
      if (res.success) message.success(`购买成功！订单号：${res.data.orderNo}`); else message.error(res.message || '失败');
      setBuyTarget(null);
    } catch { message.error('购买失败'); } finally { setBuying(false); }
  };

  return (
    <Layout>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }} onClick={() => navigate('/pc')}>🏯 乌东文旅</div>
        <Space size="large"><Menu mode="horizontal" defaultSelectedKeys={['tickets']} style={{ border: 'none' }} items={[{ key: 'home', label: '首页', icon: <ArrowLeftOutlined /> }, { key: 'tickets', label: '行·线路门票', icon: <CompassOutlined /> }]} onClick={({ key }) => { if (key === 'home') navigate('/pc'); }} /><CartDrawer /></Space>
      </Header>
      <Content style={{ padding: '32px 80px', minHeight: '80vh', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>🎫 行·线路门票</h2>
          <div style={{ marginBottom: 24 }}>
            <Tag color={!type ? '#1890ff' : 'default'} style={{ cursor: 'pointer' }} onClick={() => setType('')}>全部</Tag>
            <Tag color={type === '门票' ? '#1890ff' : 'default'} style={{ cursor: 'pointer' }} onClick={() => setType('门票')}>🎫 景区门票</Tag>
            <Tag color={type === '路线' ? '#1890ff' : 'default'} style={{ cursor: 'pointer' }} onClick={() => setType('路线')}>🗺️ 旅游路线</Tag>
          </div>
          <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#666' }}>价格：</span>
            <InputNumber placeholder="最低" min={0} value={minPrice} onChange={v => setMinPrice(v || undefined)} style={{ width: 100 }} size="small" />
            <span>—</span>
            <InputNumber placeholder="最高" min={0} value={maxPrice} onChange={v => setMaxPrice(v || undefined)} style={{ width: 100 }} size="small" />
            <span style={{ fontSize: 13, color: '#666', marginLeft: 8 }}>评分≥</span>
            <Rate count={5} value={minRating} onChange={v => setMinRating(v)} style={{ fontSize: 14 }} allowClear />
          </div>
          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> : (
            <Row gutter={[20, 20]}>
              {data.map(t => (
                <Col key={t.id} xs={24} sm={12} md={8} lg={6}>
                  <Card hoverable cover={<div style={{ position: 'relative' }}>
                    <img alt={t.name} src={t.coverImage} style={{ height: 200, objectFit: 'cover', width: '100%' }} onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200'; }} />
                    <Tag color={t.type === '门票' ? 'blue' : 'orange'} style={{ position: 'absolute', top: 8, left: 8 }}>{t.type === '门票' ? '🎫 门票' : '🗺️ 路线'}</Tag>
                    <Button type="text" style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,255,255,.85)', borderRadius: '50%' }}
                      icon={favMap[t.id] ? <HeartFilled style={{ color: '#ff4d4f', fontSize: 18 }} /> : <HeartOutlined style={{ fontSize: 18 }} />}
                      onClick={e => { e.stopPropagation(); handleFav(t); }} />
                  </div>}
                    actions={[<Button type="link" onClick={() => setDetail(t)}>查看详情</Button>, <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => openBuy(t)}>{t.type === '门票' ? '立即购票' : '立即预订'}</Button>]}>
                    <Card.Meta title={t.name} description={<><span style={{ color: '#f5222d', fontSize: 22, fontWeight: 'bold' }}>¥{t.price}</span><br /><Tag color={t.stock > 0 ? 'green' : 'red'}>{t.stock > 0 ? `库存 ${t.stock}` : '已售罄'}</Tag><br /><span style={{ color: '#666', fontSize: 13 }}>{t.description?.slice(0, 60)}...</span></>} />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* 交通攻略专区 */}
        {traffic.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, marginTop: 24 }}>
            <h3 style={{ marginBottom: 16 }}>🚗 交通攻略</h3>
            <Row gutter={[16, 16]}>
              {traffic.map(g => (
                <Col key={g.id} xs={24} sm={12} md={8}>
                  <Card hoverable size="small" onClick={() => setTrafficDetail(g)}
                    title={<>{g.transportType && <Tag color="blue">{g.transportType}</Tag>} {g.title}</>}>
                    <div style={{ fontSize: 13, color: '#666' }}>
                      <div>📍 {g.origin} → {g.destination}</div>
                      <div>⏱ {g.duration} | 💰 {g.cost}</div>
                      <div style={{ marginTop: 4 }}>{g.content?.slice(0, 80)}...</div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Content>
      <Modal open={!!detail} onCancel={() => setDetail(null)} footer={[<Button key="back" onClick={() => setDetail(null)}>返回</Button>, <Button key="buy" type="primary" disabled={detail?.stock === 0} onClick={() => { const d = detail; setDetail(null); setTimeout(() => d && openBuy(d), 100); }}>{detail?.type === '门票' ? '立即购票' : '立即预订'} ¥{detail?.price}</Button>]} width={680} title={detail?.name}>
        {detail && (<div><img src={detail.coverImage} alt={detail.name} style={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400'; }} />
          <Descriptions column={2} bordered size="small"><Descriptions.Item label="类型"><Tag color={detail.type === '门票' ? 'blue' : 'orange'}>{detail.type}</Tag></Descriptions.Item><Descriptions.Item label="价格"><span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>¥{detail.price}</span></Descriptions.Item><Descriptions.Item label="库存"><Tag color={detail.stock > 0 ? 'green' : 'red'}>{detail.stock > 0 ? `${detail.stock} 份` : '已售罄'}</Tag></Descriptions.Item><Descriptions.Item label="介绍" span={2}>{detail.description}</Descriptions.Item><Descriptions.Item label="退票政策" span={2}><span style={{color:'#fa8c16'}}>{(detail as any).refundPolicy || '使用前24小时可退扣10%手续费，24小时内不可退'}</span></Descriptions.Item></Descriptions></div>)}
      </Modal>
      <Modal open={!!buyTarget} onCancel={() => setBuyTarget(null)} footer={[<Button key="back" onClick={() => setBuyTarget(null)}>返回</Button>, <Button key="buy" type="primary" loading={buying} onClick={handleBuyNow}>确认购买 ¥{((Number(buyTarget?.price) || 0) * qty).toFixed(2)}</Button>]} width={480} title={`购买 - ${buyTarget?.name}`}>
        {buyTarget && (<div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>票种</span><Select value={ticketType} onChange={setTicketType} style={{ width: '100%', marginTop: 8 }} options={[{ value: '成人票', label: '成人票' }, { value: '儿童票', label: '儿童票' }, { value: '老人票', label: '老人票' }]} /></div>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>数量</span><InputNumber min={1} max={Math.min(buyTarget.stock, 99)} value={qty} onChange={v => setQty(v || 1)} style={{ width: '100%', marginTop: 8 }} /></div>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>游玩日期</span><DatePicker value={visitDate} onChange={setVisitDate} style={{ width: '100%', marginTop: 8 }} /></div>
          <div style={{ background: '#fff7e6', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}><span>合计</span><span style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>¥{((Number(buyTarget.price) || 0) * qty).toFixed(2)}</span></div>
        </div>)}
      </Modal>
      {/* 交通攻略详情弹窗 */}
      <Modal open={!!trafficDetail} onCancel={() => setTrafficDetail(null)} footer={null} width={640} title={trafficDetail?.title}>
        {trafficDetail && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="出发地">{trafficDetail.origin}</Descriptions.Item>
              <Descriptions.Item label="目的地">{trafficDetail.destination}</Descriptions.Item>
              <Descriptions.Item label="交通方式"><Tag color="blue">{trafficDetail.transportType}</Tag></Descriptions.Item>
              <Descriptions.Item label="预计耗时">{trafficDetail.duration}</Descriptions.Item>
              <Descriptions.Item label="参考费用" span={2}>{trafficDetail.cost}</Descriptions.Item>
            </Descriptions>
            <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, lineHeight: 2, fontSize: 14, whiteSpace: 'pre-wrap' }}>
              {trafficDetail.content}
            </div>
          </div>
        )}
      </Modal>
      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px 50px' }}><div>🏯 乌东文旅 · 行·线路门票 | © 2026 第6组</div></Footer>
    </Layout>
  );
};
export default PublicTickets;
