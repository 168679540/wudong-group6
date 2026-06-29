import React, { useEffect, useState, useMemo } from 'react';
import { Layout, Menu, Card, Row, Col, Spin, Empty, Button, message, Tag, Modal, Select, InputNumber, Space } from 'antd';
import { HeartFilled, ArrowLeftOutlined, ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getFavorites, toggleFavorite } from '../api/favorite';
import { getProductDetail, Product } from '../api/product';
import { createOrder } from '../api/order';
import { useCart } from '../components/CartContext';
import CartDrawer from '../components/CartDrawer';

const { Header, Content, Footer } = Layout;
const catColors: Record<string, string> = { '银饰': 'blue', '蜡染': 'green', '刺绣': 'orange', '服饰': 'purple', '其他': 'default' };

const MyFavorites: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // 规格选择 + 购买
  const [buyTarget, setBuyTarget] = useState<Product | null>(null);
  const [specSize, setSpecSize] = useState('');
  const [specColor, setSpecColor] = useState('');
  const [specQty, setSpecQty] = useState(1);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    setLoading(true);
    getFavorites('product').then(async (r: any) => {
      if (r.success && r.data?.length) {
        const items = await Promise.all(r.data.map((f: any) =>
          getProductDetail(f.targetId).then((p: any) => p?.success ? p.data : null).catch(() => null)
        ));
        setProducts(items.filter(Boolean));
      }
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, []);

  const handleUnfav = async (p: Product) => {
    try {
      const res: any = await toggleFavorite('product', p.id);
      if (res.success && !res.data.favorited) {
        setProducts(prev => prev.filter(item => item.id !== p.id));
        message.success('已取消收藏');
      }
    } catch { message.error('操作失败'); }
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
          <Menu mode="horizontal" defaultSelectedKeys={['fav']} style={{ border: 'none' }}
            items={[{ key: 'home', label: '首页', icon: <ArrowLeftOutlined /> },{ key: 'fav', label: '我的收藏', icon: <HeartFilled style={{ color: '#ff4d4f' }} /> }]}
            onClick={({ key }) => { if (key === 'home') navigate('/pc'); }} />
          <CartDrawer />
        </Space>
      </Header>

      <Content style={{ padding: '32px 80px', minHeight: '80vh', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>❤️ 我的收藏 ({products.length}件)</h2>
          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> :
            products.length === 0 ? <Empty description="还没有收藏任何商品，去逛逛吧" /> :
            <Row gutter={[20, 20]}>
              {products.map(p => (
                <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                  <Card hoverable
                    cover={<div style={{ position: 'relative' }}>
                      <img alt={p.name} src={p.coverImage} style={{ height: 220, objectFit: 'cover', width: '100%' }} onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200'; }} />
                      <Button type="text" style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(255,255,255,.85)', borderRadius: '50%' }}
                        icon={<HeartFilled style={{ color: '#ff4d4f', fontSize: 18 }} />}
                        onClick={(e) => { e.stopPropagation(); handleUnfav(p); }} />
                    </div>}
                    actions={[
                      <Button type="link" icon={<EyeOutlined />} onClick={() => navigate('/pc/product')}>查看</Button>,
                      <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => openBuy(p)}>立即购买</Button>,
                    ]}>
                    <Card.Meta title={p.name}
                      description={<>
                        <Tag color={catColors[p.category] || 'default'}>{p.category}</Tag>
                        <div style={{ marginTop: 8 }}><span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>¥{p.price}</span></div>
                      </>} />
                  </Card>
                </Col>
              ))}
            </Row>
          }
        </div>
      </Content>

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
        <div>🏯 乌东文旅 · 我的收藏 | © 2026 第6组</div>
      </Footer>
    </Layout>
  );
};

export default MyFavorites;
