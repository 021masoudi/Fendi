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

const Reports = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.getOrders().then((response) => {
      setOrders(response.data);
    });
  }, []);

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{__('Sales Report', 'fendi-inventory-system')}</h1>
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
  );
};

export default Reports;
