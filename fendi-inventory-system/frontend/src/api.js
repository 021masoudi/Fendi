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
};
