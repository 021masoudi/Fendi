import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import api from './api';
import Modal from './Modal';
import PaymentForm from './PaymentForm';
import Receipt from './Receipt';
import { idb } from './idb';

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    api.getMe().then((response) => {
      setCurrentUser(response.data);
      if (response.data.meta._assigned_warehouse) {
        setSelectedWarehouse(response.data.meta._assigned_warehouse[0]);
      }
    });
    api.getProducts(search).then((response) => {
      setProducts(response.data);
    });
    api.getWarehouses().then((response) => {
      setWarehouses(response.data);
    });
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

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

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePay = () => {
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{__('Products', 'fendi-inventory-system')}</h2>
          <select
            className="border p-2"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            disabled={currentUser && currentUser.meta._assigned_warehouse}
          >
            <option value="">{__('All Warehouses', 'fendi-inventory-system')}</option>
            {warehouses
              .filter(
                (warehouse) =>
                  !currentUser ||
                  !currentUser.meta._assigned_warehouse ||
                  warehouse.id == currentUser.meta._assigned_warehouse[0]
              )
              .map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.title.rendered}
                </option>
              ))}
          </select>
        </div>
        <input
          type="text"
          placeholder={__('Search products...', 'fendi-inventory-system')}
          className="border p-2 w-full mb-4"
          value={search}
          onChange={handleSearch}
        />
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border p-4 cursor-pointer"
              onClick={() => addToCart(product)}
            >
              <h3 className="font-bold">{product.name}</h3>
              <p>{product.price}</p>
              <div>
                {Object.entries(product.warehouse_stock).map(([warehouseId, stock]) => (
                  <p key={warehouseId}>
                    Warehouse {warehouseId}: {stock}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">{__('Cart', 'fendi-inventory-system')}</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">{__('Product', 'fendi-inventory-system')}</th>
              <th className="px-4 py-2">{__('Price', 'fendi-inventory-system')}</th>
              <th className="px-4 py-2">{__('Quantity', 'fendi-inventory-system')}</th>
              <th className="px-4 py-2">{__('Actions', 'fendi-inventory-system')}</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.price}</td>
                <td className="border px-4 py-2">{item.quantity}</td>
                <td className="border px-4 py-2">
                  <button
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
        <div className="mt-4">
          <h3 className="text-lg font-bold">{__('Total:', 'fendi-inventory-system')} {getTotal()}</h3>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handlePay}
          >
            {__('Pay', 'fendi-inventory-system')}
          </button>
        </div>
      </div>
      {isPaymentModalOpen && (
        <Modal onClose={() => setIsPaymentModalOpen(false)}>
          <PaymentForm
            total={getTotal()}
            onSubmit={async (data) => {
              const orderData = { ...data, cart, warehouse_id: selectedWarehouse };
              if (navigator.onLine) {
                const response = await api.createOrder(orderData);
                setCart([]);
                setIsPaymentModalOpen(false);
                setReceipt(response.data);
                setIsReceiptModalOpen(true);
              } else {
                await idb.put('sales', orderData);
                setCart([]);
                setIsPaymentModalOpen(false);
                setReceipt(orderData);
                setIsReceiptModalOpen(true);
                alert(__('Sale saved offline. It will be synced when you are back online.', 'fendi-inventory-system'));
              }
            }}
            onCancel={() => setIsPaymentModalOpen(false)}
          />
        </Modal>
      )}
      {isReceiptModalOpen && (
        <Modal onClose={() => setIsReceiptModalOpen(false)}>
          <Receipt order={receipt} />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => window.print()}
          >
            {__('Print Receipt', 'fendi-inventory-system')}
          </button>
        </Modal>
      )}
    </div>
  );
};

export default POS;
