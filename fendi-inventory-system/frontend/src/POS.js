import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';
import Modal from './Modal';
import PaymentForm from './PaymentForm';
import Receipt from './Receipt';
import { idb } from './idb';
import { useLocation } from 'react-router-dom';

const POS = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [customer, setCustomer] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [order, setOrder] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    if (location.state && location.state.exchangeCredit) {
        setExchangeCredit(location.state.exchangeCredit);
    }
  }, [location]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync offline data when online
      idb.getAll('sales').then(sales => {
        sales.forEach(sale => {
          api.createOrder(sale).then(() => {
            idb.delete('sales', sale.id);
          });
        });
      });
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      api.getMe().then((response) => {
        setCurrentUser(response.data);
        if (response.data.meta._assigned_warehouse) {
          setSelectedWarehouse(response.data.meta._assigned_warehouse[0]);
        }
      });
      api.getProducts(search).then((response) => {
        setProducts(response.data);
        idb.clear('products').then(() => {
          response.data.forEach(product => {
            idb.put('products', product);
          });
        });
      });
      api.getWarehouses().then((response) => {
        setWarehouses(response.data);
      });
    } else {
      idb.getAll('products').then(products => {
        setProducts(products);
      });
    }
  }, [isOnline, search]);

  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    const handleBarcodeScan = (e) => {
      if (e.key === 'Enter') {
        const product = products.find(p => p.sku === barcode);
        if (product) {
          addToCart(product);
        }
        setBarcode('');
      } else {
        setBarcode(barcode + e.key);
      }
    };

    window.addEventListener('keypress', handleBarcodeScan);

    return () => {
      window.removeEventListener('keypress', handleBarcodeScan);
    };
  }, [barcode, products]);

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

  const [discount, setDiscount] = useState(0);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [campaignDiscount, setCampaignDiscount] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [exchangeCredit, setExchangeCredit] = useState(0);

  const getTotal = () => {
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalDiscount = discount + loyaltyDiscount + campaignDiscount;
    const finalTotal = total - totalDiscount - exchangeCredit;
    return finalTotal; // Can be negative now
  };

  const handleDiscount = (e) => {
    const newDiscount = parseFloat(e.target.value);
    if (newDiscount > (currentUser.meta._discount_cap || 0)) {
      alert(__('Discount exceeds the maximum allowed cap.', 'fendi-inventory-system'));
      return;
    }
    setDiscount(newDiscount);
  };

  const handlePay = () => {
    setIsPaymentModalOpen(true);
  };

  const handleRedeemPoints = async () => {
    if (!customer || !pointsToRedeem) return;
    try {
        const response = await api.redeemLoyaltyPoints({
            customer_id: customer.id,
            points: pointsToRedeem,
        });
        setLoyaltyDiscount(response.data.discount_amount);
        // We need a way to update the customer's points in the UI
        // For now, just alert the user.
        alert(`${response.data.discount_amount} discount applied!`);
    } catch (error) {
        alert(error.response.data.message);
    }
  };

  const handleApplyDiscountCode = async () => {
    if (!discountCode) return;
    try {
        const response = await api.validateDiscountCode(discountCode);
        const campaign = response.data;
        const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

        let discountAmount = 0;
        if (campaign.meta._type[0] === 'percentage') {
            discountAmount = (cartTotal * parseFloat(campaign.meta._value[0])) / 100;
        } else {
            discountAmount = parseFloat(campaign.meta._value[0]);
        }

        setCampaignDiscount(discountAmount);
        alert(__('Discount code applied successfully!', 'fendi-inventory-system'));

    } catch (error) {
        alert(error.response.data.message);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
         {/* Customer Selection UI would go here */}
         {/* For now, we assume a customer is selected and their data is in `customer` state */}
         {customer && (
            <div className="p-4 mb-4 bg-blue-100 border border-blue-400 rounded">
                <h3 className="font-bold text-blue-800">{__('Selected Customer:', 'fendi-inventory-system')} {customer.name}</h3>
                <p className="text-blue-700">{__('Loyalty Points:', 'fendi-inventory-system')} {customer.loyalty_points || 0}</p>
            </div>
         )}
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
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">{__('Cart', 'fendi-inventory-system')}</h2>
        <ul>
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p>
                  {item.quantity} x {item.price}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item)}
                className="text-red-500 hover:text-red-800"
              >
                {__('Remove', 'fendi-inventory-system')}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-4">
          <div className="flex items-center">
            <label className="block text-gray-700 text-sm font-bold mr-2 w-32" htmlFor="discount">
              {__('Manual Discount', 'fendi-inventory-system')}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="discount"
              type="number"
              value={discount}
              onChange={handleDiscount}
              disabled={!currentUser || (!currentUser.roles.includes('administrator') && !currentUser.meta._can_give_discount)}
            />
          </div>
          {customer && (
            <div className="flex items-center">
                <label className="block text-gray-700 text-sm font-bold mr-2 w-32" htmlFor="redeem_points">
                    {__('Redeem Points', 'fendi-inventory-system')}
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="redeem_points"
                    type="number"
                    value={pointsToRedeem}
                    onChange={(e) => setPointsToRedeem(e.target.value)}
                    placeholder={`Max ${customer.loyalty_points || 0}`}
                />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={handleRedeemPoints}
                >
                    {__('Redeem', 'fendi-inventory-system')}
                </button>
            </div>
          )}
           <div className="flex items-center">
                <label className="block text-gray-700 text-sm font-bold mr-2 w-32" htmlFor="discount_code">
                    {__('Discount Code', 'fendi-inventory-system')}
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="discount_code"
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={handleApplyDiscountCode}
                >
                    {__('Apply', 'fendi-inventory-system')}
                </button>
            </div>
          {exchangeCredit > 0 && (
            <div className="text-lg font-bold text-green-600">
                {__('Exchange Credit:', 'fendi-inventory-system')} -{exchangeCredit}
            </div>
          )}
          <h3 className="text-xl font-bold mt-2">{__('Net Total:', 'fendi-inventory-system')} {getTotal()}</h3>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded mt-4 w-full text-lg"
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
