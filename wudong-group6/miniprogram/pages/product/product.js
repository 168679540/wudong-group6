var api = require('../../utils/api');
Page({ data: { list: [], cats: ['全部'], cat: '', minPrice: '', maxPrice: '' },
  onLoad() { api.getCategories().then(r => r.success && this.setData({ cats: ['全部', ...r.data.map(c => c.name)] })); this.load(); },
  load() { var p = { pageSize: 50 }; if (this.data.cat) p.category = this.data.cat; if (this.data.minPrice) p.minPrice = Number(this.data.minPrice); if (this.data.maxPrice) p.maxPrice = Number(this.data.maxPrice); api.getProducts(p).then(r => r.success && this.setData({ list: r.data || [] })); },
  setCat(e) { var c = e.currentTarget.dataset.c; this.setData({ cat: c === '全部' ? '' : c }); this.load(); },
  onMin(e) { this.setData({ minPrice: e.detail.value }); this.load(); },
  onMax(e) { this.setData({ maxPrice: e.detail.value }); this.load(); },
  buyNow(e) { var id = e.currentTarget.dataset.id; api.createOrder({ type: '商品', amount: 0, itemName: '', itemImage: '' }).then(() => {}); api.getProductDetail(id).then(r => { if (r.success) { var p = r.data; api.createOrder({ type: '商品', amount: Number(p.price), merchantId: p.merchantId, itemName: p.name, itemImage: p.coverImage }).then(r2 => { if (r2.success) { wx.showToast({ title: '购买成功！' }); } else { wx.showToast({ title: r2.message || '下单失败', icon: 'none' }); } }).catch(() => wx.showToast({ title: '下单失败', icon: 'none' })); } }); }
});
