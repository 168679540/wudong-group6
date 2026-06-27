import axios from 'axios';

const request = axios.create({
  baseURL: 'http://127.0.0.1:7001/api',
  timeout: 30000,
});

// 请求拦截器 - 添加 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 统一处理错误
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default request;