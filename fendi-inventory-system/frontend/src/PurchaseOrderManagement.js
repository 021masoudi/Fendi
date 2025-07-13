import React, { useState, useEffect } from 'react';
import { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, getSuppliers, getProducts } from './api';
import Modal from './Modal';
import PurchaseOrderForm from './PurchaseOrderForm';
import { __ } from '@wordpress/i18n';

const PurchaseOrderManagement = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);

    useEffect(() => {
        fetchPurchaseOrders();
        fetchSuppliers();
        fetchProducts();
    }, []);

    const fetchPurchaseOrders = async () => {
        const response = await getPurchaseOrders();
        setPurchaseOrders(response.data);
    };

    const fetchSuppliers = async () => {
        const response = await getSuppliers();
        setSuppliers(response.data);
    };

    const fetchProducts = async () => {
        const response = await getProducts();
        setProducts(response.data);
    };

    const handleCreate = () => {
        setSelectedPurchaseOrder(null);
        setIsModalOpen(true);
    };

    const handleEdit = (purchaseOrder) => {
        setSelectedPurchaseOrder(purchaseOrder);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        await deletePurchaseOrder(id);
        fetchPurchaseOrders();
    };

    const handleSave = async (purchaseOrderData) => {
        if (selectedPurchaseOrder) {
            await updatePurchaseOrder(selectedPurchaseOrder.id, purchaseOrderData);
        } else {
            await createPurchaseOrder(purchaseOrderData);
        }
        fetchPurchaseOrders();
        setIsModalOpen(false);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{__('Purchase Order Management', 'fendi-inventory-system')}</h2>
            <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                {__('Add Purchase Order', 'fendi-inventory-system')}
            </button>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">{__('Title', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Supplier', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Status', 'fendi-inventory-system')}</th>
                        <th className="py-2">{__('Actions', 'fendi-inventory-system')}</th>
                    </tr>
                </thead>
                <tbody>
                    {purchaseOrders.map((po) => (
                        <tr key={po.id}>
                            <td className="border px-4 py-2">{po.title.rendered}</td>
                            <td className="border px-4 py-2">
                                {suppliers.find((s) => s.id === po.meta._supplier_id)?.title.rendered}
                            </td>
                            <td className="border px-4 py-2">{po.meta._status}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleEdit(po)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                                    {__('Edit', 'fendi-inventory-system')}
                                </button>
                                <button onClick={() => handleDelete(po.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                                    {__('Delete', 'fendi-inventory-system')}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <Modal closeModal={() => setIsModalOpen(false)}>
                    <PurchaseOrderForm
                        purchaseOrder={selectedPurchaseOrder}
                        suppliers={suppliers}
                        products={products}
                        onSave={handleSave}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default PurchaseOrderManagement;
