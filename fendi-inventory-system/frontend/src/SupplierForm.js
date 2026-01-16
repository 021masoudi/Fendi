import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';

const SupplierForm = ({ supplier, onSave, onCancel }) => {
    const [name, setName] = useState(supplier ? supplier.title.rendered : '');
    const [phone, setPhone] = useState(supplier ? supplier.meta._supplier_phone : '');
    const [email, setEmail] = useState(supplier ? supplier.meta._supplier_email : '');
    const [address, setAddress] = useState(supplier ? supplier.meta._supplier_address : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            title: name,
            meta: {
                _supplier_phone: phone,
                _supplier_email: email,
                _supplier_address: address,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">
                {supplier ? __('Edit Supplier', 'fendi-inventory-system') : __('Add Supplier', 'fendi-inventory-system')}
            </h2>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    {__('Name', 'fendi-inventory-system')}
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    {__('Phone', 'fendi-inventory-system')}
                </label>
                <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    {__('Email', 'fendi-inventory-system')}
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                    {__('Address', 'fendi-inventory-system')}
                </label>
                <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="flex items-center justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {__('Save', 'fendi-inventory-system')}
                </button>
                <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
                    {__('Cancel', 'fendi-inventory-system')}
                </button>
            </div>
        </form>
    );
};

export default SupplierForm;
