var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({ data: { list: [] },
  onShow() { api.getFavorites('product').then(r => { if (r.success) { var favs = r.data || []; var tasks = favs.map(function(f) { return api.getProductDetail(f.targetId).then(function(p) { if (p.success) { p.data.coverImage = fixImg(p.data.coverImage); return p.data; } return null; }).catch(function() { return null; }); }); Promise.all(tasks).then(function(products) { this.setData({ list: products.filter(function(p) { return p; }) }); }.bind(this)); } }); },
  unfav(e) { api.toggleFav('product', e.currentTarget.dataset.id).then(r => { if (r.success) { wx.showToast({ title: '已取消收藏' }); this.onShow(); } }); }
});
