var api = require('../../utils/api');
Page({ data: { list: [], agro: [] },
  onLoad() { api.getRestaurants({ pageSize: 50 }).then(r => r.success && this.setData({ list: r.data })); api.getAgroProducts({ pageSize: 50 }).then(r => r.success && this.setData({ agro: r.data })); },
  book(e) { var r = this.data.list.find(x => x.id === e.currentTarget.dataset.id); r && api.createOrder({ type: '餐位', amount: Number(r.avgPrice), merchantId: r.merchantId || r.id, itemName: r.name, itemImage: r.coverImage }).then(r2 => { if (r2.success) wx.showToast({ title: '预订成功！' }); else wx.showToast({ title: r2.message || '失败', icon: 'none' }); }); },
  buyAgro(e) { var a = this.data.agro.find(x => x.id === e.currentTarget.dataset.id); a && api.createOrder({ type: '商品', amount: Number(a.price), merchantId: a.merchantId, itemName: a.name, itemImage: a.coverImage }).then(r => { if (r.success) wx.showToast({ title: '购买成功！' }); else wx.showToast({ title: r.message || '失败', icon: 'none' }); }); }
});
