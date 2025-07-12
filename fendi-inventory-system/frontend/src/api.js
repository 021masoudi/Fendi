import axios from 'axios';

const api = axios.create({
  baseURL: '/wp-json/fendi/v1',
  headers: {
    'X-WP-Nonce': window.wpApiSettings.nonce,
  },
});

export default {
  getUsers() {
    return api.get('/users');
  },
  createUser(data) {
    return api.post('/users', data);
  },
  updateUser(id, data) {
    return api.put(`/users/${id}`, data);
  },
  deleteUser(id) {
    return api.delete(`/users/${id}`);
  },
  getWarehouses() {
    return api.get('/warehouses');
  },
  createWarehouse(data) {
    return api.post('/warehouses', data);
  },
  updateWarehouse(id, data) {
    return api.put(`/warehouses/${id}`, data);
  },
  deleteWarehouse(id) {
    return api.delete(`/warehouses/${id}`);
  },
  getProducts(search = '') {
    return api.get(`/products?s=${search}`);
  },
  createOrder(data) {
    return api.post('/orders', data);
  },
};
