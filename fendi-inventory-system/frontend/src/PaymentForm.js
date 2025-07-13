import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import api from './api';
import Modal from './Modal';
import QuickCustomerForm from './QuickCustomerForm';

const PaymentForm = ({ total, onSubmit, onCancel }) => {
    const [payments, setPayments] = useState([{ method: 'cash', amount: total }]);
    const [customer, setCustomer] = useState(null);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);


    useEffect(() => {
        if (search.length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        const searchUsers = async () => {
            // This assumes the getUsers API endpoint can handle a search query parameter
            const response = await api.getUsers({ s: search });
            setSearchResults(response.data);
            setIsSearching(false);
        };
        const debounceSearch = setTimeout(() => {
            searchUsers();
        }, 500);

        return () => clearTimeout(debounceSearch);
    }, [search]);

    const handlePaymentChange = (index, field, value) => {
        const newPayments = [...payments];
        newPayments[index][field] = value;
        setPayments(newPayments);
    };

    const addPaymentMethod = () => {
        setPayments([...payments, { method: 'card', amount: 0 }]);
    };

    const removePaymentMethod = (index) => {
        const newPayments = payments.filter((_, i) => i !== index);
        setPayments(newPayments);
    };

    const totalPaid = payments.reduce((acc, p) => acc + parseFloat(p.amount || 0), 0);
    const remaining = total - totalPaid;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (remaining !== 0) {
            alert(__('The total paid does not match the total amount.', 'fendi-inventory-system'));
            return;
        }
        onSubmit({ payments, customer });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            {isAddCustomerModalOpen && (
                <Modal onClose={() => setIsAddCustomerModalOpen(false)}>
                    <QuickCustomerForm
                        onCancel={() => setIsAddCustomerModalOpen(false)}
                        onSubmit={async (customerData) => {
                            const response = await api.quickAddCustomer(customerData);
                            setCustomer(response.data);
                            setSearch(response.data.data.display_name);
                            setIsAddCustomerModalOpen(false);
                        }}
                    />
                </Modal>
            )}

            {/* Customer Selection */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 text-sm font-bold">{__('Customer', 'fendi-inventory-system')}</label>
                    <button type="button" onClick={() => setIsAddCustomerModalOpen(true)} className="text-sm text-blue-500 hover:underline">
                        {__('+ Add New Customer', 'fendi-inventory-system')}
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder={__('Search by name or mobile...', 'fendi-inventory-system')}
                        className="border p-2 w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setSearchResults([])}
                    />
                    {isSearching && <p>{__('Searching...', 'fendi-inventory-system')}</p>}
                    {searchResults.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow-lg max-h-60 overflow-auto">
                            {searchResults.map(user => (
                                <li
                                    key={user.ID}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setCustomer(user);
                                        setSearch(user.data.display_name);
                                        setSearchResults([]);
                                    }}
                                >
                                    {user.data.display_name} ({user.data.user_email})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {customer && <p className="mt-2 font-bold">{__('Selected:', 'fendi-inventory-system')} {customer.data.display_name}</p>}
            </div>

            {/* Payment Methods */}
            <div className="space-y-4 mb-4">
                {payments.map((payment, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                        <select value={payment.method} onChange={(e) => handlePaymentChange(index, 'method', e.target.value)} className="p-2 border rounded w-1/3">
                            <option value="cash">{__('Cash', 'fendi-inventory-system')}</option>
                            <option value="card">{__('Card', 'fendi-inventory-system')}</option>
                            <option value="card_2">{__('Card 2', 'fendi-inventory-system')}</option>
                            <option value="installment">{__('Installment', 'fendi-inventory-system')}</option>
                        </select>
                        <input type="number" step="any" value={payment.amount} onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)} className="p-2 border rounded w-2/3" placeholder={__('Amount', 'fendi-inventory-system')} />
                        {payments.length > 1 && <button type="button" onClick={() => removePaymentMethod(index)} className="text-red-500 font-bold">X</button>}
                    </div>
                ))}
            </div>
            <button type="button" onClick={addPaymentMethod} className="text-blue-500 mb-4">{__('+ Add Payment Method', 'fendi-inventory-system')}</button>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between font-bold text-lg">
                    <span>{__('Total Amount:', 'fendi-inventory-system')}</span>
                    <span>{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>{__('Total Paid:', 'fendi-inventory-system')}</span>
                    <span>{totalPaid.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between font-bold ${remaining === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{__('Remaining:', 'fendi-inventory-system')}</span>
                    <span>{remaining.toFixed(2)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end mt-6 space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">{__('Cancel', 'fendi-inventory-system')}</button>
                <button type="submit" disabled={remaining !== 0} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">{__('Finalize Sale', 'fendi-inventory-system')}</button>
            </div>
        </form>
    );
};

export default PaymentForm;
