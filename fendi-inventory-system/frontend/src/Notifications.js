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

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{__('Notifications', 'fendi-inventory-system')}</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">{__('Title', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Message', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Date', 'fendi-inventory-system')}</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.map((notification) => (
                        <tr key={notification.id}>
                            <td className="border px-4 py-2">{notification.title.rendered}</td>
                            <td className="border px-4 py-2">{notification.content.rendered}</td>
                            <td className="border px-4 py-2">{new Date(notification.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Notifications;
