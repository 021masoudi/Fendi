import axios from 'axios';

const api = axios.create({
  baseURL: '/wp-json/fendi/v1',
  headers: {
    'X-WP-Nonce': window.wpApiSettings.nonce,
  },
});

export const getSuppliers = () => api.get('/suppliers');
export const createSupplier = (data) => api.post('/suppliers', data);
export const updateSupplier = (id, data) => api.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => api.delete(`/suppliers/${id}`);

export const getPurchaseOrders = () => api.get('/purchase-orders');
export const createPurchaseOrder = (data) => api.post('/purchase-orders', data);
export const updatePurchaseOrder = (id, data) => api.put(`/purchase-orders/${id}`, data);
export const deletePurchaseOrder = (id) => api.delete(`/purchase-orders/${id}`);

export const getFinancialReports = (startDate, endDate) => api.get('/financial-reports', { params: { start_date: startDate, end_date: endDate } });

export const getProducts = (search = '') => api.get(`/products?s=${search}`);

export const getNotifications = () => api.get('/notifications');

export const getExpenses = () => api.get('/expenses');
export const createExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export const getTransactions = () => api.get('/transactions');
export const createTransaction = (data) => api.post('/transactions', data);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

export const getLedger = (account) => api.get(`/ledger/${account}`);
export const getBalanceSheet = () => api.get('/balance-sheet');

export const getSmsSettings = () => api.get('/settings/sms');
export const saveSmsSettings = (data) => api.post('/settings/sms', data);

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
  createOrder(data) {
    return api.post('/orders', data);
  },
  getMe() {
    return api.get('/me');
  },
  getOrders(params) {
    return api.get('/orders', { params });
  },
  getStockRequests() {
    return api.get('/stock-requests');
  },
  createStockRequest(data) {
    return api.post('/stock-requests', data);
  },
  updateStockRequest(id, data) {
    return api.put(`/stock-requests/${id}`, data);
  },
};
