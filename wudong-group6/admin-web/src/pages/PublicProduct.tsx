import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Tag, Spin, message, Button, Input, Modal, Image, Descriptions } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, SearchOutlined, ArrowLeftOutlined, SkinOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getProductList, Product } from '../api/product';
import { createOrder } from '../api/order';

const { Header, Content, Footer } = Layout;

const catColors: Record<string, string> = { '银饰': 'blue', '蜡染': 'green', '刺绣': 'orange', '服饰': 'purple', '其他': 'default' };
const cats = ['全部', '银饰', '蜡染', '刺绣', '服饰'];

const PublicProduct: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<Product | null>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductList({ category: cat || undefined, keyword: search || undefined, pageSize: 50 }).then((r: any) => {
      if (r.success) setData(r.data || []);
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, [cat, search]);

  const handleBuy = async (p: Product) => {
    setBuying(true);
    try {
      const res: any = await createOrder({ type: '商品', amount: p.price, merchantId: p.merchantId, itemName: p.name, itemImage: p.coverImage });
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
        <Menu mode="horizontal" defaultSelectedKeys={['product']} style={{ border: 'none' }}
          items={[
            { key: 'home', label: '首页', icon: <ArrowLeftOutlined /> },
            { key: 'product', label: '衣·非遗商品', icon: <SkinOutlined /> },
          ]}
          onClick={({ key }) => { if (key === 'home') navigate('/pc'); }}
        />
      </Header>

      <Content style={{ padding: '32px 80px', minHeight: '80vh', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ margin: 0 }}>🛍️ 衣·非遗商品</h2>
            <Input.Search
              placeholder="搜索非遗商品..."
              allowClear
              style={{ width: 320 }}
              onSearch={setSearch}
              prefix={<SearchOutlined />}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            {cats.map(c => (
              <Tag
                key={c}
                color={c === (cat || '全部') ? '#1890ff' : 'default'}
                style={{ cursor: 'pointer', padding: '4px 16px', fontSize: 14, marginBottom: 8 }}
                onClick={() => setCat(c === '全部' ? '' : c)}
              >
                {c}
              </Tag>
            ))}
          </div>

          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> : (
            <Row gutter={[20, 20]}>
              {data.map(p => (
                <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: 'relative' }}>
                        <img alt={p.name} src={p.coverImage || 'https://via.placeholder.com/300x200?text=非遗商品'} style={{ height: 220, objectFit: 'cover', width: '100%' }} />
                        {p.sales > 50 && <Tag color="red" style={{ position: 'absolute', top: 8, right: 8 }}>热销</Tag>}
                      </div>
                    }
                    actions={[
                      <Button type="link" icon={<EyeOutlined />} onClick={() => setDetail(p)}>详情</Button>,
                      <Button type="primary" icon={<ShoppingCartOutlined />} loading={buying} onClick={() => handleBuy(p)}>立即购买</Button>,
                    ]}
                  >
                    <Card.Meta
                      title={<span style={{ fontSize: 16 }}>{p.name}</span>}
                      description={
                        <div>
                          <Tag color={catColors[p.category] || 'default'}>{p.category}</Tag>
                          <div style={{ marginTop: 8 }}>
                            <span style={{ color: '#f5222d', fontSize: 22, fontWeight: 'bold' }}>¥{p.price}</span>
                            <span style={{ color: '#999', marginLeft: 12 }}>已售 {p.sales} 件</span>
                          </div>
                          <p style={{ color: '#666', marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
                            {p.description?.slice(0, 60)}{(p.description?.length || 0) > 60 ? '...' : ''}
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
                    <SkinOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                    <p style={{ fontSize: 16 }}>暂无商品，请尝试其他分类或搜索关键词</p>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </div>
      </Content>

      {/* 商品详情弹窗 */}
      <Modal
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={[
          <Button key="back" onClick={() => setDetail(null)}>返回</Button>,
          <Button key="buy" type="primary" icon={<ShoppingCartOutlined />} loading={buying}
            onClick={() => detail && handleBuy(detail)}>
            立即购买 ¥{detail?.price}
          </Button>,
        ]}
        width={720}
        title={detail?.name}
      >
        {detail && (
          <div>
            <img src={detail.coverImage || 'https://via.placeholder.com/600x400?text=非遗商品'} alt={detail.name}
              style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="分类"><Tag color={catColors[detail.category] || 'default'}>{detail.category}</Tag></Descriptions.Item>
              <Descriptions.Item label="价格"><span style={{ color: '#f5222d', fontSize: 20, fontWeight: 'bold' }}>¥{detail.price}</span></Descriptions.Item>
              <Descriptions.Item label="销量">{detail.sales} 件</Descriptions.Item>
              <Descriptions.Item label="库存">{detail.stock} 件</Descriptions.Item>
              <Descriptions.Item label="商品描述" span={2}>{detail.description || '暂无描述'}</Descriptions.Item>
            </Descriptions>
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
