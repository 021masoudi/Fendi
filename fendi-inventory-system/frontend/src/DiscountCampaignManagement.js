import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';
import Modal from './Modal';

const DiscountCampaignForm = ({ campaign, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'percentage',
        value: '',
        code: '',
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        if (campaign) {
            setFormData({
                title: campaign.title.rendered,
                type: campaign.meta._type ? campaign.meta._type[0] : 'percentage',
                value: campaign.meta._value ? campaign.meta._value[0] : '',
                code: campaign.meta._code ? campaign.meta._code[0] : '',
                start_date: campaign.meta._start_date ? campaign.meta._start_date[0] : '',
                end_date: campaign.meta._end_date ? campaign.meta._end_date[0] : '',
            });
        }
    }, [campaign]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">{__('Campaign Name', 'fendi-inventory-system')}</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
            </div>
            <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">{__('Discount Code', 'fendi-inventory-system')}</label>
                <input type="text" name="code" id="code" value={formData.code} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
            </div>
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">{__('Discount Type', 'fendi-inventory-system')}</label>
                    <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        <option value="percentage">{__('Percentage', 'fendi-inventory-system')}</option>
                        <option value="fixed_amount">{__('Fixed Amount', 'fendi-inventory-system')}</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700">{__('Value', 'fendi-inventory-system')}</label>
                    <input type="number" name="value" id="value" value={formData.value} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                </div>
            </div>
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">{__('Start Date', 'fendi-inventory-system')}</label>
                    <input type="date" name="start_date" id="start_date" value={formData.start_date} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                </div>
                <div className="flex-1">
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">{__('End Date', 'fendi-inventory-system')}</label>
                    <input type="date" name="end_date" id="end_date" value={formData.end_date} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2">{__('Cancel', 'fendi-inventory-system')}</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">{__('Save Campaign', 'fendi-inventory-system')}</button>
            </div>
        </form>
    );
};


const DiscountCampaignManagement = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = () => {
        api.getDiscountCampaigns().then(response => {
            setCampaigns(response.data);
        });
    };

    const handleFormSubmit = (data) => {
        const apiCall = editingCampaign
            ? api.updateDiscountCampaign(editingCampaign.id, data)
            : api.createDiscountCampaign(data);

        apiCall.then(() => {
            loadCampaigns();
            setIsModalOpen(false);
        });
    };

    const handleDelete = (id) => {
        if (window.confirm(__('Are you sure you want to delete this campaign?', 'fendi-inventory-system'))) {
            api.deleteDiscountCampaign(id).then(() => {
                loadCampaigns();
            });
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{__('Discount Campaigns', 'fendi-inventory-system')}</h1>
            <div className="text-right mb-4">
                <button onClick={() => { setEditingCampaign(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm">
                    {__('Create New Campaign', 'fendi-inventory-system')}
                </button>
            </div>
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-xl font-bold mb-4">
                        {editingCampaign ? __('Edit Campaign', 'fendi-inventory-system') : __('Create New Campaign', 'fendi-inventory-system')}
                    </h2>
                    <DiscountCampaignForm
                        campaign={editingCampaign}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            )}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Name', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Code', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Type', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Value', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{__('Status', 'fendi-inventory-system')}</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map(campaign => {
                            const today = new Date().toISOString().slice(0, 10);
                            const startDate = campaign.meta._start_date ? campaign.meta._start_date[0] : '';
                            const endDate = campaign.meta._end_date ? campaign.meta._end_date[0] : '';
                            const isActive = (startDate === '' || today >= startDate) && (endDate === '' || today <= endDate);

                            return (
                                <tr key={campaign.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{campaign.title.rendered}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-mono">{campaign.meta._code[0]}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{campaign.meta._type[0]}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{campaign.meta._value[0]}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {isActive ? __('Active', 'fendi-inventory-system') : __('Inactive', 'fendi-inventory-system')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                        <button onClick={() => { setEditingCampaign(campaign); setIsModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">{__('Edit', 'fendi-inventory-system')}</button>
                                        <button onClick={() => handleDelete(campaign.id)} className="text-red-600 hover:text-red-900">{__('Delete', 'fendi-inventory-system')}</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {campaigns.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">{__('No campaigns found. Click "Create New Campaign" to get started.', 'fendi-inventory-system')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscountCampaignManagement;
