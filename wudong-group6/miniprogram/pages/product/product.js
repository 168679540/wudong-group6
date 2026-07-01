var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({ data: { list: [], cats: ['全部'], cat: '', minPrice: '', maxPrice: '', detail: null, reviews: [], reviewLoading: false, myComment: '', submitting: false, buyTarget: null, specQty: 1, specSizes: [], specColors: [], specSizeIdx: 0, specColorIdx: 0 },
  onLoad() { var that = this; api.getCategories().then(function(r) { if (r.success) that.setData({ cats: ['全部', ...r.data.map(function(c) { return c.name; })] }); }); this.load(); },
  onShow() { var id = wx.getStorageSync('wudong_goto_product'); if (id) { wx.removeStorageSync('wudong_goto_product'); var that = this; this.tryOpenProduct(Number(id), 0); } },
  tryOpenProduct(id, retry) { var that = this; var p = this.data.list.find(function(x) { return x.id == id; }); if (p) { that.openDetail({ currentTarget: { dataset: { id: id } } }); } else if (retry < 15) { setTimeout(function() { that.tryOpenProduct(id, retry + 1); }, 300); } },
  load() { var p = { pageSize: 50 }; if (this.data.cat) p.category = this.data.cat; if (this.data.minPrice) p.minPrice = Number(this.data.minPrice); if (this.data.maxPrice) p.maxPrice = Number(this.data.maxPrice); var that = this; api.getProducts(p).then(function(r) { if (r.success) { var list = (r.data || []).map(function(item) { item.coverImage = fixImg(item.coverImage); return item; }); that.setData({ list: list }); } }); },
  setCat(e) { var c = e.currentTarget.dataset.c; this.setData({ cat: c === '全部' ? '' : c }); this.load(); },
  onMin(e) { this.setData({ minPrice: e.detail.value }); this.load(); },
  onMax(e) { this.setData({ maxPrice: e.detail.value }); this.load(); },
  openDetail(e) { var id = e.currentTarget.dataset.id; var p = this.data.list.find(function(x) { return x.id == id; }); if (p) { var d = Object.assign({}, p); d.coverImage = fixImg(d.coverImage); this.setData({ detail: d, reviews: [], reviewLoading: true, myComment: '' }); var that = this; api.getReviews('product', p.id).then(function(res) { if (res.success) that.setData({ reviews: res.data || [] }); }).catch(function(){}).finally(function() { that.setData({ reviewLoading: false }); }); } },
  closeDetail() { this.setData({ detail: null, reviews: [] }); },
  onMyComment(e) { this.setData({ myComment: e.detail.value }); },
  submitReview() { var that = this; var detailId = this.data.detail.id; if (!this.data.myComment.trim()) return; this.setData({ submitting: true }); api.createReview('product', { productId: detailId, rating: 5, content: this.data.myComment.trim() }).then(function(r) { if (r.success) { wx.showToast({ title: '评价成功' }); that.setData({ myComment: '' }); api.getReviews('product', detailId).then(function(res) { if (res.success) that.setData({ reviews: res.data || [], reviewLoading: false }); }); } else { wx.showToast({ title: r.message || '失败', icon: 'none' }); } }).catch(function(){ wx.showToast({ title: '评价失败', icon: 'none' }); }).finally(function() { that.setData({ submitting: false }); }); },
  buyFromDetail() { var p = this.data.detail; this.setData({ detail: null }); if (p) this.openBuyById(p.id); },
  openBuyById(id) { var p = this.data.list.find(function(x) { return x.id == id; }); if (!p) return;
    var specs = {}; try { if (p.specs) specs = typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs; } catch(_){}
    var sizes = specs['尺寸'] || specs['size'] || [];
    var colors = specs['颜色'] || specs['color'] || [];
    var bt = Object.assign({}, p); bt.coverImage = fixImg(bt.coverImage);
    this.setData({ buyTarget: bt, specQty: 1, specSizes: sizes, specColors: colors, specSizeIdx: 0, specColorIdx: 0 });
  },
  openBuy(e) { this.openBuyById(e.currentTarget.dataset.id); },
  noop() {},
  closeBuy() { this.setData({ buyTarget: null }); },
  addToCart(e) { var p = this.data.list.find(function(x) { return x.id == e.target.dataset.id; }); if (!p) { p = this.data.detail; if (!p) return; } var cart = wx.getStorageSync('wudong_cart') || []; var uid = 'p' + p.id; var exist = cart.find(function(x) { return x.uid === uid; }); if (exist) { exist.quantity = (exist.quantity || 1) + 1; } else { cart.push({ uid: uid, productId: p.id, name: p.name, image: p.coverImage, price: Number(p.price), quantity: 1, merchantId: p.merchantId }); } wx.setStorageSync('wudong_cart', cart); wx.showToast({ title: '已加入购物车' }); },
  onSizeChange(e) { this.setData({ specSizeIdx: Number(e.detail.value) }); },
  onColorChange(e) { this.setData({ specColorIdx: Number(e.detail.value) }); },
  onQty(e) { this.setData({ specQty: Number(e.detail.value) || 1 }); },
  doBuy() { var p = this.data.buyTarget; if (!p) return;
    var size = this.data.specSizes[this.data.specSizeIdx] || '';
    var color = this.data.specColors[this.data.specColorIdx] || '';
    var specDesc = [size, color].filter(Boolean).join(' '); var name = p.name; if (specDesc) name += ' ' + specDesc; name += ' ×' + this.data.specQty;
    var that = this;
    api.createOrder({ type: '商品', amount: Number(p.price) * this.data.specQty, merchantId: p.merchantId, itemName: name, itemImage: p.coverImage }).then(function(r2) { if (r2.success) { wx.showToast({ title: '购买成功！' }); that.setData({ buyTarget: null }); } else { wx.showToast({ title: r2.message || '下单失败', icon: 'none' }); } }).catch(function() { wx.showToast({ title: '下单失败', icon: 'none' }); });
  }
});
