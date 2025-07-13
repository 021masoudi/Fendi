import React, { useState, useEffect } from 'react';
import { getExpenses, createExpense, updateExpense, deleteExpense } from './api';
import Modal from './Modal';
import ExpenseForm from './ExpenseForm';
import { __ } from '@wordpress/i18n';

const ExpenseManagement = () => {
    const [expenses, setExpenses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        const response = await getExpenses();
        setExpenses(response.data);
    };

    const handleCreate = () => {
        setSelectedExpense(null);
        setIsModalOpen(true);
    };

    const handleEdit = (expense) => {
        setSelectedExpense(expense);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        await deleteExpense(id);
        fetchExpenses();
    };

    const handleSave = async (expenseData) => {
        if (selectedExpense) {
            await updateExpense(selectedExpense.id, expenseData);
        } else {
            await createExpense(expenseData);
        }
        fetchExpenses();
        setIsModalOpen(false);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{__('Expense Management', 'fendi-inventory-system')}</h2>
            <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                {__('Add Expense', 'fendi-inventory-system')}
            </button>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">{__('Title', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Amount', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Date', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Actions', 'fendi-inventory-system')}</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.id}>
                            <td className="border px-4 py-2">{expense.title.rendered}</td>
                            <td className="border px-4 py-2">{expense.meta._amount}</td>
                            <td className="border px-4 py-2">{expense.meta._date}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleEdit(expense)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                                    {__('Edit', 'fendi-inventory-system')}
                                </button>
                                <button onClick={() => handleDelete(expense.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                                    {__('Delete', 'fendi-inventory-system')}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <Modal closeModal={() => setIsModalOpen(false)}>
                    <ExpenseForm
                        expense={selectedExpense}
                        onSave={handleSave}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ExpenseManagement;
