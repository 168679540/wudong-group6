const BASE = 'http://127.0.0.1:7001/api';

function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE + url,
      method,
      data,
      header: { 'Content-Type': 'application/json' },
      success(r) { resolve(r.data); },
      fail(e) { reject(e); }
    });
  });
}

module.exports = {
  get: (url, data) => request(url, 'GET', data),
  post: (url, data) => request(url, 'POST', data),
  // 商品
  getProducts: (params) => request('/product/list', 'GET', params),
  getProductDetail: (id) => request('/product/detail?id=' + id),
  // 餐厅
  getRestaurants: (params) => request('/restaurant/list', 'GET', params),
  // 民宿
  getHomestays: (params) => request('/homestay/list', 'GET', params),
  // 票务
  getTickets: (params) => request('/ticket/list', 'GET', params),
  // 游记
  getNotes: (params) => request('/community/note/list', 'GET', params),
  getNoteDetail: (id) => request('/community/note/detail?id=' + id),
  // 订单
  createOrder: (data) => request('/order/create', 'POST', data),
  getOrders: (params) => request('/order/list', 'GET', params),
  refundOrder: (id) => request('/order/refund', 'POST', { id }),
  // 收藏
  getFavorites: (type) => request('/favorite/list?type=' + type),
  toggleFav: (type, targetId) => request('/favorite/toggle', 'POST', { type, targetId }),
  // 评价
  getReviews: (type, id) => request(`/${type}-review/list?${type}Id=` + id),
  createReview: (type, data) => request(`/${type}-review/create`, 'POST', data),
  // 入驻
  applyMerchant: (data) => request('/merchant-application/create', 'POST', data),
  // 分类
  getCategories: () => request('/product-category/active'),
  getAgroCategories: () => request('/agro-category/active'),
  // 农产品
  getAgroProducts: (params) => request('/agro-product/list', 'GET', params),
  // 时段
  getMealSlots: (rid) => request('/meal-slot/list?restaurantId=' + rid),
  // 交通
  getTraffic: (params) => request('/traffic-guide/list', 'GET', params),
  // 轮播图
  getBanners: () => request('/banner/active'),
  // 统计
  getStats: () => request('/dashboard/stats'),
  // 评论/点赞
  addComment: (data) => request('/community/note/comment', 'POST', data),
  likeNote: (id) => request('/community/note/like', 'POST', { id }),
  publishNote: (data) => request('/community/note/create', 'POST', data),
  // 消息
  getMessages: (userId) => request('/message/list?userId=' + (userId || 1)),
};
