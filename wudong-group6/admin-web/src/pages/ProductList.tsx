import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Spin, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { getProductList, Product } from '../api/product';
import { createOrder } from '../api/order';

const catColors: Record<string, string> = { '银饰': 'blue', '蜡染': 'green', '刺绣': 'orange', '服饰': 'purple', '其他': 'default' };
const cats = ['全部', '银饰', '蜡染', '刺绣', '服饰'];

const ProductList: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('');

  useEffect(() => {
    setLoading(true);
    getProductList({ category: cat || undefined, pageSize: 50 }).then((r: any) => {
      if (r.success) setData(r.data);
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, [cat]);

  const handleBuy = async (p: Product) => {
    try {
      const res: any = await createOrder({ type: '商品', amount: p.price, merchantId: p.merchantId });
      if (res.success) message.success(`已下单：${p.name}（${res.data.orderNo}）`);
    } catch { message.error('下单失败'); }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;

  return (
    <div>
      <h2>非遗商品（衣）</h2>
      <div style={{ marginBottom: 16 }}>{cats.map(c => <Tag key={c} color={c === (cat || '全部') ? '#1890ff' : 'default'} style={{ cursor: 'pointer' }} onClick={() => setCat(c === '全部' ? '' : c)}>{c}</Tag>)}</div>
      <Row gutter={[16, 16]}>
        {data.map(p => (
          <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
            <Card hoverable cover={<img alt={p.name} src={p.coverImage} style={{ height: 200, objectFit: 'cover' }} />}
              actions={[
                <ShoppingCartOutlined key="buy" onClick={() => handleBuy(p)} title="下单" />,
                <EyeOutlined key="view" />,
              ]}>
              <Card.Meta title={p.name} description={<><Tag color={catColors[p.category] || 'default'}>{p.category}</Tag><span style={{ color: '#f5222d', fontSize: 18, fontWeight: 'bold' }}>¥{p.price}</span><br /><span style={{ color: '#999' }}>销量 {p.sales}</span></>} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;
