import React, { useState } from 'react';
import { Drawer, List, Button, InputNumber, Empty, Space, Popconfirm, message, Tag, Alert } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, DollarOutlined } from '@ant-design/icons';
import { useCart } from './CartContext';
import { createOrder } from '../api/order';
import { getProductDetail } from '../api/product';

const CartDrawer: React.FC = () => {
  const { items, count, total, updateQuantity, removeItem, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [invalidItems, setInvalidItems] = useState<string[]>([]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setPaying(true);
    setInvalidItems([]);

    // 校验库存和状态
    const invalid: string[] = [];
    const valid: typeof items = [];

    for (const item of items) {
      try {
        const res: any = await getProductDetail(item.productId);
        const p = res?.data;
        if (!p || p.status !== 1) { invalid.push(`${item.name} (已下架)`); continue; }
        if (p.stock < item.quantity) { invalid.push(`${item.name} (库存不足，仅剩${p.stock}件)`); continue; }
        valid.push(item);
      } catch { invalid.push(`${item.name} (校验失败)`); }
    }

    if (invalid.length > 0) {
      setInvalidItems(invalid);
      message.warning('部分商品无法结算，已标红提示');
      setPaying(false);
      return;
    }

    // 创建订单
    try {
      for (const item of valid) {
        const specDesc = Object.entries(item.specs).map(([k, v]) => `${k}${v}`).join(' ');
        await createOrder({
          type: '商品',
          amount: item.price * item.quantity,
          merchantId: item.merchantId,
          itemName: `${item.name} ${specDesc}`.trim(),
          itemImage: item.image,
        });
      }
      message.success(`成功创建 ${valid.length} 笔订单！`);
      clearCart();
      setOpen(false);
    } catch { message.error('结算失败，请稍后重试'); }
    finally { setPaying(false); }
  };

  return (
    <>
      <Button
        type="text"
        icon={<ShoppingCartOutlined style={{ fontSize: 22 }} />}
        onClick={() => { setOpen(true); setInvalidItems([]); }}
        style={{ position: 'relative' }}
      >
        {count > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            background: '#ff4d4f', color: '#fff', borderRadius: '50%',
            width: 18, height: 18, fontSize: 11, lineHeight: '18px', textAlign: 'center',
          }}>{count > 99 ? '99+' : count}</span>
        )}
      </Button>

      <Drawer
        title={`🛒 购物车 (${count}件)`}
        open={open}
        onClose={() => setOpen(false)}
        width={420}
        footer={
          items.length > 0 ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>合计 <span style={{ color: '#f5222d', fontSize: 22, fontWeight: 'bold' }}>¥{total.toFixed(2)}</span></span>
              <Space>
                <Popconfirm title="确定清空？" onConfirm={clearCart}><Button size="small">清空</Button></Popconfirm>
                <Button type="primary" size="large" icon={<DollarOutlined />} loading={paying} onClick={handleCheckout}>去结算</Button>
              </Space>
            </div>
          ) : undefined
        }
      >
        {invalidItems.length > 0 && (
          <Alert type="error" showIcon style={{ marginBottom: 12 }}
            message="以下商品无法购买" description={invalidItems.map((s, i) => <div key={i}>• {s}</div>)} />
        )}
        {items.length === 0 ? (
          <Empty description="购物车空空如也，去逛逛吧" />
        ) : (
          <List
            dataSource={items}
            renderItem={item => {
              const isInvalid = invalidItems.some(x => x.includes(item.name));
              return (
                <List.Item
                  style={isInvalid ? { background: '#fff1f0', borderRadius: 6, padding: 8 } : {}}
                  extra={
                    <img src={item.image} alt={item.name} style={{ width: 60, height: 60, borderRadius: 6, objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60'; }} />
                  }
                  actions={[
                    <Button key="del" size="small" danger icon={<DeleteOutlined />} onClick={() => removeItem(item.uid)} />,
                  ]}
                >
                  <List.Item.Meta
                    title={<span style={isInvalid ? { color: '#ff4d4f' } : {}}>{item.name}</span>}
                    description={
                      <>
                        {Object.entries(item.specs).map(([k, v]) => <Tag key={k} style={{ marginBottom: 4 }}>{k}: {v}</Tag>)}
                        <br />
                        <span style={{ color: '#f5222d', fontWeight: 'bold', fontSize: 16 }}>¥{item.price}</span>
                      </>
                    }
                  />
                  <InputNumber min={1} max={99} value={item.quantity}
                    onChange={v => updateQuantity(item.uid, v || 1)} style={{ width: 70, marginRight: 8 }} />
                </List.Item>
              );
            }}
          />
        )}
      </Drawer>
    </>
  );
};

export default CartDrawer;
