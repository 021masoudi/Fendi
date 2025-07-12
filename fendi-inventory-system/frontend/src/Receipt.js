import React from 'react';
import { __ } from '@wordpress/i18n';

const Receipt = ({ order }) => {
  return (
    <div className="receipt">
      <h2 className="text-2xl font-bold text-center mb-4">{__('Receipt', 'fendi-inventory-system')}</h2>
      <div className="mb-4">
        <strong>{__('Order ID:', 'fendi-inventory-system')}</strong> {order.id}
      </div>
      <div className="mb-4">
        <strong>{__('Date:', 'fendi-inventory-system')}</strong> {new Date(order.date_created.date).toLocaleString()}
      </div>
      <div className="mb-4">
        <strong>{__('Customer:', 'fendi-inventory-system')}</strong> {order.billing.first_name} {order.billing.last_name}
      </div>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">{__('Product', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2 text-right">{__('Quantity', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2 text-right">{__('Price', 'fendi-inventory-system')}</th>
          </tr>
        </thead>
        <tbody>
          {order.line_items.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2 text-right">{item.quantity}</td>
              <td className="border px-4 py-2 text-right">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right">
        <h3 className="text-lg font-bold">{__('Total:', 'fendi-inventory-system')} {order.total}</h3>
      </div>
    </div>
  );
};

export default Receipt;
