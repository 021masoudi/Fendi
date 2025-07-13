import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';

const QuickCustomerForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            // Error is handled in the parent component
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">{__('Add New Customer', 'fendi-inventory-system')}</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700">{__('First Name', 'fendi-inventory-system')}</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">{__('Last Name', 'fendi-inventory-system')}</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{__('Email Address', 'fendi-inventory-system')}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{__('Phone', 'fendi-inventory-system')}</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">{__('Cancel', 'fendi-inventory-system')}</button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400">{isSubmitting ? __('Saving...', 'fendi-inventory-system') : __('Save Customer', 'fendi-inventory-system')}</button>
            </div>
        </form>
    );
};

export default QuickCustomerForm;
