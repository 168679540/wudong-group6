var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({ data: { list: [], traffic: [], type: '', buyTarget: null, ticketType: '成人票', qty: 1, visitDate: '', trafficDetail: null },
  onLoad() { this.load(); api.getTraffic({ pageSize: 10 }).then(r => { if (r.success) { var t = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); this.setData({ traffic: t }); } }); },
  load() { var p = { pageSize: 50 }; if (this.data.type) p.type = this.data.type; api.getTickets(p).then(r => { if (r.success) { var list = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); this.setData({ list: list }); } }); },
  setType(e) { this.setData({ type: e.currentTarget.dataset.t }); this.load(); },
  openTraffic(e) { var g = this.data.traffic.find(x => x.id == e.currentTarget.dataset.id); if (g) this.setData({ trafficDetail: g }); },
  closeTraffic() { this.setData({ trafficDetail: null }); },
  openBuy(e) { var t = this.data.list.find(x => x.id == e.currentTarget.dataset.id); if (!t) return; this.setData({ buyTarget: t, ticketType: '成人票', qty: 1, visitDate: '' }); },
  noop() {},
  closeBuy() { this.setData({ buyTarget: null }); },
  onTicketType(e) { this.setData({ ticketType: e.detail.value }); },
  onQty(e) { this.setData({ qty: Number(e.detail.value) || 1 }); },
  onVisitDate(e) { this.setData({ visitDate: e.detail.value }); },
  doBuy() { var t = this.data.buyTarget; if (!t) return; var name = t.name + ' ' + this.data.ticketType + ' ×' + this.data.qty; api.createOrder({ type: t.type, amount: Number(t.price) * this.data.qty, merchantId: t.merchantId, itemName: name, itemImage: t.coverImage }).then(r => { if (r.success) { wx.showToast({ title: '购买成功！' }); this.setData({ buyTarget: null }); } else { wx.showToast({ title: r.message || '失败', icon: 'none' }); } }).catch(() => wx.showToast({ title: '失败', icon: 'none' })); }
});
