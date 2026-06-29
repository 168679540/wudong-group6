import React, { useEffect, useState, useMemo } from 'react';
import { Layout, Menu, Card, Row, Col, Spin, message, Button, Modal, Descriptions, Tag, Rate, Input, InputNumber, DatePicker, Space, Select } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, ArrowLeftOutlined, CoffeeOutlined, HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getRestaurantList, Restaurant } from '../api/restaurant';
import { createOrder } from '../api/order';
import { toggleFavorite, checkFavorite } from '../api/favorite';
import { getMealSlots, MealSlot } from '../api/mealSlot';
import { getAgroProductList, AgroProduct } from '../api/agroProduct';
import CartDrawer from '../components/CartDrawer';

const { Header, Content, Footer } = Layout;

const PublicFood: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Restaurant | null>(null);
  const [favMap, setFavMap] = useState<Record<number, boolean>>({});
  const [agro, setAgro] = useState<AgroProduct[]>([]);

  // booking
  const [bookTarget, setBookTarget] = useState<Restaurant | null>(null);
  const [slots, setSlots] = useState<MealSlot[]>([]);
  const [partySize, setPartySize] = useState(2);
  const [reserveTime, setReserveTime] = useState<any>(null);
  const [specialReq, setSpecialReq] = useState('');
  const [booking, setBooking] = useState(false);

  // 农产品规格购买
  const [agroBuy, setAgroBuy] = useState<AgroProduct | null>(null);
  const [agroQty, setAgroQty] = useState(1);
  const [agroBuying, setAgroBuying] = useState(false);

  useEffect(() => {
    getRestaurantList({ pageSize: 50 }).then((r: any) => {
      if (r.success) { setData(r.data || []); loadFavs(r.data || []); }
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
    // 农产品独立加载，失败不影响主页面
    getAgroProductList({ pageSize: 50 }).then((a: any) => {
      if (a.success) setAgro(a.data || []);
    }).catch(() => {});
  }, []);

  const loadFavs = async (items: Restaurant[]) => { const m: Record<number, boolean> = {}; await Promise.all(items.map(async r => { try { const rr: any = await checkFavorite('restaurant', r.id); m[r.id] = rr?.data?.favorited || false; } catch { m[r.id] = false; } })); setFavMap(m); };
  const handleFav = async (r: Restaurant) => { const res: any = await toggleFavorite('restaurant', r.id); if (res.success) { setFavMap(p => ({ ...p, [r.id]: res.data.favorited })); } };

  const openDetail = (r: Restaurant) => { setDetail(r); };

  const openBook = (r: Restaurant) => {
    setBookTarget(r); setPartySize(2); setReserveTime(null); setSpecialReq('');
    getMealSlots(r.id).then((res: any) => { if (res.success) setSlots(res.data || []); }).catch(() => setSlots([]));
  };
  const handleBook = async () => {
    if (!bookTarget || !reserveTime) { message.warning('请选择预约时间'); return; }
    setBooking(true);
    try {
      const total = Number(bookTarget.avgPrice) * partySize;
      const res: any = await createOrder({ type: '餐位', amount: total, merchantId: bookTarget.merchantId || bookTarget.id, itemName: `${bookTarget.name} ${partySize}人`, itemImage: bookTarget.coverImage });
      if (res.success) message.success(`预订成功！订单号：${res.data.orderNo}`); else message.error(res.message || '失败');
      setBookTarget(null);
    } catch { message.error('预订失败'); } finally { setBooking(false); }
  };

  return (
    <Layout>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }} onClick={() => navigate('/pc')}>🏯 乌东文旅</div>
        <Space size="large">
          <Menu mode="horizontal" defaultSelectedKeys={['food']} style={{ border: 'none' }} items={[{ key: 'home', label: '首页', icon: <ArrowLeftOutlined /> }, { key: 'food', label: '食·餐饮美食', icon: <CoffeeOutlined /> }]} onClick={({ key }) => { if (key === 'home') navigate('/pc'); }} />
          <CartDrawer />
        </Space>
      </Header>
      <Content style={{ padding: '32px 80px', minHeight: '80vh', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>🍽️ 食·餐饮美食</h2>
          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> : (
            <Row gutter={[20, 20]}>
              {data.map(r => (
                <Col key={r.id} xs={24} sm={12} md={8} lg={8}>
                  <Card hoverable cover={<div style={{ position: 'relative' }}>
                    <img alt={r.name} src={r.coverImage} style={{ height: 220, objectFit: 'cover', width: '100%' }} onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200'; }} />
                    <Button type="text" style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(255,255,255,.85)', borderRadius: '50%' }}
                      icon={favMap[r.id] ? <HeartFilled style={{ color: '#ff4d4f', fontSize: 18 }} /> : <HeartOutlined style={{ fontSize: 18 }} />}
                      onClick={e => { e.stopPropagation(); handleFav(r); }} />
                  </div>}
                    actions={[<Button type="link" onClick={() => openDetail(r)}>查看详情</Button>, <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => openBook(r)}>预订餐位</Button>]}>
                    <Card.Meta title={<>{r.name} <Rate disabled value={r.rating} style={{ fontSize: 14 }} /></>}
                      description={<><EnvironmentOutlined /> {r.address}<br /><span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>¥{r.avgPrice}</span><span style={{ color: '#999' }}> /人</span><br /><span style={{ color: '#666', fontSize: 13 }}>{r.description?.slice(0, 80)}...</span></>} />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* 农产品特产专区 */}
        {agro.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, marginTop: 24 }}>
            <h3 style={{ marginBottom: 16 }}>🌾 农产品特产</h3>
            <Row gutter={[16, 16]}>
              {agro.map(a => (
                <Col key={a.id} xs={24} sm={12} md={6}>
                  <Card hoverable cover={<img src={a.coverImage} style={{ height: 180, objectFit: 'cover' }} alt={a.name} />}
                    actions={[<Button type="primary" size="small" onClick={() => { setAgroBuy(a); setAgroQty(1); }}>立即购买</Button>]}>
                    <Card.Meta title={a.name} description={<><Tag color="green">{a.category}</Tag><br /><span style={{ color: '#f5222d', fontSize: 18, fontWeight: 'bold' }}>¥{a.price}</span><br /><span style={{ color: '#666', fontSize: 12 }}>{a.description?.slice(0, 40)}</span></>} />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Content>
      <Modal open={!!detail} onCancel={() => setDetail(null)} footer={[<Button key="back" onClick={() => setDetail(null)}>返回</Button>, <Button key="book" type="primary" onClick={() => { const d = detail; setDetail(null); setTimeout(() => d && openBook(d), 100); }}>预订餐位 ¥{detail?.avgPrice}/人</Button>]} width={680} title={detail?.name}>
        {detail && (<div><img src={detail.coverImage} alt={detail.name} style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400'; }} />
          <Descriptions column={1} bordered size="small"><Descriptions.Item label="评分"><Rate disabled value={detail.rating} /></Descriptions.Item><Descriptions.Item label="人均"><span style={{ color: '#f5222d', fontSize: 18, fontWeight: 'bold' }}>¥{detail.avgPrice}</span> /人</Descriptions.Item><Descriptions.Item label="地址"><EnvironmentOutlined /> {detail.address}</Descriptions.Item><Descriptions.Item label="介绍">{detail.description || '暂无介绍'}</Descriptions.Item></Descriptions></div>)}
      </Modal>
      <Modal open={!!bookTarget} onCancel={() => setBookTarget(null)} footer={[<Button key="back" onClick={() => setBookTarget(null)}>返回</Button>, <Button key="ok" type="primary" loading={booking} onClick={handleBook}>确认预订 ¥{((Number(bookTarget?.avgPrice) || 0) * partySize).toFixed(2)}</Button>]} width={480} title={`预订 - ${bookTarget?.name}`}>
        {bookTarget && (<div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>可选时段</span>{slots.length > 0 && <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>{slots.map(s => <Tag key={s.id} color="blue" style={{ cursor: 'pointer', padding: '4px 12px' }}>{s.name}({s.startTime}-{s.endTime}, 限{s.maxBookings}人)</Tag>)}</div>}</div>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>用餐人数</span><InputNumber min={1} max={20} value={partySize} onChange={v => setPartySize(v || 1)} style={{ width: '100%', marginTop: 8 }} /></div>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>预约时间</span><DatePicker showTime format="YYYY-MM-DD HH:mm" value={reserveTime} onChange={setReserveTime} style={{ width: '100%', marginTop: 8 }} placeholder="选择用餐时间" /></div>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>特殊要求</span><Input.TextArea rows={2} value={specialReq} onChange={e => setSpecialReq(e.target.value)} placeholder="如：过敏食物、包间需求" style={{ marginTop: 8 }} /></div>
          <div style={{ background: '#fff7e6', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}><span>合计</span><span style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>¥{((Number(bookTarget.avgPrice) || 0) * partySize).toFixed(2)}</span></div>
        </div>)}
      </Modal>
      {/* 农产品购买弹窗 */}
      <Modal open={!!agroBuy} onCancel={() => setAgroBuy(null)} footer={[
        <Button key="ok" type="primary" loading={agroBuying} onClick={async () => {
          if (!agroBuy) return; setAgroBuying(true);
          try { const total = Number(agroBuy.price) * agroQty; const res: any = await createOrder({ type: '商品', amount: total, merchantId: agroBuy.merchantId, itemName: `${agroBuy.name} ×${agroQty}`, itemImage: agroBuy.coverImage }); if (res.success) { message.success(`购买成功！${res.data.orderNo}`); setAgroBuy(null); } else message.error(res.message || '失败'); } catch { message.error('购买失败'); } finally { setAgroBuying(false); }
        }}>确认购买 ¥{agroBuy ? (Number(agroBuy.price) * agroQty).toFixed(2) : '0.00'}</Button>,
      ]} width={400} title={`购买 - ${agroBuy?.name}`}>
        {agroBuy && (<div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>数量</span><InputNumber min={1} max={Math.min(agroBuy.stock, 99)} value={agroQty} onChange={v => setAgroQty(v || 1)} style={{ width: '100%', marginTop: 8 }} /></div>
          <div style={{ background: '#fff7e6', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}><span>合计</span><span style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>¥{(Number(agroBuy.price) * agroQty).toFixed(2)}</span></div>
        </div>)}
      </Modal>
      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px 50px' }}><div>🏯 乌东文旅 · 食·餐饮美食 | © 2026 第6组</div></Footer>
    </Layout>
  );
};
export default PublicFood;
