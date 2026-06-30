var api = require('../../utils/api');
Page({ data: { list: [] },
  onLoad() { api.getHomestays({ pageSize: 50 }).then(r => r.success && this.setData({ list: r.data })); },
  book(e) { var h = this.data.list.find(x => x.id === e.currentTarget.dataset.id); h && api.createOrder({ type: '住宿', amount: Number(h.pricePerNight), merchantId: h.merchantId, itemName: h.name, itemImage: h.coverImage }).then(r => { if (r.success) wx.showToast({ title: '预订成功！' }); else wx.showToast({ title: r.message || '失败', icon: 'none' }); }); }
});
