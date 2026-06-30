var api = require('../../utils/api');
Page({ data: { list: [], traffic: [], type: '' },
  onLoad() { this.load(); api.getTraffic({ pageSize: 10 }).then(r => r.success && this.setData({ traffic: r.data })); },
  load() { var p = { pageSize: 50 }; if (this.data.type) p.type = this.data.type; api.getTickets(p).then(r => r.success && this.setData({ list: r.data })); },
  setType(e) { this.setData({ type: e.currentTarget.dataset.t }); this.load(); },
  buy(e) { var t = this.data.list.find(x => x.id === e.currentTarget.dataset.id); t && api.createOrder({ type: t.type, amount: Number(t.price), merchantId: t.merchantId, itemName: t.name, itemImage: t.coverImage }).then(r => { if (r.success) wx.showToast({ title: '购买成功！' }); else wx.showToast({ title: r.message || '失败', icon: 'none' }); }); }
});
