import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Spin, Empty, Button, message, Tag } from 'antd';
import { HeartFilled, ArrowLeftOutlined, ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getFavorites, toggleFavorite } from '../api/favorite';
import { getProductDetail, Product } from '../api/product';
import CartDrawer from '../components/CartDrawer';

const { Header, Content, Footer } = Layout;

const catColors: Record<string, string> = { '银饰': 'blue', '蜡染': 'green', '刺绣': 'orange', '服饰': 'purple', '其他': 'default' };

const MyFavorites: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

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

  return (
    <Layout>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }} onClick={() => navigate('/pc')}>🏯 乌东文旅</div>
        <Menu mode="horizontal" defaultSelectedKeys={['fav']} style={{ border: 'none' }}
          items={[{ key: 'home', label: '首页', icon: <ArrowLeftOutlined /> },{ key: 'fav', label: '我的收藏', icon: <HeartFilled style={{ color: '#ff4d4f' }} /> }]}
          onClick={({ key }) => { if (key === 'home') navigate('/pc'); }} />
        <CartDrawer />
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
                    cover={<img alt={p.name} src={p.coverImage} style={{ height: 220, objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200'; }} />}
                    actions={[
                      <Button type="link" icon={<EyeOutlined />} onClick={() => navigate('/pc/product')}>查看</Button>,
                      <Button type="link" danger icon={<HeartFilled />} onClick={() => handleUnfav(p)}>取消收藏</Button>,
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
      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px 50px' }}>
        <div>🏯 乌东文旅 · 我的收藏 | © 2026 第6组</div>
      </Footer>
    </Layout>
  );
};

export default MyFavorites;
