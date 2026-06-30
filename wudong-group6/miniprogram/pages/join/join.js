var api = require('../../utils/api');
Page({ data: { modules: [{ value: '衣', label: '衣·非遗商品' }, { value: '食', label: '食·餐饮美食' }, { value: '住', label: '住·民宿住宿' }, { value: '行', label: '行·线路门票' }], moduleIndex: 0, shopName: '', contactName: '', contactPhone: '' },
  onModule(e) { this.setData({ moduleIndex: e.detail.value }); },
  onShopName(e) { this.setData({ shopName: e.detail.value }); },
  onContactName(e) { this.setData({ contactName: e.detail.value }); },
  onContactPhone(e) { this.setData({ contactPhone: e.detail.value }); },
  submit() { var d = this.data; if (!d.shopName || !d.contactName || !d.contactPhone) { wx.showToast({ title: '请填写完整', icon: 'none' }); return; } api.applyMerchant({ userId: 1, shopName: d.shopName, module: d.modules[d.moduleIndex].value, contactName: d.contactName, contactPhone: d.contactPhone }).then(r => { if (r.success) { wx.showToast({ title: '申请已提交！' }); } else { wx.showToast({ title: r.message || '提交失败', icon: 'none' }); } }); }
});
