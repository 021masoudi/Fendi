import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';
import { useNavigate } from 'react-router-dom';

const CustomerHistory = ({ customerId }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (customerId) {
            api.getOrders({ customer: customerId }).then(response => {
                setOrders(response.data);
                setIsLoading(false);
            });
        }
    }, [customerId]);

    const handleReturnClick = (orderId) => {
        // This assumes the ReturnOrder component can accept an orderId via state
        navigate('/returns', { state: { orderId: orderId } });
    };

    if (isLoading) {
        return <p>{__('Loading history...', 'fendi-inventory-system')}</p>;
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{__('Order History', 'fendi-inventory-system')}</h2>
            {orders.length > 0 ? (
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Order ID', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Date', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Total', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">#{order.id}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(order.date_created.date).toLocaleDateString()}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.total}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                    <button onClick={() => handleReturnClick(order.id)} className="text-sm text-blue-500 hover:underline">
                                        {__('Return / Exchange', 'fendi-inventory-system')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>{__('No previous orders found for this customer.', 'fendi-inventory-system')}</p>
            )}
        </div>
    );
};

export default CustomerHistory;
