import axios from 'axios';

const baseURL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : (process.env.VITE_API_BASE_URL || 'http://localhost:5000/api');

export const api = axios.create({ baseURL });

export const ProductsApi = {
  list: () => api.get('/products').then(r => r.data),
  get: (id) => api.get(`/products/${id}`).then(r => r.data),
  create: (payload) => api.post('/products', payload).then(r => r.data),
  update: (id, payload) => api.patch(`/products/${id}`, payload).then(r => r.data),
};

export const OrdersApi = {
  list: () => api.get('/orders').then(r => r.data),
  create: (payload) => api.post('/orders', payload).then(r => r.data),
};


