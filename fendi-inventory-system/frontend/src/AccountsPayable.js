import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';

const AccountsPayable = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    // This is a placeholder. In a real application, you would fetch bills from the API.
    setBills([
      { id: 1, vendor: 'Supplier A', amount: 2000, due_date: '2024-12-20', paid: 1000 },
      { id: 2, vendor: 'Supplier B', amount: 3000, due_date: '2025-01-10', paid: 0 },
    ]);
  }, []);

  const handlePayment = () => {
    if (selectedBill) {
      // In a real application, you would send this to the API
      console.log({ bill: selectedBill.id, amount: paymentAmount });
      alert(__('Payment recorded successfully!', 'fendi-inventory-system'));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{__('Accounts Payable', 'fendi-inventory-system')}</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">{__('Vendor', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Amount', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Paid', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Due Date', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Actions', 'fendi-inventory-system')}</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id}>
              <td className="border px-4 py-2">{bill.vendor}</td>
              <td className="border px-4 py-2">{bill.amount}</td>
              <td className="border px-4 py-2">{bill.paid}</td>
              <td className="border px-4 py-2">{bill.due_date}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => setSelectedBill(bill)}
                >
                  {__('Record Payment', 'fendi-inventory-system')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedBill && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">{__('Record Payment for', 'fendi-inventory-system')} {selectedBill.vendor}</h3>
          <input
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
          />
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
            onClick={handlePayment}
          >
            {__('Submit Payment', 'fendi-inventory-system')}
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountsPayable;
