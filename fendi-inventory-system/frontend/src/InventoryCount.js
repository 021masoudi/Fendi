import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';

const InventoryCount = () => {
  const [products, setProducts] = useState([]);
  const [countedStock, setCountedStock] = useState({});

  useEffect(() => {
    api.getProducts().then((response) => {
      setProducts(response.data);
    });
  }, []);

  const handleCountChange = (productId, value) => {
    setCountedStock({ ...countedStock, [productId]: value });
  };

  const handleReconcile = () => {
    // In a real application, you would send this to the API
    console.log({ countedStock });
    alert(__('Inventory reconciled successfully!', 'fendi-inventory-system'));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{__('Inventory Count', 'fendi-inventory-system')}</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">{__('Product', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Current Stock', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Counted Stock', 'fendi-inventory-system')}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.stock_quantity}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={countedStock[product.id] || ''}
                  onChange={(e) => handleCountChange(product.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={handleReconcile}
      >
        {__('Reconcile', 'fendi-inventory-system')}
      </button>
    </div>
  );
};

export default InventoryCount;
