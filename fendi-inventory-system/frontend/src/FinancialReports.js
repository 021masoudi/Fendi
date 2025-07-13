import React, { useState, useEffect } from 'react';
import { getFinancialReports } from './api';
import { __ } from '@wordpress/i18n';

const FinancialReports = () => {
    const [reports, setReports] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchReports = async () => {
        const response = await getFinancialReports(startDate, endDate);
        setReports(response.data);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{__('Financial Reports', 'fendi-inventory-system')}</h2>
            <div className="flex mb-4">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                />
                <button onClick={fetchReports} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {__('Generate Report', 'fendi-inventory-system')}
                </button>
            </div>
            {reports && (
                <div>
                    <h3 className="text-lg font-bold mb-2">{__('Profit & Loss Statement', 'fendi-inventory-system')}</h3>
                    <p>{__('Total Revenue:', 'fendi-inventory-system')} {reports.total_revenue}</p>
                    <p>{__('Total COGS:', 'fendi-inventory-system')} {reports.total_cogs}</p>
                    <p>{__('Gross Profit:', 'fendi-inventory-system')} {reports.gross_profit}</p>
                </div>
            )}
        </div>
    );
};

export default FinancialReports;
