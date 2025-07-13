import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';

const AccountsReceivable = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    // This is a placeholder. In a real application, you would fetch invoices from the API.
    setInvoices([
      { id: 1, customer: 'John Doe', amount: 500, due_date: '2024-12-31', paid: 200 },
      { id: 2, customer: 'Jane Smith', amount: 1000, due_date: '2025-01-15', paid: 0 },
    ]);
  }, []);

  const handlePayment = () => {
    if (selectedInvoice) {
      // In a real application, you would send this to the API
      console.log({ invoice: selectedInvoice.id, amount: paymentAmount });
      alert(__('Payment recorded successfully!', 'fendi-inventory-system'));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{__('Accounts Receivable', 'fendi-inventory-system')}</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">{__('Customer', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Amount', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Paid', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Due Date', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Actions', 'fendi-inventory-system')}</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="border px-4 py-2">{invoice.customer}</td>
              <td className="border px-4 py-2">{invoice.amount}</td>
              <td className="border px-4 py-2">{invoice.paid}</td>
              <td className="border px-4 py-2">{invoice.due_date}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  {__('Record Payment', 'fendi-inventory-system')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedInvoice && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">{__('Record Payment for', 'fendi-inventory-system')} {selectedInvoice.customer}</h3>
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

export default AccountsReceivable;
