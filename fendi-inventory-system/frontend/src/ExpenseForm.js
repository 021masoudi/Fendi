import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';

const ExpenseForm = ({ expense, onSave, onCancel }) => {
    const [title, setTitle] = useState(expense ? expense.title.rendered : '');
    const [amount, setAmount] = useState(expense ? expense.meta._amount : '');
    const [date, setDate] = useState(expense ? expense.meta._date : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            title,
            meta: {
                _amount: amount,
                _date: date,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">
                {expense ? __('Edit Expense', 'fendi-inventory-system') : __('Add Expense', 'fendi-inventory-system')}
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

export default ExpenseForm;
