import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';

const SMSSettings = () => {
    const [settings, setSettings] = useState({
        fendi_sms_api_key: '',
        fendi_sms_sender_number: '',
        fendi_sms_api_url: '',
        fendi_thank_you_sms_enabled: false,
        fendi_thank_you_sms_template: '',
        fendi_daily_sales_report_enabled: false,
        fendi_daily_sales_report_recipients: '',
        fendi_daily_sales_report_time: '23:00',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notice, setNotice] = useState('');

    useEffect(() => {
        api.getSmsSettings().then(response => {
            setSettings(response.data);
            setIsLoading(false);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        api.saveSmsSettings(settings).then(() => {
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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{__('SMS Settings', 'fendi-inventory-system')}</h1>
            {notice && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{notice}</div>}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* API Settings */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">{__('API Configuration', 'fendi-inventory-system')}</h2>
                        <div>
                            <label htmlFor="fendi_sms_api_url" className="block text-sm font-medium text-gray-700">{__('API Endpoint URL', 'fendi-inventory-system')}</label>
                            <input type="text" name="fendi_sms_api_url" id="fendi_sms_api_url" value={settings.fendi_sms_api_url} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="fendi_sms_api_key" className="block text-sm font-medium text-gray-700">{__('API Key / Token', 'fendi-inventory-system')}</label>
                            <input type="password" name="fendi_sms_api_key" id="fendi_sms_api_key" value={settings.fendi_sms_api_key} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="fendi_sms_sender_number" className="block text-sm font-medium text-gray-700">{__('Sender Number / Line Number', 'fendi-inventory-system')}</label>
                            <input type="text" name="fendi_sms_sender_number" id="fendi_sms_sender_number" value={settings.fendi_sms_sender_number} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>

                    {/* Thank You SMS */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">{__('Post-Purchase Thank You SMS', 'fendi-inventory-system')}</h2>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="fendi_thank_you_sms_enabled" name="fendi_thank_you_sms_enabled" type="checkbox" checked={settings.fendi_thank_you_sms_enabled} onChange={handleChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="fendi_thank_you_sms_enabled" className="font-medium text-gray-700">{__('Enable Thank You SMS', 'fendi-inventory-system')}</label>
                                <p className="text-gray-500">{__('Send an SMS to the customer after a completed purchase.', 'fendi-inventory-system')}</p>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="fendi_thank_you_sms_template" className="block text-sm font-medium text-gray-700">{__('SMS Template', 'fendi-inventory-system')}</label>
                            <textarea name="fendi_thank_you_sms_template" id="fendi_thank_you_sms_template" rows="4" value={settings.fendi_thank_you_sms_template} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                            <p className="mt-2 text-sm text-gray-500">{__('Placeholders: [customer_name], [total_amount]', 'fendi-inventory-system')}</p>
                        </div>
                    </div>

                    {/* Daily Sales Report */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">{__('Daily Sales Report SMS', 'fendi-inventory-system')}</h2>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="fendi_daily_sales_report_enabled" name="fendi_daily_sales_report_enabled" type="checkbox" checked={settings.fendi_daily_sales_report_enabled} onChange={handleChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="fendi_daily_sales_report_enabled" className="font-medium text-gray-700">{__('Enable Daily Sales Report', 'fendi-inventory-system')}</label>
                                <p className="text-gray-500">{__('Send a daily summary of sales to specified numbers.', 'fendi-inventory-system')}</p>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="fendi_daily_sales_report_recipients" className="block text-sm font-medium text-gray-700">{__('Recipient Mobile Numbers', 'fendi-inventory-system')}</label>
                            <input type="text" name="fendi_daily_sales_report_recipients" id="fendi_daily_sales_report_recipients" value={settings.fendi_daily_sales_report_recipients} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            <p className="mt-2 text-sm text-gray-500">{__('Enter numbers separated by commas.', 'fendi-inventory-system')}</p>
                        </div>
                        <div>
                            <label htmlFor="fendi_daily_sales_report_time" className="block text-sm font-medium text-gray-700">{__('Sending Time', 'fendi-inventory-system')}</label>
                            <input type="time" name="fendi_daily_sales_report_time" id="fendi_daily_sales_report_time" value={settings.fendi_daily_sales_report_time} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
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

export default SMSSettings;
