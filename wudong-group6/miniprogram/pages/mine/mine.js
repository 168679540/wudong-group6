var api = require('../../utils/api');
Page({ data: { menus: [{ key: 'orders', label: '我的订单', icon: '📋', url: '/pages/orders/orders' }, { key: 'favorites', label: '我的收藏', icon: '❤️', url: '/pages/favorites/favorites' }, { key: 'join', label: '商家入驻', icon: '🏪', url: '/pages/join/join' }, { key: 'index', label: '返回首页', icon: '🏠', url: '/pages/index/index' }], messages: [], msgDetail: null },
  onShow() { api.getMessages(1).then(function(r) { if (r.success) this.setData({ messages: (r.data || []).slice(0, 10) }); }.bind(this)); },
  openMsg(e) { var id = e.currentTarget.dataset.id; var m = this.data.messages.find(function(x) { return x.id == id || String(x.id) == String(id); }); if (m) { this.setData({ msgDetail: m }); } },
  closeMsg() { this.setData({ msgDetail: null }); },
  goPage(e) { var url = e.currentTarget.dataset.url; url && wx.switchTab({ url }).catch(function() { wx.navigateTo({ url: url }); }); }
});
