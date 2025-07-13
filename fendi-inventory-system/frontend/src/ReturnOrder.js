import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';
import { useNavigate } from 'react-router-dom';

const ReturnOrder = () => {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [returnedItems, setReturnedItems] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSearchOrder = async () => {
        if (!orderId) return;
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await api.getOrderById(orderId);
            setOrder(response.data);
        } catch (err) {
            setError(__('Order not found.', 'fendi-inventory-system'));
            setOrder(null);
        }
        setIsLoading(false);
    };

    const handleQuantityChange = (productId, quantity) => {
        setReturnedItems(prev => ({
            ...prev,
            [productId]: parseInt(quantity, 10) || 0,
        }));
    };

    const handleReturnSubmit = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            const itemsToReturn = Object.fromEntries(
                Object.entries(returnedItems).filter(([, qty]) => qty > 0)
            );
            if (Object.keys(itemsToReturn).length === 0) {
                setError(__('Please select items to return.', 'fendi-inventory-system'));
                setIsLoading(false);
                return;
            }
            const response = await api.returnOrder(order.id, { items: itemsToReturn });
            setSuccess(`Successfully returned items. Refund amount: ${response.data.amount}`);
            setOrder(null);
            setReturnedItems({});
            setOrderId('');
        } catch (err) {
            setError(err.response?.data?.message || __('An error occurred.', 'fendi-inventory-system'));
        }
        setIsLoading(false);
    };

    const handleReturnAndExchange = async () => {
        setIsLoading(true);
        setError('');
        try {
            const itemsToReturn = Object.fromEntries(
                Object.entries(returnedItems).filter(([, qty]) => qty > 0)
            );
            if (Object.keys(itemsToReturn).length === 0) {
                setError(__('Please select items to return.', 'fendi-inventory-system'));
                setIsLoading(false);
                return;
            }
            const response = await api.returnOrder(order.id, { items: itemsToReturn });
            navigate('/pos', { state: { exchangeCredit: response.data.amount } });
        } catch (err) {
            setError(err.response?.data?.message || __('An error occurred.', 'fendi-inventory-system'));
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{__('Return & Exchange', 'fendi-inventory-system')}</h1>

            <div className="bg-white p-8 rounded-lg shadow-md mb-6">
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={orderId}
                        onChange={e => setOrderId(e.target.value)}
                        placeholder={__('Enter Order ID', 'fendi-inventory-system')}
                        className="flex-grow shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <button onClick={handleSearchOrder} disabled={isLoading} className="bg-blue-600 text-white px-6 py-2 rounded-md">
                        {isLoading ? __('Searching...', 'fendi-inventory-system') : __('Search Order', 'fendi-inventory-system')}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {success && <p className="text-green-500 mt-2">{success}</p>}
            </div>

            {order && (
                 <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">{__('Order #', 'fendi-inventory-system')}{order.id}</h2>
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Product', 'fendi-inventory-system')}</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Purchased Qty', 'fendi-inventory-system')}</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Return Qty', 'fendi-inventory-system')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.line_items.map(item => (
                                <tr key={item.item_id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.quantity}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <input
                                            type="number"
                                            min="0"
                                            max={item.quantity}
                                            value={returnedItems[item.product_id] || 0}
                                            onChange={e => handleQuantityChange(item.product_id, e.target.value)}
                                            className="w-20 shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-right mt-6 flex justify-end space-x-4">
                         <button onClick={handleReturnSubmit} disabled={isLoading} className="bg-green-600 text-white px-6 py-2 rounded-md">
                            {isLoading ? __('Processing...', 'fendi-inventory-system') : __('Finalize Return', 'fendi-inventory-system')}
                        </button>
                        <button onClick={() => handleReturnAndExchange()} disabled={isLoading} className="bg-orange-500 text-white px-6 py-2 rounded-md">
                            {__('Return and Exchange', 'fendi-inventory-system')}
                        </button>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default ReturnOrder;
