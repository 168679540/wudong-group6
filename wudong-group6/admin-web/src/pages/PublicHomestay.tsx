import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Spin, message, Button, Modal, Descriptions, Tag, InputNumber, DatePicker, Space, Select } from 'antd';
import { EnvironmentOutlined, HomeOutlined, CheckCircleOutlined, ArrowLeftOutlined, HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getHomestayList, Homestay } from '../api/homestay';
import { createOrder } from '../api/order';
import { toggleFavorite, checkFavorite } from '../api/favorite';
import CartDrawer from '../components/CartDrawer';

const { Header, Content, Footer } = Layout;

const PublicHomestay: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Homestay | null>(null);
  const [favMap, setFavMap] = useState<Record<number, boolean>>({});
  const [bookTarget, setBookTarget] = useState<Homestay | null>(null);
  const [checkIn, setCheckIn] = useState<any>(null);
  const [checkOut, setCheckOut] = useState<any>(null);
  const [roomType, setRoomType] = useState('标准间');
  const [rooms, setRooms] = useState(1);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    getHomestayList({ pageSize: 50 }).then((r: any) => {
      if (r.success) { setData(r.data || []); loadFavs(r.data || []); }
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, []);
  const loadFavs = async (items: Homestay[]) => { const m: Record<number, boolean> = {}; await Promise.all(items.map(async h => { try { const rr: any = await checkFavorite('homestay', h.id); m[h.id] = rr?.data?.favorited || false; } catch { m[h.id] = false; } })); setFavMap(m); };
  const handleFav = async (h: Homestay) => { const res: any = await toggleFavorite('homestay', h.id); if (res.success) { setFavMap(p => ({ ...p, [h.id]: res.data.favorited })); } };

  const openBook = (h: Homestay) => { setBookTarget(h); setCheckIn(null); setCheckOut(null); setRoomType('标准间'); setRooms(1); };
  const handleBook = async () => {
    if (!bookTarget || !checkIn || !checkOut) { message.warning('请选择入住和离店日期'); return; }
    setBooking(true);
    try {
      const nights = Math.max(1, checkOut.diff(checkIn, 'day'));
      const total = Number(bookTarget.pricePerNight) * nights * rooms;
      const res: any = await createOrder({ type: '住宿', amount: total, merchantId: bookTarget.merchantId, itemName: `${bookTarget.name} ${roomType} ${nights}晚×${rooms}间`, itemImage: bookTarget.coverImage });
      if (res.success) message.success(`预订成功！订单号：${res.data.orderNo}`); else message.error(res.message || '失败');
      setBookTarget(null);
    } catch { message.error('预订失败'); } finally { setBooking(false); }
  };

  return (
    <Layout>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }} onClick={() => navigate('/pc')}>🏯 乌东文旅</div>
        <Space size="large"><Menu mode="horizontal" defaultSelectedKeys={['homestay']} style={{ border: 'none' }} items={[{ key: 'home', label: '首页', icon: <ArrowLeftOutlined /> }, { key: 'homestay', label: '住·民宿住宿', icon: <HomeOutlined /> }]} onClick={({ key }) => { if (key === 'home') navigate('/pc'); }} /><CartDrawer /></Space>
      </Header>
      <Content style={{ padding: '32px 80px', minHeight: '80vh', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>🏠 住·民宿住宿</h2>
          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> : (
            <Row gutter={[20, 20]}>
              {data.map(h => (
                <Col key={h.id} xs={24} sm={12} md={8} lg={8}>
                  <Card hoverable cover={<div style={{ position: 'relative' }}>
                    <img alt={h.name} src={h.coverImage} style={{ height: 220, objectFit: 'cover', width: '100%' }} onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200'; }} />
                    <Button type="text" style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(255,255,255,.85)', borderRadius: '50%' }}
                      icon={favMap[h.id] ? <HeartFilled style={{ color: '#ff4d4f', fontSize: 18 }} /> : <HeartOutlined style={{ fontSize: 18 }} />}
                      onClick={e => { e.stopPropagation(); handleFav(h); }} />
                  </div>}
                    actions={[<Button type="link" onClick={() => setDetail(h)}>查看详情</Button>, <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => openBook(h)}>预订房间</Button>]}>
                    <Card.Meta title={h.name} description={<><EnvironmentOutlined /> {h.address}<br /><span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>¥{h.pricePerNight}</span> /晚<br /><Tag color="blue">{h.roomCount}间房</Tag> {h.amenities?.split(',').map((a: string) => <Tag key={a} color="green">{a.trim()}</Tag>)}<br /><span style={{ color: '#666', fontSize: 13 }}>{h.description?.slice(0, 60)}...</span></>} />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>
      <Modal open={!!detail} onCancel={() => setDetail(null)} footer={[<Button key="back" onClick={() => setDetail(null)}>返回</Button>, <Button key="book" type="primary" onClick={() => { const d = detail; setDetail(null); setTimeout(() => d && openBook(d), 100); }}>预订房间 ¥{detail?.pricePerNight}/晚</Button>]} width={680} title={detail?.name}>
        {detail && (<div><img src={detail.coverImage} alt={detail.name} style={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400'; }} />
          <Descriptions column={2} bordered size="small"><Descriptions.Item label="价格"><span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>¥{detail.pricePerNight}</span> /晚</Descriptions.Item><Descriptions.Item label="房间数">{detail.roomCount} 间</Descriptions.Item><Descriptions.Item label="地址" span={2}><EnvironmentOutlined /> {detail.address}</Descriptions.Item><Descriptions.Item label="设施" span={2}>{detail.amenities?.split(',').map((a: string) => <Tag key={a} color="green"><CheckCircleOutlined /> {a.trim()}</Tag>)}</Descriptions.Item><Descriptions.Item label="介绍" span={2}>{detail.description}</Descriptions.Item></Descriptions></div>)}
      </Modal>
      <Modal open={!!bookTarget} onCancel={() => setBookTarget(null)} footer={[<Button key="back" onClick={() => setBookTarget(null)}>返回</Button>, <Button key="ok" type="primary" loading={booking} onClick={handleBook}>确认预订</Button>]} width={480} title={`预订 - ${bookTarget?.name}`}>
        {bookTarget && (<div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>入住日期</span><DatePicker value={checkIn} onChange={setCheckIn} style={{ width: '100%', marginTop: 8 }} /></div>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>离店日期</span><DatePicker value={checkOut} onChange={setCheckOut} disabledDate={d => checkIn ? d <= checkIn : false} style={{ width: '100%', marginTop: 8 }} /></div>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>房型</span><Select value={roomType} onChange={setRoomType} style={{ width: '100%', marginTop: 8 }} options={[{ value: '标准间', label: '标准间' }, { value: '大床房', label: '大床房' }, { value: '套房', label: '套房' }]} /></div>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>房间数</span><InputNumber min={1} max={bookTarget.roomCount} value={rooms} onChange={v => setRooms(v || 1)} style={{ width: '100%', marginTop: 8 }} /></div>
          <div style={{ background: '#fff7e6', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}><span>预估：{checkIn && checkOut ? `${Math.max(1, checkOut.diff(checkIn, 'day'))}晚 × ${rooms}间 × ¥${bookTarget.pricePerNight}` : '请选择日期'}</span><span style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>¥{(Number(bookTarget.pricePerNight) * Math.max(1, checkOut?.diff(checkIn, 'day') || 1) * rooms).toFixed(2)}</span></div>
        </div>)}
      </Modal>
      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px 50px' }}><div>🏯 乌东文旅 · 住·民宿住宿 | © 2026 第6组</div></Footer>
    </Layout>
  );
};
export default PublicHomestay;
