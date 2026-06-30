var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({ data: { list: [], agro: [], bookTarget: null, partySize: 2, reserveDate: '', reserveTime: '', slots: [] },
  onLoad() {
    api.getRestaurants({ pageSize: 50 }).then(r => {
      if (r.success) { var list = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); this.setData({ list: list }); }
    });
    api.getAgroProducts({ pageSize: 50 }).then(r => {
      if (r.success) { var agro = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); this.setData({ agro: agro }); }
    });
  },
  openBook(e) { var r = this.data.list.find(x => x.id == e.currentTarget.dataset.id); if (!r) return; this.setData({ bookTarget: r, partySize: 2, reserveDate: '', reserveTime: '', slots: [] }); },
  closeBook() { this.setData({ bookTarget: null }); },
  onPartySize(e) { this.setData({ partySize: Number(e.detail.value) || 2 }); },
  onReserveDate(e) { this.setData({ reserveDate: e.detail.value }); },
  onReserveTime(e) { this.setData({ reserveTime: e.detail.value }); },
  doBook() { var r = this.data.bookTarget; if (!r) return; if (!this.data.reserveDate) { wx.showToast({ title: '请选择日期', icon: 'none' }); return; }
    var total = Number(r.avgPrice) * this.data.partySize;
    var timeStr = this.data.reserveTime || ''; var desc = r.name + ' ' + this.data.partySize + '人'; if (timeStr) desc += ' ' + timeStr;
    api.createOrder({ type: '餐位', amount: total, merchantId: r.merchantId || r.id, itemName: desc, itemImage: r.coverImage }).then(r2 => {
      if (r2.success) { wx.showToast({ title: '预订成功！' }); this.setData({ bookTarget: null }); } else { wx.showToast({ title: r2.message || '失败', icon: 'none' }); }
    }).catch(() => wx.showToast({ title: '预订失败', icon: 'none' }));
  },
  buyAgro(e) { var a = this.data.agro.find(x => x.id == e.currentTarget.dataset.id);
    a && api.createOrder({ type: '商品', amount: Number(a.price), merchantId: a.merchantId, itemName: a.name, itemImage: a.coverImage }).then(r => {
      if (r.success) wx.showToast({ title: '购买成功！' }); else wx.showToast({ title: r.message || '失败', icon: 'none' });
    });
  }
});
