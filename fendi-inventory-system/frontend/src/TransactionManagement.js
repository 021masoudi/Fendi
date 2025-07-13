import React, { useState, useEffect } from 'react';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from './api';
import Modal from './Modal';
import TransactionForm from './TransactionForm';
import { __ } from '@wordpress/i18n';

const TransactionManagement = () => {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const response = await getTransactions();
        setTransactions(response.data);
    };

    const handleCreate = () => {
        setSelectedTransaction(null);
        setIsModalOpen(true);
    };

    const handleEdit = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        await deleteTransaction(id);
        fetchTransactions();
    };

    const handleSave = async (transactionData) => {
        if (selectedTransaction) {
            await updateTransaction(selectedTransaction.id, transactionData);
        } else {
            await createTransaction(transactionData);
        }
        fetchTransactions();
        setIsModalOpen(false);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{__('Transaction Management', 'fendi-inventory-system')}</h2>
            <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                {__('Add Transaction', 'fendi-inventory-system')}
            </button>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">{__('Title', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Type', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Amount', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Date', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Related ID', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Actions', 'fendi-inventory-system')}</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td className="border px-4 py-2">{transaction.title.rendered}</td>
                            <td className="border px-4 py-2">{transaction.meta._type}</td>
                            <td className="border px-4 py-2">{transaction.meta._amount}</td>
                            <td className="border px-4 py-2">{transaction.meta._date}</td>
                            <td className="border px-4 py-2">{transaction.meta._related_id}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleEdit(transaction)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                                    {__('Edit', 'fendi-inventory-system')}
                                </button>
                                <button onClick={() => handleDelete(transaction.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                                    {__('Delete', 'fendi-inventory-system')}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <Modal closeModal={() => setIsModalOpen(false)}>
                    <TransactionForm
                        transaction={selectedTransaction}
                        onSave={handleSave}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default TransactionManagement;
