var api = require('../../utils/api');
Page({ data: { list: [], statusMap: { 0: '待支付', 1: '已支付', 2: '已发货', 3: '已完成', 4: '已取消' } },
  onShow() { api.getOrders({ pageSize: 50 }).then(r => r.success && this.setData({ list: r.data || [] })); },
  cancel(e) { api.refundOrder(e.currentTarget.dataset.id).then(r => { if (r.success) { wx.showToast({ title: '已取消' }); this.onShow(); } else wx.showToast({ title: r.message || '取消失败', icon: 'none' }); }); }
});
