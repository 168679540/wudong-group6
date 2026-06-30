var api = require('../../utils/api');
Page({ data: { list: [], cats: ['全部'], cat: '', minPrice: '', maxPrice: '', buyTarget: null, specQty: 1, specSize: '', specColor: '' },
  onLoad() { api.getCategories().then(r => r.success && this.setData({ cats: ['全部', ...r.data.map(c => c.name)] })); this.load(); },
  load() { var p = { pageSize: 50 }; if (this.data.cat) p.category = this.data.cat; if (this.data.minPrice) p.minPrice = Number(this.data.minPrice); if (this.data.maxPrice) p.maxPrice = Number(this.data.maxPrice); api.getProducts(p).then(r => r.success && this.setData({ list: r.data || [] })); },
  setCat(e) { var c = e.currentTarget.dataset.c; this.setData({ cat: c === '全部' ? '' : c }); this.load(); },
  onMin(e) { this.setData({ minPrice: e.detail.value }); this.load(); },
  onMax(e) { this.setData({ maxPrice: e.detail.value }); this.load(); },
  // 选规格购买
  openBuy(e) { var id = e.currentTarget.dataset.id; var p = this.data.list.find(x => x.id === id); if (!p) return; var specs = {}; try { if (p.specs) specs = typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs; } catch(_){} var sizes = specs['尺寸'] || specs['size'] || []; var colors = specs['颜色'] || specs['color'] || []; this.setData({ buyTarget: p, specQty: 1, specSize: sizes[0] || '', specColor: colors[0] || '' }); },
  closeBuy() { this.setData({ buyTarget: null }); },
  onSpecSize(e) { this.setData({ specSize: e.detail.value }); },
  onSpecColor(e) { this.setData({ specColor: e.detail.value }); },
  onQty(e) { this.setData({ specQty: Number(e.detail.value) || 1 }); },
  doBuy() { var p = this.data.buyTarget; if (!p) return; var specDesc = [this.data.specSize, this.data.specColor].filter(Boolean).join(' '); var name = p.name; if (specDesc) name += ' ' + specDesc; name += ' ×' + this.data.specQty; api.createOrder({ type: '商品', amount: Number(p.price) * this.data.specQty, merchantId: p.merchantId, itemName: name, itemImage: p.coverImage }).then(r2 => { if (r2.success) { wx.showToast({ title: '购买成功！' }); this.setData({ buyTarget: null }); } else { wx.showToast({ title: r2.message || '下单失败', icon: 'none' }); } }).catch(() => wx.showToast({ title: '下单失败', icon: 'none' })); }
});
