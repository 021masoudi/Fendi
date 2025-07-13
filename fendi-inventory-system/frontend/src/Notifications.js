import React, { useState, useEffect } from 'react';
import { getNotifications } from './api';
import { __ } from '@wordpress/i18n';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        const response = await getNotifications();
        setNotifications(response.data);
    };

    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.date) - new Date(a.date));

    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{__('System Notifications', 'fendi-inventory-system')}</h1>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {sortedNotifications.length > 0 ? (
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    {__('Title', 'fendi-inventory-system')}
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    {__('Message', 'fendi-inventory-system')}
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    {__('Date', 'fendi-inventory-system')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedNotifications.map((notification) => (
                                <tr key={notification.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{notification.title.rendered}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{stripHtml(notification.content.rendered)}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{new Date(notification.date).toLocaleString()}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">{__('No notifications found.', 'fendi-inventory-system')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
