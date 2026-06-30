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
  showAnnouncement() { wx.showModal({ title: '📢 平台公告', content: '乌东文旅平台全新上线！\n\n欢迎探索苗族非遗文化——衣·非遗商品、食·餐饮美食、住·民宿住宿、行·线路门票、社区·游记分享，一站式体验乌东苗寨的衣食住行。\n\n新商家可点击首页底部「商家入驻申请」加入我们！', showCancel: false, confirmText: '我知道了' }); },
  goPage(e) { var url = e.currentTarget.dataset.url; url && wx.switchTab({ url }).catch(function() { wx.navigateTo({ url: url }); }); }
});
