var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({ data: { list: [], traffic: [], type: '', detail: null, reviews: [], reviewLoading: false, myComment: '', submitting: false, buyTarget: null, ticketType: '成人票', qty: 1, visitDate: '', trafficDetail: null },
  onLoad() { this.load(); api.getTraffic({ pageSize: 10 }).then(function(r) { if (r.success) { var t = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); this.setData({ traffic: t }); } }.bind(this)); },
  load() { var p = { pageSize: 50 }; if (this.data.type) p.type = this.data.type; var that = this; api.getTickets(p).then(function(r) { if (r.success) { var list = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); that.setData({ list: list }); } }); },
  setType(e) { this.setData({ type: e.currentTarget.dataset.t }); this.load(); },
  openTraffic(e) { var g = this.data.traffic.find(function(x) { return x.id == e.currentTarget.dataset.id; }); if (g) this.setData({ trafficDetail: g }); },
  closeTraffic() { this.setData({ trafficDetail: null }); },
  noop() {},
  // 详情+评价
  openDetail(e) { var id = e.currentTarget.dataset.id; var t = this.data.list.find(function(x) { return x.id == id; }); if (!t) return;
    this.setData({ detail: t, reviews: [], reviewLoading: true, myComment: '' });
    var that = this;
    api.getReviews('ticket', t.id).then(function(res) { if (res.success) that.setData({ reviews: res.data || [] }); }).catch(function(){}).finally(function() { that.setData({ reviewLoading: false }); });
  },
  closeDetail() { this.setData({ detail: null, reviews: [] }); },
  onMyComment(e) { this.setData({ myComment: e.detail.value }); },
  submitReview() { var that = this; var detailId = this.data.detail.id;
    if (!this.data.myComment.trim()) return;
    this.setData({ submitting: true });
    api.createReview('ticket', { ticketId: detailId, rating: 5, content: this.data.myComment.trim() }).then(function(r) {
      if (r.success) { wx.showToast({ title: '评价成功' }); that.setData({ myComment: '' });
        api.getReviews('ticket', detailId).then(function(res) { if (res.success) that.setData({ reviews: res.data || [], reviewLoading: false }); });
      } else { wx.showToast({ title: r.message || '失败', icon: 'none' }); }
    }).catch(function(){ wx.showToast({ title: '评价失败', icon: 'none' }); }).finally(function() { that.setData({ submitting: false }); });
  },
  buyFromDetail() { var t = this.data.detail; this.setData({ detail: null }); if (t) this.openBuyById(t.id); },
  // 购买
  openBuyById(id) { var t = this.data.list.find(function(x) { return x.id == id; }); if (!t) return; this.setData({ buyTarget: t, ticketType: '成人票', qty: 1, visitDate: '' }); },
  openBuy(e) { this.openBuyById(e.currentTarget.dataset.id); },
  closeBuy() { this.setData({ buyTarget: null }); },
  onTicketType(e) { this.setData({ ticketType: e.detail.value }); },
  onQty(e) { this.setData({ qty: Number(e.detail.value) || 1 }); },
  onVisitDate(e) { this.setData({ visitDate: e.detail.value }); },
  doBuy() { var t = this.data.buyTarget; if (!t) return; var name = t.name + ' ' + this.data.ticketType + ' ×' + this.data.qty; var that = this;
    api.createOrder({ type: t.type, amount: Number(t.price) * this.data.qty, merchantId: t.merchantId, itemName: name, itemImage: t.coverImage }).then(function(r) { if (r.success) { wx.showToast({ title: '购买成功！' }); that.setData({ buyTarget: null }); } else { wx.showToast({ title: r.message || '失败', icon: 'none' }); } }).catch(function() { wx.showToast({ title: '失败', icon: 'none' }); }); }
});
