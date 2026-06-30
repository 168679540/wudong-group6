var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({
  data: {
    banners: [],
    modules: [
      { key: 'product', name: '衣·非遗', icon: '👕', url: '/pages/product/product' },
      { key: 'food', name: '食·美食', icon: '🍽️', url: '/pages/food/food' },
      { key: 'homestay', name: '住·民宿', icon: '🏠', url: '/pages/homestay/homestay' },
      { key: 'tickets', name: '行·门票', icon: '🎫', url: '/pages/tickets/tickets' },
      { key: 'community', name: '社区', icon: '📸', url: '/pages/community/community' },
      { key: 'mine', name: '我的', icon: '👤', url: '/pages/mine/mine' },
    ],
    hotProducts: [],
    statCards: [{ label: '入驻商家', num: 0 }, { label: '商品', num: 20 }, { label: '游记', num: 0 }, { label: '用户', num: 0 }],
  },
  onLoad() {
    api.getBanners().then(r => r.success && this.setData({ banners: r.data }));
    api.getProducts({ pageSize: 6 }).then(r => { if (r.success) { var list = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); this.setData({ hotProducts: list }); } });
    api.getNotes({ pageSize: 6 }).then(r => r.success && this.setData({ statCards: this.data.statCards.map((c, i) => i === 2 ? { ...c, num: r.total } : c) }));
    api.getStats().then(r => r.success && this.setData({ statCards: this.data.statCards.map((c, i) => i === 0 ? { ...c, num: r.data.totalMerchants } : i === 3 ? { ...c, num: r.data.totalUsers } : c) }));
  },
  goPage(e) { var url = e.currentTarget.dataset.url; url && wx.switchTab({ url }).catch(function() { wx.navigateTo({ url: url }); }); }
});
