import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TimeLogReport = () => {
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        user_id: '',
        start_date: new Date(),
        end_date: new Date(),
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        api.getUsers().then(response => {
            setUsers(response.data.filter(u => !u.roles.includes('customer')));
        });
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [filters]);

    const fetchLogs = () => {
        setIsLoading(true);
        const params = {
            user_id: filters.user_id,
            start_date: filters.start_date.toISOString().slice(0, 10),
            end_date: filters.end_date.toISOString().slice(0, 10),
        };
        api.getTimeLogs(params).then(response => {
            setLogs(response.data);
            setIsLoading(false);
        });
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const calculateDuration = (clockIn, clockOut) => {
        if (!clockIn || !clockOut) return 'N/A';
        const start = new Date(clockIn);
        const end = new Date(clockOut);
        const diff = end.getTime() - start.getTime();
        if (diff < 0) return 'Invalid';

        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{__('Time Log Report', 'fendi-inventory-system')}</h1>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center space-x-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{__('Employee', 'fendi-inventory-system')}</label>
                    <select
                        value={filters.user_id}
                        onChange={e => handleFilterChange('user_id', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">{__('All Employees', 'fendi-inventory-system')}</option>
                        {users.map(user => (
                            <option key={user.ID} value={user.ID}>{user.data.display_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700">{__('Start Date', 'fendi-inventory-system')}</label>
                    <DatePicker selected={filters.start_date} onChange={date => handleFilterChange('start_date', date)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{__('End Date', 'fendi-inventory-system')}</label>
                    <DatePicker selected={filters.end_date} onChange={date => handleFilterChange('end_date', date)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                 <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Employee', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Clock In', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Clock Out', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Duration', 'fendi-inventory-system')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="4" className="text-center py-10">{__('Loading...', 'fendi-inventory-system')}</td></tr>
                        ) : logs.length > 0 ? (
                            logs.map(log => (
                                <tr key={log.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{log.user_name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(log.clock_in).toLocaleString()}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{log.clock_out ? new Date(log.clock_out).toLocaleString() : 'Still clocked in'}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{calculateDuration(log.clock_in, log.clock_out)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center py-10">{__('No time logs found for the selected criteria.', 'fendi-inventory-system')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TimeLogReport;
