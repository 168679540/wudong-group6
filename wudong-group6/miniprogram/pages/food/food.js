var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({ data: { list: [], agro: [], detail: null, reviews: [], reviewLoading: false, myComment: '', submitting: false, bookTarget: null, partySize: 2, reserveDate: '' },
  onLoad() {
    api.getRestaurants({ pageSize: 50 }).then(function(r) {
      if (r.success) { var list = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); this.setData({ list: list }); }
    }.bind(this));
    api.getAgroProducts({ pageSize: 50 }).then(function(r) {
      if (r.success) { var agro = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); this.setData({ agro: agro }); }
    }.bind(this));
  },

  // 详情
  openDetail(e) { var id = e.currentTarget.dataset.id; var r = this.data.list.find(function(x) { return x.id == id; }); if (!r) return;
    this.setData({ detail: r, reviews: [], reviewLoading: true, myComment: '' });
    api.getReviews('restaurant', r.id).then(function(res) { if (res.success) this.setData({ reviews: res.data || [] }); }.bind(this)).catch(function(){}).finally(function() { this.setData({ reviewLoading: false }); }.bind(this));
  },
  closeDetail() { this.setData({ detail: null, reviews: [] }); },
  bookFromDetail() { var r = this.data.detail; this.setData({ detail: null }); if (r) this.openBookById(r.id); },
  onMyComment(e) { this.setData({ myComment: e.detail.value }); },
  submitReview() { var that = this; if (!this.data.myComment.trim()) return;
    this.setData({ submitting: true });
    api.createReview('restaurant', { restaurantId: this.data.detail.id, rating: 5, content: this.data.myComment.trim() }).then(function(r) {
      if (r.success) { wx.showToast({ title: '评价成功' }); that.setData({ myComment: '' }); that.openDetail({ currentTarget: { dataset: { id: that.data.detail.id } } }); } else { wx.showToast({ title: r.message || '失败', icon: 'none' }); }
    }).catch(function(){ wx.showToast({ title: '评价失败', icon: 'none' }); }).finally(function() { that.setData({ submitting: false }); });
  },

  // 预订
  openBookById(id) { var r = this.data.list.find(function(x) { return x.id == id; }); if (!r) return; this.setData({ bookTarget: r, partySize: 2, reserveDate: '' }); },
  openBook(e) { this.openBookById(e.currentTarget.dataset.id); },
  noop() {},
  closeBook() { this.setData({ bookTarget: null }); },
  onPartySize(e) { this.setData({ partySize: Number(e.detail.value) || 2 }); },
  onReserveDate(e) { this.setData({ reserveDate: e.detail.value }); },
  doBook() { var r = this.data.bookTarget; if (!r) return; if (!this.data.reserveDate) { wx.showToast({ title: '请选择日期', icon: 'none' }); return; }
    var total = Number(r.avgPrice) * this.data.partySize;
    api.createOrder({ type: '餐位', amount: total, merchantId: r.merchantId || r.id, itemName: r.name + ' ' + this.data.partySize + '人', itemImage: r.coverImage }).then(function(r2) {
      if (r2.success) { wx.showToast({ title: '预订成功！' }); this.setData({ bookTarget: null }); } else { wx.showToast({ title: r2.message || '失败', icon: 'none' }); }
    }.bind(this)).catch(function() { wx.showToast({ title: '预订失败', icon: 'none' }); });
  },
  buyAgro(e) { var a = this.data.agro.find(function(x) { return x.id == e.currentTarget.dataset.id; });
    a && api.createOrder({ type: '商品', amount: Number(a.price), merchantId: a.merchantId, itemName: a.name, itemImage: a.coverImage }).then(function(r) {
      if (r.success) wx.showToast({ title: '购买成功！' }); else wx.showToast({ title: r.message || '失败', icon: 'none' });
    });
  }
});
