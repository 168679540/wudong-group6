var api = require('../../utils/api');
Page({ data: { list: [] },
  onShow() { api.getFavorites('product').then(r => { if (r.success) { var favs = r.data || []; var tasks = favs.map(f => api.getProductDetail(f.targetId).then(p => p.success ? p.data : null).catch(() => null)); Promise.all(tasks).then(products => { this.setData({ list: products.filter(p => p) }); }); } }); },
  unfav(e) { api.toggleFav('product', e.currentTarget.dataset.id).then(r => { if (r.success) { wx.showToast({ title: '已取消收藏' }); this.onShow(); } }); }
});
