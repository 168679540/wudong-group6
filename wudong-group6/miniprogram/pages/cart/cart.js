var api = require('../../utils/api');
Page({ data: { items: [], total: 0 },
  onShow() { var items = wx.getStorageSync('wudong_cart') || []; this.setData({ items: items, total: items.reduce((s, i) => s + i.price * (i.quantity || 1), 0).toFixed(2) }); },
  remove(e) { var items = this.data.items.filter(i => i.uid !== e.currentTarget.dataset.uid); wx.setStorageSync('wudong_cart', items); this.setData({ items: items, total: items.reduce((s, i) => s + i.price * (i.quantity || 1), 0).toFixed(2) }); },
  checkout() { var items = this.data.items; if (!items.length) return; wx.showLoading({ title: '结算中...' }); var tasks = items.map(i => api.createOrder({ type: '商品', amount: Number(i.price) * (i.quantity || 1), merchantId: i.merchantId, itemName: i.name, itemImage: i.image })); Promise.all(tasks).then(() => { wx.hideLoading(); wx.showToast({ title: '下单成功！' }); wx.setStorageSync('wudong_cart', []); this.setData({ items: [], total: 0 }); }).catch(() => { wx.hideLoading(); wx.showToast({ title: '结算失败', icon: 'none' }); }); }
});
