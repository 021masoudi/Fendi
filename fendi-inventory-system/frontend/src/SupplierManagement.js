import React, { useState, useEffect } from 'react';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from './api';
import Modal from './Modal';
import SupplierForm from './SupplierForm';
import { __ } from '@wordpress/i18n';

const SupplierManagement = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        const response = await getSuppliers();
        setSuppliers(response.data);
    };

    const handleCreate = () => {
        setSelectedSupplier(null);
        setIsModalOpen(true);
    };

    const handleEdit = (supplier) => {
        setSelectedSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        await deleteSupplier(id);
        fetchSuppliers();
    };

    const handleSave = async (supplierData) => {
        if (selectedSupplier) {
            await updateSupplier(selectedSupplier.id, supplierData);
        } else {
            await createSupplier(supplierData);
        }
        fetchSuppliers();
        setIsModalOpen(false);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{__('Supplier Management', 'fendi-inventory-system')}</h2>
            <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                {__('Add Supplier', 'fendi-inventory-system')}
            </button>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">{__('Name', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Phone', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Email', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Address', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Actions', 'fendi-inventory-system')}</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier.id}>
                            <td className="border px-4 py-2">{supplier.title.rendered}</td>
                            <td className="border px-4 py-2">{supplier.meta._supplier_phone}</td>
                            <td className="border px-4 py-2">{supplier.meta._supplier_email}</td>
                            <td className="border px-4 py-2">{supplier.meta._supplier_address}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleEdit(supplier)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                                    {__('Edit', 'fendi-inventory-system')}
                                </button>
                                <button onClick={() => handleDelete(supplier.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                                    {__('Delete', 'fendi-inventory-system')}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <Modal closeModal={() => setIsModalOpen(false)}>
                    <SupplierForm
                        supplier={selectedSupplier}
                        onSave={handleSave}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default SupplierManagement;
