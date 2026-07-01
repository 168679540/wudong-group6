var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({ data: { list: [], detail: null, reviews: [], reviewLoading: false, myComment: '', submitting: false, bookTarget: null, checkIn: '', checkOut: '', roomType: '标准间', rooms: 1 },
  onLoad() { var that = this; api.getHomestays({ pageSize: 50 }).then(function(r) { if (r.success) { var list = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); that.setData({ list: list }); } }); },
  // 详情+评价
  openDetail(e) { var id = e.currentTarget.dataset.id; var h = this.data.list.find(function(x) { return x.id == id; }); if (!h) return;
    this.setData({ detail: h, reviews: [], reviewLoading: true, myComment: '' });
    var that = this;
    api.getReviews('homestay', h.id).then(function(res) { if (res.success) that.setData({ reviews: res.data || [] }); }).catch(function(){}).finally(function() { that.setData({ reviewLoading: false }); });
  },
  closeDetail() { this.setData({ detail: null, reviews: [] }); },
  onMyComment(e) { this.setData({ myComment: e.detail.value }); },
  submitReview() { var that = this; var detailId = this.data.detail.id;
    if (!this.data.myComment.trim()) return;
    this.setData({ submitting: true });
    api.createReview('homestay', { homestayId: detailId, rating: 5, content: this.data.myComment.trim() }).then(function(r) {
      if (r.success) { wx.showToast({ title: '评价成功' }); that.setData({ myComment: '' });
        api.getReviews('homestay', detailId).then(function(res) { if (res.success) that.setData({ reviews: res.data || [], reviewLoading: false }); });
      } else { wx.showToast({ title: r.message || '失败', icon: 'none' }); }
    }).catch(function(){ wx.showToast({ title: '评价失败', icon: 'none' }); }).finally(function() { that.setData({ submitting: false }); });
  },
  bookFromDetail() { var h = this.data.detail; this.setData({ detail: null }); if (h) this.openBookById(h.id); },
  // 预订
  openBookById(id) { var h = this.data.list.find(function(x) { return x.id == id; }); if (!h) return; this.setData({ bookTarget: h, checkIn: '', checkOut: '', roomType: '标准间', rooms: 1 }); },
  openBook(e) { this.openBookById(e.currentTarget.dataset.id); },
  noop() {},
  closeBook() { this.setData({ bookTarget: null }); },
  onCheckIn(e) { this.setData({ checkIn: e.detail.value }); },
  onCheckOut(e) { this.setData({ checkOut: e.detail.value }); },
  onRoomType(e) { this.setData({ roomType: e.detail.value }); },
  onRooms(e) { this.setData({ rooms: Number(e.detail.value) || 1 }); },
  doBook() { var h = this.data.bookTarget; if (!h) return; if (!this.data.checkIn || !this.data.checkOut) { wx.showToast({ title: '请选择日期', icon: 'none' }); return; }
    var nights = 1; try { var d1 = new Date(this.data.checkIn), d2 = new Date(this.data.checkOut); nights = Math.max(1, Math.round((d2 - d1) / 86400000)); } catch(_){}
    var total = Number(h.pricePerNight) * nights * this.data.rooms;
    var desc = h.name + ' ' + this.data.roomType + ' ' + nights + '晩×' + this.data.rooms + '间';
    var that = this;
    api.createOrder({ type: '住宿', amount: total, merchantId: h.merchantId, itemName: desc, itemImage: h.coverImage }).then(function(r) {
      if (r.success) { wx.showToast({ title: '预订成功！' }); that.setData({ bookTarget: null }); } else { wx.showToast({ title: r.message || '失败', icon: 'none' }); }
    }).catch(function() { wx.showToast({ title: '预订失败', icon: 'none' }); });
  }
});
