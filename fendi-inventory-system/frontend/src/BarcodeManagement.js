import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';
import JsBarcode from 'jsbarcode';

const BarcodeManagement = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [template, setTemplate] = useState('');

    useEffect(() => {
        api.getProducts().then(response => {
            setProducts(response.data);
        });
        // Fetch the active barcode label template
        api.getPrintTemplates().then(response => {
            const barcodeTemplate = response.data.find(t => t.meta._type && t.meta._type[0] === 'barcode_label');
            if (barcodeTemplate) {
                setTemplate(barcodeTemplate.post_content);
            } else {
                // Fallback template
                setTemplate('<div style="text-align: center; padding: 10px; border: 1px solid black; width: 200px; margin: auto;"><h4>{{product_name}}</h4><p>{{product_price}}</p>{{barcode_svg}}</div>');
            }
        });
    }, []);

    const getProcessedHtml = (product) => {
        if (!product || !template) return '';

        const svgContainer = document.createElement('div');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        JsBarcode(svg, product.sku || product.id, {
            format: 'CODE128',
            xmlns: 'http://www.w3.org/2000/svg',
            width: 2,
            height: 50,
            fontSize: 16
        });

        return template
            .replace(/{{product_name}}/g, product.name)
            .replace(/{{product_price}}/g, product.price)
            .replace(/{{barcode_svg}}/g, svg.outerHTML);
    };

    const handlePrint = () => {
        const processedHtml = getProcessedHtml(selectedProduct);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>Print Barcode</title></head><body>${processedHtml}</body></html>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{__('Barcode Management', 'fendi-inventory-system')}</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <select onChange={e => setSelectedProduct(products.find(p => p.id === parseInt(e.target.value)))} className="w-full p-2 border rounded-md mb-4">
                    <option value="">{__('Select a product', 'fendi-inventory-system')}</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>

                {selectedProduct && (
                    <div>
                        <div className="p-4 border rounded-md" dangerouslySetInnerHTML={{ __html: getProcessedHtml(selectedProduct) }} />
                        <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4">{__('Print Barcode', 'fendi-inventory-system')}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarcodeManagement;
