import React, { useEffect, useState, useMemo } from 'react';
import { Layout, Menu, Card, Row, Col, Tag, Spin, message, Button, Input, Modal, Descriptions, Select, InputNumber, Space, Rate, List, Empty } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, SearchOutlined, ArrowLeftOutlined, SkinOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getProductList, Product } from '../api/product';
import { createOrder } from '../api/order';
import { useCart } from '../components/CartContext';
import CartDrawer from '../components/CartDrawer';
import { getActiveCategories } from '../api/category';
import { getProductReviews, createReview, ProductReview } from '../api/review';
import { toggleFavorite, checkFavorite } from '../api/favorite';

const { Header, Content, Footer } = Layout;

const catColors: Record<string, string> = { '银饰': 'blue', '蜡染': 'green', '刺绣': 'orange', '服饰': 'purple', '其他': 'default' };

const PublicProduct: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('');
  const [cats, setCats] = useState<string[]>(['全部', '银饰', '蜡染', '刺绣', '服饰', '其他']);
  const [detail, setDetail] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [favMap, setFavMap] = useState<Record<number, boolean>>({});

  // 规格选择
  const [buyTarget, setBuyTarget] = useState<Product | null>(null);
  const [specSize, setSpecSize] = useState<string>('');
  const [specColor, setSpecColor] = useState<string>('');
  const [specQty, setSpecQty] = useState(1);
  const [buying, setBuying] = useState(false);

  // 评价提交
  const [myRating, setMyRating] = useState(5);
  const [myContent, setMyContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    getActiveCategories().then((r: any) => {
      if (r?.success && r.data?.length) setCats(['全部', ...r.data.map((c: any) => c.name)]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProductList({ category: cat || undefined, keyword: search || undefined, pageSize: 50, minPrice, maxPrice, sort: sortBy || undefined }).then((r: any) => {
      if (r.success) { setData(r.data || []); loadFavStatus(r.data || []); }
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, [cat, search, minPrice, maxPrice, sortBy]);

  const loadFavStatus = async (items: Product[]) => {
    const m: Record<number, boolean> = {};
    await Promise.all(items.map(async p => {
      try { const r: any = await checkFavorite('product', p.id); m[p.id] = r?.data?.favorited || false; } catch { m[p.id] = false; }
    }));
    setFavMap(m);
  };

  const handleFavorite = async (p: Product) => {
    try {
      const res: any = await toggleFavorite('product', p.id);
      if (res.success) { setFavMap(prev => ({ ...prev, [p.id]: res.data.favorited })); message.success(res.message); }
    } catch { message.error('操作失败'); }
  };

  const openDetail = (p: Product) => {
    setDetail(p);
    setReviewLoading(true);
    setMyRating(5);
    setMyContent('');
    getProductReviews(p.id).then((r: any) => {
      if (r.success) setReviews(r.data || []);
    }).catch(() => {}).finally(() => setReviewLoading(false));
  };

  const handleSubmitReview = async () => {
    if (!detail || !myContent.trim()) { message.warning('请输入评价内容'); return; }
    setSubmittingReview(true);
    try {
      const res: any = await createReview({ productId: detail.id, rating: myRating, content: myContent.trim() });
      if (res.success) {
        message.success('评价成功！');
        setMyRating(5); setMyContent('');
        // 刷新评价列表
        const r2: any = await getProductReviews(detail.id);
        if (r2.success) setReviews(r2.data || []);
      } else { message.error(res.message || '评价失败'); }
    } catch { message.error('评价失败'); }
    finally { setSubmittingReview(false); }
  };

  const specOptions = useMemo(() => {
    if (!buyTarget?.specs) return { sizes: [] as string[], colors: [] as string[] };
    try {
      const s = typeof buyTarget.specs === 'string' ? JSON.parse(buyTarget.specs) : buyTarget.specs;
      return { sizes: s?.尺寸 || s?.size || [], colors: s?.颜色 || s?.color || [] };
    } catch { return { sizes: [], colors: [] }; }
  }, [buyTarget]);

  const openBuy = (p: Product) => {
    setBuyTarget(p);
    const opts = (() => {
      try { const s = typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs; return { sizes: s?.尺寸 || s?.size || [], colors: s?.颜色 || s?.color || [] }; } catch { return { sizes: [], colors: [] }; }
    })();
    setSpecSize(opts.sizes[0] || '');
    setSpecColor(opts.colors[0] || '');
    setSpecQty(1);
  };

  const handleAddToCart = () => {
    if (!buyTarget) return;
    const specs: Record<string, string> = {};
    if (specSize) specs['尺寸'] = specSize;
    if (specColor) specs['颜色'] = specColor;
    addItem({
      uid: `p${buyTarget.id}_${specSize}_${specColor}`,
      productId: buyTarget.id, name: buyTarget.name, image: buyTarget.coverImage,
      price: buyTarget.price, quantity: specQty, specs, merchantId: buyTarget.merchantId,
    });
    message.success('已加入购物车'); setBuyTarget(null);
  };

  const handleBuyNow = async () => {
    if (!buyTarget) return; setBuying(true);
    try {
      const specDesc = [specSize, specColor].filter(Boolean).join(' ');
      const res: any = await createOrder({
        type: '商品', amount: buyTarget.price * specQty, merchantId: buyTarget.merchantId,
        itemName: `${buyTarget.name}${specDesc ? ' ' + specDesc : ''} ×${specQty}`, itemImage: buyTarget.coverImage,
      });
      if (res.success) message.success(`购买成功！订单号：${res.data.orderNo}`); else message.error(res.message || '下单失败');
      setBuyTarget(null);
    } catch { message.error('下单失败'); }
    finally { setBuying(false); }
  };

  return (
    <Layout>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }} onClick={() => navigate('/pc')}>🏯 乌东文旅</div>
        <Space size="large">
          <Menu mode="horizontal" defaultSelectedKeys={['product']} style={{ border: 'none' }}
            items={[{ key: 'home', label: '首页', icon: <ArrowLeftOutlined /> }, { key: 'product', label: '衣·非遗商品', icon: <SkinOutlined /> }]}
            onClick={({ key }) => { if (key === 'home') navigate('/pc'); }} />
          <CartDrawer />
        </Space>
      </Header>

      <Content style={{ padding: '32px 80px', minHeight: '80vh', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ margin: 0 }}>🛍️ 衣·非遗商品</h2>
            <Input.Search placeholder="搜索非遗商品..." allowClear style={{ width: 320 }} onSearch={setSearch} prefix={<SearchOutlined />} />
          </div>
          <div style={{ marginBottom: 24 }}>
            {cats.map(c => <Tag key={c} color={c === (cat || '全部') ? '#1890ff' : 'default'} style={{ cursor: 'pointer', padding: '4px 16px', fontSize: 14, marginBottom: 8 }} onClick={() => setCat(c === '全部' ? '' : c)}>{c}</Tag>)}
          </div>
          <div style={{ marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#666' }}>价格：</span>
            <InputNumber placeholder="最低" min={0} value={minPrice} onChange={v => setMinPrice(v || undefined)} style={{ width: 110 }} size="small" />
            <span>—</span>
            <InputNumber placeholder="最高" min={0} value={maxPrice} onChange={v => setMaxPrice(v || undefined)} style={{ width: 110 }} size="small" />
            <Select placeholder="排序" allowClear value={sortBy || undefined} onChange={v => setSortBy(v || '')} style={{ width: 130 }} size="small"
              options={[{ value: 'sales', label: '按销量' }, { value: 'price_asc', label: '价格从低到高' }, { value: 'price_desc', label: '价格从高到低' }]} />
          </div>
          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> : (
            <Row gutter={[20, 20]}>
              {data.map(p => (
                <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                  <Card hoverable
                    cover={<div style={{ position: 'relative' }}>
                      <img alt={p.name} src={p.coverImage} style={{ height: 220, objectFit: 'cover', width: '100%' }} onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200'; }} />
                      {p.sales > 50 && <Tag color="red" style={{ position: 'absolute', top: 8, right: 8 }}>热销</Tag>}
                      <Button type="text" style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(255,255,255,.85)', borderRadius: '50%' }}
                        icon={favMap[p.id] ? <HeartFilled style={{ color: '#ff4d4f', fontSize: 18 }} /> : <HeartOutlined style={{ fontSize: 18 }} />}
                        onClick={(e) => { e.stopPropagation(); handleFavorite(p); }} />
                    </div>}
                    actions={[
                      <Button type="link" icon={<EyeOutlined />} onClick={() => openDetail(p)}>详情</Button>,
                      <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => openBuy(p)}>立即购买</Button>,
                    ]}>
                    <Card.Meta title={<span style={{ fontSize: 16 }}>{p.name}</span>}
                      description={
                        <div>
                          <Tag color={catColors[p.category] || 'default'}>{p.category}</Tag>
                          <div style={{ marginTop: 8 }}><span style={{ color: '#f5222d', fontSize: 22, fontWeight: 'bold' }}>¥{p.price}</span><span style={{ color: '#999', marginLeft: 12 }}>已售 {p.sales} 件</span></div>
                          <p style={{ color: '#666', marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>{p.description?.slice(0, 60)}{(p.description?.length || 0) > 60 ? '...' : ''}</p>
                        </div>
                      } />
                  </Card>
                </Col>
              ))}
              {data.length === 0 && (
                <Col span={24}>
                  <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
                    <SkinOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                    <p style={{ fontSize: 16 }}>暂无商品</p>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </div>
      </Content>

      {/* 详情弹窗（含评价） */}
      <Modal open={!!detail} onCancel={() => { setDetail(null); setReviews([]); }} footer={[
        <Button key="back" onClick={() => { setDetail(null); setReviews([]); }}>返回</Button>,
        <Button key="buy" type="primary" icon={<ShoppingCartOutlined />} onClick={() => { const d = detail; setDetail(null); setTimeout(() => d && openBuy(d), 100); }}>立即购买 ¥{detail?.price}</Button>,
      ]} width={760} title={detail?.name}>
        {detail && (
          <div>
            <img src={detail.coverImage} alt={detail.name} style={{ width: '100%', maxHeight: 380, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400'; }} />
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="分类"><Tag color={catColors[detail.category] || 'default'}>{detail.category}</Tag></Descriptions.Item>
              <Descriptions.Item label="价格"><span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>¥{detail.price}</span></Descriptions.Item>
              <Descriptions.Item label="销量">{detail.sales} 件</Descriptions.Item>
              <Descriptions.Item label="库存">{detail.stock} 件</Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>{detail.description || '暂无描述'}</Descriptions.Item>
            </Descriptions>
            {/* 评价列表 */}
            <h4 style={{ marginBottom: 12 }}>📝 商品评价 ({reviews.length}条)</h4>
            {reviewLoading && <Spin />}
            {!reviewLoading && reviews.length === 0 && <Empty description="暂无评价" />}
            {!reviewLoading && reviews.length > 0 && (
              <List size="small" dataSource={reviews} renderItem={r => (
                <List.Item extra={<Rate disabled value={r.rating} style={{ fontSize: 12 }} />}>
                  <List.Item.Meta title={<span style={{ fontSize: 13 }}>{r.content}</span>}
                    description={
                      <div>
                        <span style={{ color: '#999', fontSize: 12 }}>{new Date(r.createdAt).toLocaleString()}</span>
                        {r.reply && <Tag color="blue" style={{ marginLeft: 8 }}>商家回复: {r.reply}</Tag>}
                      </div>
                    } />
                </List.Item>
              )} />
            )}
            {/* 提交评价 */}
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginTop: 16 }}>
              <h5 style={{ marginBottom: 12 }}>✍️ 写评价</h5>
              <div style={{ marginBottom: 12 }}>
                <span style={{ marginRight: 8 }}>评分：</span>
                <Rate value={myRating} onChange={setMyRating} />
              </div>
              <Input.TextArea rows={3} value={myContent} onChange={e => setMyContent(e.target.value)}
                placeholder="分享您的使用体验..." maxLength={500} style={{ marginBottom: 12 }} />
              <Button type="primary" loading={submittingReview} onClick={handleSubmitReview}>提交评价</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 规格选择弹窗 */}
      <Modal open={!!buyTarget} onCancel={() => setBuyTarget(null)} footer={[
        <Button key="cart" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>加入购物车</Button>,
        <Button key="buy" type="primary" size="large" loading={buying} icon={<ShoppingCartOutlined />} onClick={handleBuyNow}>立即购买</Button>,
      ]} width={480} title={`选择规格 - ${buyTarget?.name}`}>
        {buyTarget && (
          <div style={{ padding: '16px 0' }}>
            <Row gutter={16}>
              {(specOptions.sizes.length > 0) && <Col span={12}><div style={{ marginBottom: 8, fontWeight: 'bold' }}>尺寸规格</div><Select value={specSize || undefined} onChange={setSpecSize} style={{ width: '100%' }} options={specOptions.sizes.map((s: string) => ({ value: s, label: s }))} /></Col>}
              {(specOptions.colors.length > 0) && <Col span={12}><div style={{ marginBottom: 8, fontWeight: 'bold' }}>颜色款式</div><Select value={specColor || undefined} onChange={setSpecColor} style={{ width: '100%' }} options={specOptions.colors.map((s: string) => ({ value: s, label: s }))} /></Col>}
            </Row>
            <div style={{ marginTop: 20 }}><div style={{ marginBottom: 8, fontWeight: 'bold' }}>数量</div><InputNumber min={1} max={Math.min(buyTarget.stock, 99)} value={specQty} onChange={v => setSpecQty(v || 1)} style={{ width: '100%' }} /></div>
            <div style={{ background: '#fff7e6', borderRadius: 8, padding: '12px 16px', marginTop: 20, display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 15, color: '#666' }}>合计</span><span style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>¥{(buyTarget.price * specQty).toFixed(2)}</span></div>
          </div>
        )}
      </Modal>

      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px 50px' }}>
        <div>🏯 乌东文旅 · 衣·非遗商品 | © 2026 第6组</div>
      </Footer>
    </Layout>
  );
};

export default PublicProduct;
