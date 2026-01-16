import React, { useState, useEffect } from 'react';
import { getLedger } from './api';
import { __ } from '@wordpress/i18n';

const Ledger = () => {
    const [ledger, setLedger] = useState([]);
    const [account, setAccount] = useState('cash');

    useEffect(() => {
        fetchLedger();
    }, [account]);

    const fetchLedger = async () => {
        const response = await getLedger(account);
        setLedger(response.data);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{__('Ledger', 'fendi-inventory-system')}</h2>
            <div className="mb-4">
                <label htmlFor="account" className="mr-2">{__('Select Account:', 'fendi-inventory-system')}</label>
                <select id="account" value={account} onChange={(e) => setAccount(e.target.value)} className="border p-2">
                    <option value="cash">{__('Cash', 'fendi-inventory-system')}</option>
                    <option value="bank">{__('Bank', 'fendi-inventory-system')}</option>
                    <option value="accounts_receivable">{__('Accounts Receivable', 'fendi-inventory-system')}</option>
                    <option value="accounts_payable">{__('Accounts Payable', 'fendi-inventory-system')}</option>
                </select>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">{__('Date', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Description', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Debit', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Credit', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Balance', 'fendi-inventory-system')}</th>
                    </tr>
                </thead>
                <tbody>
                    {ledger.map((entry, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                            <td className="border px-4 py-2">{entry.description}</td>
                            <td className="border px-4 py-2">{entry.debit}</td>
                            <td className="border px-4 py-2">{entry.credit}</td>
                            <td className="border px-4 py-2">{entry.balance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Ledger;
