import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import api from './api';

const PaymentForm = ({ total, onSubmit, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getUsers().then((response) => {
      setUsers(response.data);
    });
  }, []);

  const getChange = () => {
    return amountReceived - total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ paymentMethod, amountReceived, customer });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customer">
          {__('Customer', 'fendi-inventory-system')}
        </label>
        <input
          type="text"
          placeholder={__('Search customers...', 'fendi-inventory-system')}
          className="border p-2 w-full mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          id="customer"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => setCustomer(e.target.value)}
          value={customer}
        >
          <option value="">{__('Guest Customer', 'fendi-inventory-system')}</option>
          {users
            .filter((user) =>
              user.data.user_login.toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <option key={user.ID} value={user.ID}>
                {user.data.user_login}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment-method">
          {__('Payment Method', 'fendi-inventory-system')}
        </label>
        <select
          id="payment-method"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cash">{__('Cash', 'fendi-inventory-system')}</option>
          <option value="card">{__('Card', 'fendi-inventory-system')}</option>
          <option value="installment">{__('Installment', 'fendi-inventory-system')}</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount-received">
          {__('Amount Received', 'fendi-inventory-system')}
        </label>
        <input
          id="amount-received"
          type="number"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={amountReceived}
          onChange={(e) => setAmountReceived(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-bold">{__('Change:', 'fendi-inventory-system')} {getChange()}</h3>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {__('Finalize Sale', 'fendi-inventory-system')}
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onCancel}
        >
          {__('Cancel', 'fendi-inventory-system')}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
