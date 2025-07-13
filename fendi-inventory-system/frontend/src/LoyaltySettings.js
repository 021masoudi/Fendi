import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';

const LoyaltySettings = () => {
    const [settings, setSettings] = useState({
        fendi_loyalty_points_rate: 1000,
        fendi_loyalty_redemption_rate: 1,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notice, setNotice] = useState('');

    useEffect(() => {
        api.getLoyaltySettings().then(response => {
            setSettings(response.data);
            setIsLoading(false);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        api.saveLoyaltySettings(settings).then(() => {
            setIsSaving(false);
            setNotice(__('Settings saved successfully!', 'fendi-inventory-system'));
            setTimeout(() => setNotice(''), 3000);
        }).catch(() => {
            setIsSaving(false);
            setNotice(__('Error saving settings.', 'fendi-inventory-system'));
            setTimeout(() => setNotice(''), 3000);
        });
    };

    if (isLoading) {
        return <div>{__('Loading settings...', 'fendi-inventory-system')}</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{__('Loyalty Program Settings', 'fendi-inventory-system')}</h1>
            {notice && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{notice}</div>}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="fendi_loyalty_points_rate" className="block text-sm font-medium text-gray-700">
                            {__('Points Earning Rate', 'fendi-inventory-system')}
                        </label>
                        <input
                            type="number"
                            name="fendi_loyalty_points_rate"
                            id="fendi_loyalty_points_rate"
                            value={settings.fendi_loyalty_points_rate}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            {__('Amount of purchase to earn 1 point. E.g., 1000 means 1 point per 1000 currency units.', 'fendi-inventory-system')}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="fendi_loyalty_redemption_rate" className="block text-sm font-medium text-gray-700">
                            {__('Points Redemption Rate', 'fendi-inventory-system')}
                        </label>
                        <input
                            type="number"
                            name="fendi_loyalty_redemption_rate"
                            id="fendi_loyalty_redemption_rate"
                            value={settings.fendi_loyalty_redemption_rate}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            {__('Discount value of 1 point. E.g., 1 means 1 point is worth 1 currency unit.', 'fendi-inventory-system')}
                        </p>
                    </div>
                </div>
                <div className="pt-5 mt-8 border-t border-gray-200">
                    <div className="flex justify-end">
                        <button type="submit" disabled={isSaving} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {isSaving ? __('Saving...', 'fendi-inventory-system') : __('Save Settings', 'fendi-inventory-system')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoyaltySettings;
