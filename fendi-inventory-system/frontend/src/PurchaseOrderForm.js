import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';

const PurchaseOrderForm = ({ purchaseOrder, suppliers, products, onSave, onCancel }) => {
    const [title, setTitle] = useState(purchaseOrder ? purchaseOrder.title.rendered : '');
    const [supplierId, setSupplierId] = useState(purchaseOrder ? purchaseOrder.meta._supplier_id : '');
    const [status, setStatus] = useState(purchaseOrder ? purchaseOrder.meta._status : 'pending');
    const [cart, setCart] = useState(purchaseOrder ? purchaseOrder.meta._products : []);

    const handleProductChange = (productId, quantity) => {
        const existingProduct = cart.find((item) => item.id === productId);
        if (existingProduct) {
            setCart(
                cart.map((item) =>
                    item.id === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
                )
            );
        } else {
            const product = products.find((p) => p.id === productId);
            setCart([...cart, { id: productId, name: product.name, quantity: parseInt(quantity, 10) }]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            title,
            meta: {
                _supplier_id: supplierId,
                _status: status,
                _products: cart,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">
                {purchaseOrder ? __('Edit Purchase Order', 'fendi-inventory-system') : __('Add Purchase Order', 'fendi-inventory-system')}
            </h2>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    {__('Title', 'fendi-inventory-system')}
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supplier">
                    {__('Supplier', 'fendi-inventory-system')}
                </label>
                <select
                    id="supplier"
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                >
                    <option value="">{__('Select a supplier', 'fendi-inventory-system')}</option>
                    {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                            {supplier.title.rendered}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {__('Products', 'fendi-inventory-system')}
                </label>
                {products.map((product) => (
                    <div key={product.id} className="flex items-center mb-2">
                        <span className="w-1/2">{product.name}</span>
                        <input
                            type="number"
                            min="0"
                            value={cart.find((item) => item.id === product.id)?.quantity || 0}
                            onChange={(e) => handleProductChange(product.id, e.target.value)}
                            className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                ))}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                    {__('Status', 'fendi-inventory-system')}
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="pending">{__('Pending', 'fendi-inventory-system')}</option>
                    <option value="completed">{__('Completed', 'fendi-inventory-system')}</option>
                </select>
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

export default PurchaseOrderForm;
