import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import api from './api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InventoryReport from './InventoryReport';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  useEffect(() => {
    api.getOrders({
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      user_id: selectedUser,
      warehouse_id: selectedWarehouse,
    }).then((response) => {
      setOrders(response.data);
    });
    api.getUsers().then((response) => {
      setUsers(response.data);
    });
    api.getWarehouses().then((response) => {
      setWarehouses(response.data);
    });
  }, [startDate, endDate, selectedUser, selectedWarehouse]);

  const getOrderProfit = (order) => {
    return order.line_items.reduce((total, item) => {
      const cost_price = item.meta_data.find(
        (meta) => meta.key === '_cost_price'
      );
      if (cost_price) {
        return total + (item.total - cost_price.value * item.quantity);
      }
      return total;
    }, 0);
  };

  const getChartData = () => {
    const data = {};
    orders.forEach((order) => {
      const date = new Date(order.date_created.date).toLocaleDateString();
      if (data[date]) {
        data[date] += order.total;
      } else {
        data[date] = order.total;
      }
    });
    return Object.keys(data).map((date) => ({ date, total: data[date] }));
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');
    XLSX.writeFile(workbook, 'sales_report.xlsx');
  };

  return (
    <div>
      <div className="flex border-b">
        <button
          className={`py-2 px-4 ${
            activeTab === 'sales' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={() => setActiveTab('sales')}
        >
          {__('Sales Report', 'fendi-inventory-system')}
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'inventory' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={() => setActiveTab('inventory')}
        >
          {__('Inventory Report', 'fendi-inventory-system')}
        </button>
      </div>
      <div className="pt-4">
        {activeTab === 'sales' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{__('Sales Report', 'fendi-inventory-system')}</h1>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleExport}
              >
                {__('Export to Excel', 'fendi-inventory-system')}
              </button>
            </div>
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
              <div className="mr-4">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
              </div>
              <div className="mr-4">
                <select
                  className="border p-2"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">{__('All Users', 'fendi-inventory-system')}</option>
                  {users.map((user) => (
                    <option key={user.ID} value={user.ID}>
                      {user.data.user_login}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mr-4">
                <select
                  className="border p-2"
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                >
                  <option value="">{__('All Warehouses', 'fendi-inventory-system')}</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.title.rendered}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
            <table className="table-auto w-full mt-4">
              <thead>
                <tr>
                  <th className="px-4 py-2">{__('Order ID', 'fendi-inventory-system')}</th>
                  <th className="px-4 py-2">{__('Date', 'fendi-inventory-system')}</th>
                  <th className="px-4 py-2">{__('Customer', 'fendi-inventory-system')}</th>
                  <th className="px-4 py-2">{__('Total', 'fendi-inventory-system')}</th>
                  <th className="px-4 py-2">{__('Profit', 'fendi-inventory-system')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="border px-4 py-2">{order.id}</td>
                    <td className="border px-4 py-2">{new Date(order.date_created.date).toLocaleString()}</td>
                    <td className="border px-4 py-2">{order.billing.first_name} {order.billing.last_name}</td>
                    <td className="border px-4 py-2">{order.total}</td>
                    <td className="border px-4 py-2">{getOrderProfit(order)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'inventory' && <InventoryReport />}
      </div>
    </div>
  );
};

export default Reports;
