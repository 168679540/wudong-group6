var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({ data: { items: [], total: 0 },
  onShow() { this.refresh(); },
  refresh() { var items = wx.getStorageSync('wudong_cart') || []; items = items.map(function(i) { i.image = fixImg(i.image); return i; }); var total = items.reduce(function(s, i) { return s + i.price * (i.quantity || 1); }, 0).toFixed(2); this.setData({ items: items, total: total }); },
  onQty(e) { var uid = e.currentTarget.dataset.uid; var qty = Number(e.detail.value) || 1; var items = this.data.items.map(function(i) { if (i.uid === uid) i.quantity = qty; return i; }); wx.setStorageSync('wudong_cart', items); this.refresh(); },
  remove(e) { var uid = e.currentTarget.dataset.uid; var items = this.data.items.filter(function(i) { return i.uid !== uid; }); wx.setStorageSync('wudong_cart', items); this.refresh(); },
  checkout() { var items = this.data.items; if (!items.length) return; wx.showLoading({ title: '结算中...' }); var tasks = items.map(function(i) { return api.createOrder({ type: '商品', amount: i.price * (i.quantity || 1), merchantId: i.merchantId, itemName: i.name + ' x' + (i.quantity || 1), itemImage: i.image }); }); var that = this; Promise.all(tasks).then(function() { wx.hideLoading(); wx.showToast({ title: '下单成功！' }); wx.setStorageSync('wudong_cart', []); that.refresh(); }).catch(function() { wx.hideLoading(); wx.showToast({ title: '结算失败', icon: 'none' }); }); }
});
