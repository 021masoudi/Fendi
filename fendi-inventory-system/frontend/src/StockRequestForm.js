import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import api from './api';

const StockRequestForm = ({ onSubmit, onCancel }) => {
  const [destinationWarehouse, setDestinationWarehouse] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    api.getWarehouses().then((response) => {
      setWarehouses(response.data);
    });
    api.getProducts().then((response) => {
      setProducts(response.data);
    });
  }, []);

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct.quantity === 1) {
      setCart(cart.filter((item) => item.id !== product.id));
    } else {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ destination_warehouse: destinationWarehouse, cart });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination-warehouse">
          {__('Destination Warehouse', 'fendi-inventory-system')}
        </label>
        <select
          id="destination-warehouse"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={destinationWarehouse}
          onChange={(e) => setDestinationWarehouse(e.target.value)}
          required
        >
          <option value="">{__('Select a warehouse', 'fendi-inventory-system')}</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.title.rendered}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-bold mb-4">{__('Products', 'fendi-inventory-system')}</h3>
          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border p-4 cursor-pointer"
                onClick={() => addToCart(product)}
              >
                <h4 className="font-bold">{product.name}</h4>
                <p>{product.price}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">{__('Request Cart', 'fendi-inventory-system')}</h3>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">{__('Product', 'fendi-inventory-system')}</th>
                <th className="px-4 py-2">{__('Quantity', 'fendi-inventory-system')}</th>
                <th className="px-4 py-2">{__('Actions', 'fendi-inventory-system')}</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => removeFromCart(item)}
                    >
                      {__('Remove', 'fendi-inventory-system')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {__('Submit Request', 'fendi-inventory-system')}
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

export default StockRequestForm;
