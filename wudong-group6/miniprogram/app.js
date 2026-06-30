App({
  globalData: { baseURL: 'http://127.0.0.1:7001/api', cart: [], userId: 1 },
  onLaunch() {
    const cart = wx.getStorageSync('wudong_cart') || [];
    this.globalData.cart = cart;
  }
});
