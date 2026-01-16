import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';

const TransactionForm = ({ transaction, onSave, onCancel }) => {
    const [title, setTitle] = useState(transaction ? transaction.title.rendered : '');
    const [type, setType] = useState(transaction ? transaction.meta._type : 'receivable');
    const [amount, setAmount] = useState(transaction ? transaction.meta._amount : '');
    const [date, setDate] = useState(transaction ? transaction.meta._date : '');
    const [relatedId, setRelatedId] = useState(transaction ? transaction.meta._related_id : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            title,
            meta: {
                _type: type,
                _amount: amount,
                _date: date,
                _related_id: relatedId,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">
                {transaction ? __('Edit Transaction', 'fendi-inventory-system') : __('Add Transaction', 'fendi-inventory-system')}
            </h2>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    {__('Title', 'fendi-inventory-system')}
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                    {__('Type', 'fendi-inventory-system')}
                </label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="receivable">{__('Accounts Receivable', 'fendi-inventory-system')}</option>
                    <option value="payable">{__('Accounts Payable', 'fendi-inventory-system')}</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                    {__('Amount', 'fendi-inventory-system')}
                </label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                    {__('Date', 'fendi-inventory-system')}
                </label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="relatedId">
                    {__('Related ID (Order/PO)', 'fendi-inventory-system')}
                </label>
                <input
                    type="number"
                    id="relatedId"
                    value={relatedId}
                    onChange={(e) => setRelatedId(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="flex items-center justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {__('Save', 'fendi-inventory-system')}
                </button>
                <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
                    {__('Cancel', 'fendi-inventory-system')}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;
