var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({ data: { list: [], bookTarget: null, checkIn: '', checkOut: '', roomType: '标准间', rooms: 1 },
  onLoad() { api.getHomestays({ pageSize: 50 }).then(r => { if (r.success) { var list = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); this.setData({ list: list }); } }); },
  openBook(e) { var h = this.data.list.find(x => x.id == e.currentTarget.dataset.id); if (!h) return; this.setData({ bookTarget: h, checkIn: '', checkOut: '', roomType: '标准间', rooms: 1 }); },
  noop() {},
  closeBook() { this.setData({ bookTarget: null }); },
  onCheckIn(e) { this.setData({ checkIn: e.detail.value }); },
  onCheckOut(e) { this.setData({ checkOut: e.detail.value }); },
  onRoomType(e) { this.setData({ roomType: e.detail.value }); },
  onRooms(e) { this.setData({ rooms: Number(e.detail.value) || 1 }); },
  doBook() { var h = this.data.bookTarget; if (!h) return; if (!this.data.checkIn || !this.data.checkOut) { wx.showToast({ title: '请选择日期', icon: 'none' }); return; } var nights = 1; try { var d1 = new Date(this.data.checkIn), d2 = new Date(this.data.checkOut); nights = Math.max(1, Math.round((d2 - d1) / 86400000)); } catch(_){} var total = Number(h.pricePerNight) * nights * this.data.rooms; var desc = h.name + ' ' + this.data.roomType + ' ' + nights + '晚×' + this.data.rooms + '间'; api.createOrder({ type: '住宿', amount: total, merchantId: h.merchantId, itemName: desc, itemImage: h.coverImage }).then(r => { if (r.success) { wx.showToast({ title: '预订成功！' }); this.setData({ bookTarget: null }); } else { wx.showToast({ title: r.message || '失败', icon: 'none' }); } }).catch(() => wx.showToast({ title: '预订失败', icon: 'none' })); }
});
