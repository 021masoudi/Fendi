import React, { useState, useEffect } from 'react';
import { getBalanceSheet } from './api';
import { __ } from '@wordpress/i18n';

const BalanceSheet = () => {
    const [balanceSheet, setBalanceSheet] = useState(null);

    useEffect(() => {
        fetchBalanceSheet();
    }, []);

    const fetchBalanceSheet = async () => {
        const response = await getBalanceSheet();
        setBalanceSheet(response.data);
    };

    if (!balanceSheet) {
        return <div>{__('Loading...', 'fendi-inventory-system')}</div>;
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{__('Balance Sheet', 'fendi-inventory-system')}</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-bold">{__('Assets', 'fendi-inventory-system')}</h3>
                    <ul>
                        <li>{__('Cash:', 'fendi-inventory-system')} {balanceSheet.assets.cash}</li>
                        <li>{__('Bank:', 'fendi-inventory-system')} {balanceSheet.assets.bank}</li>
                        <li>{__('Accounts Receivable:', 'fendi-inventory-system')} {balanceSheet.assets.accounts_receivable}</li>
                        <li>{__('Inventory:', 'fendi-inventory-system')} {balanceSheet.assets.inventory}</li>
                    </ul>
                    <h4 className="font-bold mt-2">{__('Total Assets:', 'fendi-inventory-system')} {balanceSheet.total_assets}</h4>
                </div>
                <div>
                    <h3 className="text-lg font-bold">{__('Liabilities', 'fendi-inventory-system')}</h3>
                    <ul>
                        <li>{__('Accounts Payable:', 'fendi-inventory-system')} {balanceSheet.liabilities.accounts_payable}</li>
                    </ul>
                    <h4 className="font-bold mt-2">{__('Total Liabilities:', 'fendi-inventory-system')} {balanceSheet.total_liabilities}</h4>
                    <h3 className="text-lg font-bold mt-4">{__('Equity', 'fendi-inventory-system')}</h3>
                    <h4 className="font-bold mt-2">{__('Total Equity:', 'fendi-inventory-system')} {balanceSheet.total_equity}</h4>
                </div>
            </div>
        </div>
    );
};

export default BalanceSheet;
