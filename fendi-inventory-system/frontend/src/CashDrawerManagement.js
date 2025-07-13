import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';

const CashDrawerManagement = () => {
  const [cashDrawers, setCashDrawers] = useState([]);
  const [selectedDrawer, setSelectedDrawer] = useState(null);
  const [amount, setAmount] = useState(0);
  const [action, setAction] = useState('in');

  useEffect(() => {
    // This is a placeholder. In a real application, you would fetch cash drawers from the API.
    setCashDrawers([
      { id: 1, name: 'Main Cash Drawer', balance: 1000 },
      { id: 2, name: 'Secondary Cash Drawer', balance: 500 },
    ]);
  }, []);

  const handleAction = () => {
    if (selectedDrawer) {
      const newBalance = action === 'in' ? selectedDrawer.balance + amount : selectedDrawer.balance - amount;
      // In a real application, you would send this to the API
      console.log({ drawer: selectedDrawer.id, action, amount, newBalance });
      setSelectedDrawer({ ...selectedDrawer, balance: newBalance });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{__('Cash Drawer Management', 'fendi-inventory-system')}</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {__('Select Cash Drawer', 'fendi-inventory-system')}
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => setSelectedDrawer(cashDrawers.find(d => d.id === parseInt(e.target.value)))}
        >
          <option>{__('Select a drawer', 'fendi-inventory-system')}</option>
          {cashDrawers.map(drawer => (
            <option key={drawer.id} value={drawer.id}>{drawer.name}</option>
          ))}
        </select>
      </div>
      {selectedDrawer && (
        <div>
          <h3 className="text-lg font-bold mb-2">{__('Current Balance:', 'fendi-inventory-system')} {selectedDrawer.balance}</h3>
          <div className="flex items-center mb-4">
            <select
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            >
              <option value="in">{__('Cash In', 'fendi-inventory-system')}</option>
              <option value="out">{__('Cash Out', 'fendi-inventory-system')}</option>
            </select>
            <input
              type="number"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
              onClick={handleAction}
            >
              {__('Submit', 'fendi-inventory-system')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashDrawerManagement;
