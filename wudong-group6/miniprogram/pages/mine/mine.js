var api = require('../../utils/api');
Page({ data: { menus: [{ key: 'orders', label: '我的订单', icon: '📋', url: '/pages/orders/orders' }, { key: 'favorites', label: '我的收藏', icon: '❤️', url: '/pages/favorites/favorites' }, { key: 'join', label: '商家入驻', icon: '🏪', url: '/pages/join/join' }, { key: 'index', label: '返回首页', icon: '🏠', url: '/pages/index/index' }], messages: [] },
  onShow() { api.getMessages(1).then(r => r.success && this.setData({ messages: (r.data || []).slice(0, 5) })); },
  goPage(e) { var url = e.currentTarget.dataset.url; url && wx.switchTab({ url }).catch(() => wx.navigateTo({ url })); }
});
