import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import api from './api';
import Modal from './Modal';
import PaymentForm from './PaymentForm';

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getProducts(search).then((response) => {
      setProducts(response.data);
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

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePay = () => {
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2 className="text-xl font-bold mb-4">{__('Products', 'fendi-inventory-system')}</h2>
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
            onSubmit={(data) => {
              api.createOrder({ ...data, cart }).then(() => {
                setCart([]);
                alert(__('Sale finalized successfully!', 'fendi-inventory-system'));
                setIsPaymentModalOpen(false);
              });
            }}
            onCancel={() => setIsPaymentModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default POS;
