import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Spin, message, Button, Modal, Descriptions, Tag, InputNumber, DatePicker, Space, Select, Rate, Empty, Input, List } from 'antd';
import { EnvironmentOutlined, HomeOutlined, CheckCircleOutlined, ArrowLeftOutlined, HeartOutlined, HeartFilled, ShoppingCartOutlined, AimOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getHomestayList, Homestay } from '../api/homestay';
import { createOrder } from '../api/order';
import { toggleFavorite, checkFavorite } from '../api/favorite';
import CartDrawer from '../components/CartDrawer';
import request from '../api/request';

const { Header, Content, Footer } = Layout;
const AMENITIES = ['WiFi', '空调', '停车场', '观景台', '厨房', '餐厅', '独立卫浴', '会议室'];

const PublicHomestay: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Homestay | null>(null);
  const [favMap, setFavMap] = useState<Record<number, boolean>>({});
  const [showMap, setShowMap] = useState(false);

  // filters
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number>(0);
  const [amenity, setAmenity] = useState<string>('');

  // booking
  const [bookTarget, setBookTarget] = useState<Homestay | null>(null);
  const [checkIn, setCheckIn] = useState<any>(null);
  const [checkOut, setCheckOut] = useState<any>(null);
  const [roomType, setRoomType] = useState('标准间');
  const [rooms, setRooms] = useState(1);
  const [booking, setBooking] = useState(false);

  // reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [myRating, setMyRating] = useState(5);
  const [myContent, setMyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getHomestayList({ pageSize: 50, minPrice, maxPrice, minRating: minRating || undefined, amenity: amenity || undefined }).then((r: any) => {
      if (r.success) { setData(r.data || []); loadFavs(r.data || []); }
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, [minPrice, maxPrice, minRating, amenity]);

  const loadFavs = async (items: Homestay[]) => { const m: Record<number, boolean> = {}; await Promise.all(items.map(async h => { try { const rr: any = await checkFavorite('homestay', h.id); m[h.id] = rr?.data?.favorited || false; } catch { m[h.id] = false; } })); setFavMap(m); };
  const handleFav = async (h: Homestay) => { const res: any = await toggleFavorite('homestay', h.id); if (res.success) { setFavMap(p => ({ ...p, [h.id]: res.data.favorited })); } };

  const openDetail = (h: Homestay) => {
    setDetail(h); setMyRating(5); setMyContent('');
    setReviewLoading(true);
    request.get('/homestay-review/list', { params: { homestayId: h.id } }).then((res: any) => {
      if (res.success) setReviews(res.data || []);
    }).catch(() => {}).finally(() => setReviewLoading(false));
  };

  const openBook = (h: Homestay) => { setBookTarget(h); setCheckIn(null); setCheckOut(null); setRoomType('标准间'); setRooms(1); };
  const handleBook = async () => {
    if (!bookTarget || !checkIn || !checkOut) { message.warning('请选择入住和离店日期'); return; }
    setBooking(true);
    try {
      const nights = Math.max(1, checkOut.diff(checkIn, 'day'));
      const total = Number(bookTarget.pricePerNight) * nights * rooms;
      const res: any = await createOrder({ type: '住宿', amount: total, merchantId: bookTarget.merchantId, itemName: `${bookTarget.name} ${roomType} ${nights}晚×${rooms}间`, itemImage: bookTarget.coverImage });
      if (res.success) message.success(`预订成功！${res.data.orderNo}`); else message.error(res.message || '失败');
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ margin: 0 }}>🏠 住·民宿住宿</h2>
            <Button icon={showMap ? <UnorderedListOutlined /> : <AimOutlined />} onClick={() => setShowMap(!showMap)}>{showMap ? '列表模式' : '地图模式'}</Button>
          </div>

          {/* 地图 */}
          {showMap && (
            <div style={{ marginBottom: 24, borderRadius: 12, overflow: 'hidden', height: 350, background: 'linear-gradient(180deg, #e8f5e9 0%, #a5d6a7 50%, #66bb6a 100%)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 15, left: 20, background: 'rgba(255,255,255,.9)', borderRadius: 8, padding: '4px 12px', fontWeight: 'bold' }}>🗺️ 乌东民宿分布</div>
              {data.map((h, i) => (
                <div key={h.id} style={{ position: 'absolute', top: 30 + i * 100, left: `${15 + i * 28}%`, textAlign: 'center' }}>
                  <div style={{ fontSize: 28 }}>📍</div>
                  <div style={{ background: '#fff', borderRadius: 6, padding: '4px 10px', boxShadow: '0 2px 6px rgba(0,0,0,.15)', whiteSpace: 'nowrap', fontSize: 12 }}>
                    <b>{h.name}</b><br /><span style={{ color: '#f5222d' }}>¥{h.pricePerNight}/晚</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 筛选栏 */}
          {!showMap && (
            <div style={{ marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#666' }}>价格：</span>
              <InputNumber placeholder="最低" min={0} value={minPrice} onChange={v => setMinPrice(v || undefined)} style={{ width: 100 }} size="small" />
              <span>—</span>
              <InputNumber placeholder="最高" min={0} value={maxPrice} onChange={v => setMaxPrice(v || undefined)} style={{ width: 100 }} size="small" />
              <span style={{ fontSize: 13, color: '#666', marginLeft: 8 }}>评分≥</span>
              <Rate count={5} value={minRating} onChange={v => setMinRating(v)} style={{ fontSize: 14 }} allowClear />
              <Select placeholder="设施筛选" allowClear value={amenity || undefined} onChange={v => setAmenity(v || '')} style={{ width: 140 }} size="small"
                options={AMENITIES.map(a => ({ value: a, label: a }))} />
            </div>
          )}

          {!showMap && (loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> : (
            <Row gutter={[20, 20]}>
              {data.map(h => (
                <Col key={h.id} xs={24} sm={12} md={8} lg={8}>
                  <Card hoverable cover={<div style={{ position: 'relative' }}>
                    <img alt={h.name} src={h.coverImage} style={{ height: 220, objectFit: 'cover', width: '100%' }} onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200'; }} />
                    <Button type="text" style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(255,255,255,.85)', borderRadius: '50%' }}
                      icon={favMap[h.id] ? <HeartFilled style={{ color: '#ff4d4f', fontSize: 18 }} /> : <HeartOutlined style={{ fontSize: 18 }} />}
                      onClick={e => { e.stopPropagation(); handleFav(h); }} />
                  </div>}
                    actions={[<Button type="link" onClick={() => openDetail(h)}>查看详情</Button>, <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => openBook(h)}>预订房间</Button>]}>
                    <Card.Meta title={<>{h.name} <Rate disabled value={Number(h.rating) || 5} style={{ fontSize: 12 }} /></>}
                      description={<><EnvironmentOutlined /> {h.address}<br /><span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>¥{h.pricePerNight}</span> /晚<br /><Tag color="blue">{h.roomCount}间房</Tag> {h.amenities?.split(',').map((a: string) => <Tag key={a} color="green">{a.trim()}</Tag>)}<br /><span style={{ color: '#666', fontSize: 13 }}>{h.description?.slice(0, 60)}...</span></>} />
                  </Card>
                </Col>
              ))}
            </Row>
          ))}
        </div>
      </Content>

      {/* 详情 */}
      <Modal open={!!detail} onCancel={() => { setDetail(null); setReviews([]); }} footer={[<Button key="back" onClick={() => { setDetail(null); setReviews([]); }}>返回</Button>, <Button key="book" type="primary" onClick={() => { const d = detail; setDetail(null); setTimeout(() => d && openBook(d), 100); }}>预订房间 ¥{detail?.pricePerNight}/晚</Button>]} width={720} title={detail?.name}>
        {detail && (<div><img src={detail.coverImage} alt={detail.name} style={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400'; }} />
          <Descriptions column={2} bordered size="small"><Descriptions.Item label="价格"><span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>¥{detail.pricePerNight}</span> /晚</Descriptions.Item><Descriptions.Item label="房间数">{detail.roomCount} 间</Descriptions.Item><Descriptions.Item label="地址" span={2}><EnvironmentOutlined /> {detail.address}</Descriptions.Item><Descriptions.Item label="设施" span={2}>{detail.amenities?.split(',').map((a: string) => <Tag key={a} color="green"><CheckCircleOutlined /> {a.trim()}</Tag>)}</Descriptions.Item><Descriptions.Item label="介绍" span={2}>{detail.description}</Descriptions.Item></Descriptions>
          {/* 评价 */}
          <h4 style={{ marginTop: 20, marginBottom: 12 }}>📝 住客评价 ({reviews.length}条)</h4>
          {reviewLoading ? <Spin /> : reviews.length === 0 ? <div style={{ color: '#999', padding: 12 }}>暂无评价，来写第一条吧</div> :
            reviews.map((r: any) => (<div key={r.id} style={{ borderBottom: '1px solid #f0f0f0', padding: '8px 0' }}><Rate disabled value={r.rating} style={{ fontSize: 12 }} /><span style={{ fontSize: 13 }}> {r.content}</span>{r.reply && <Tag color="blue" style={{ marginLeft: 8, fontSize: 11 }}>回复: {r.reply}</Tag>}<span style={{ color: '#999', fontSize: 11, float: 'right' }}>{new Date(r.createdAt).toLocaleString()}</span></div>))}
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12, marginTop: 12 }}>
            <h5 style={{ marginBottom: 8 }}>✍️ 写评价</h5>
            <Rate value={myRating} onChange={setMyRating} style={{ marginBottom: 8 }} />
            <Input.TextArea rows={2} value={myContent} onChange={e => setMyContent(e.target.value)} placeholder="分享您的入住体验..." maxLength={500} style={{ marginBottom: 8 }} />
            <Button type="primary" size="small" loading={submitting} onClick={async () => {
              if (!detail || !myContent.trim()) { message.warning('请输入评价内容'); return; }
              setSubmitting(true);
              try { const res: any = await request.post('/homestay-review/create', { homestayId: detail.id, rating: myRating, content: myContent.trim() }); if (res.success) { message.success('评价成功！'); setMyRating(5); setMyContent(''); const r2: any = await request.get('/homestay-review/list', { params: { homestayId: detail.id } }); if (r2.success) setReviews(r2.data || []); } else message.error(res.message || '失败'); } catch { message.error('评价失败'); } finally { setSubmitting(false); }
            }}>提交评价</Button>
          </div>
        </div>)}
      </Modal>

      {/* 预订 */}
      <Modal open={!!bookTarget} onCancel={() => setBookTarget(null)} footer={[<Button key="back" onClick={() => setBookTarget(null)}>返回</Button>, <Button key="ok" type="primary" loading={booking} onClick={handleBook}>确认预订</Button>]} width={480} title={`预订 - ${bookTarget?.name}`}>
        {bookTarget && (<div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>入住日期</span><DatePicker value={checkIn} onChange={setCheckIn} style={{ width: '100%', marginTop: 8 }} /></div>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>离店日期</span><DatePicker value={checkOut} onChange={setCheckOut} disabledDate={d => checkIn ? d <= checkIn : false} style={{ width: '100%', marginTop: 8 }} /></div>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>房型</span><Select value={roomType} onChange={setRoomType} style={{ width: '100%', marginTop: 8 }} options={[{ value: '标准间', label: '标准间' }, { value: '大床房', label: '大床房' }, { value: '套房', label: '套房' }]} /></div>
          <div style={{ marginBottom: 16 }}><span style={{ fontWeight: 'bold' }}>房间数</span><InputNumber min={1} max={bookTarget.roomCount} value={rooms} onChange={v => setRooms(v || 1)} style={{ width: '100%', marginTop: 8 }} /></div>
          <div style={{ background: '#fff7e6', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}><span>{checkIn && checkOut ? `${Math.max(1, checkOut.diff(checkIn, 'day'))}晚 × ${rooms}间` : '请选择日期'}</span><span style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>¥{(Number(bookTarget.pricePerNight) * Math.max(1, checkOut?.diff(checkIn, 'day') || 1) * rooms).toFixed(2)}</span></div>
        </div>)}
      </Modal>
      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px 50px' }}><div>🏯 乌东文旅 · 住·民宿住宿 | © 2026 第6组</div></Footer>
    </Layout>
  );
};
export default PublicHomestay;
