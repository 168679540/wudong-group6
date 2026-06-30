var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({ data: { list: [], statusMap: { 0: '待支付', 1: '已支付', 2: '已发货', 3: '已完成', 4: '已取消' } },
  onShow() { api.getOrders({ pageSize: 50 }).then(function(r) { if (r.success) { var list = (r.data || []).map(function(x) { x.itemImage = fixImg(x.itemImage); return x; }); this.setData({ list: list }); } }.bind(this)); },
  cancel(e) { api.refundOrder(e.currentTarget.dataset.id).then(function(r) { if (r.success) { wx.showToast({ title: '已取消' }); this.onShow(); } else { wx.showToast({ title: r.message || '取消失败', icon: 'none' }); } }.bind(this)); }
});
