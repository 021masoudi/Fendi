import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import * as api from './api';
import JsBarcode from 'jsbarcode';

const BarcodeManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    api.getProducts().then((response) => {
      setProducts(response.data);
    });
  }, []);

  const handleProductSelect = (e) => {
    const product = products.find(p => p.id === parseInt(e.target.value));
    setSelectedProduct(product);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{__('Barcode Management', 'fendi-inventory-system')}</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {__('Select Product', 'fendi-inventory-system')}
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleProductSelect}
        >
          <option>{__('Select a product', 'fendi-inventory-system')}</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
      </div>
      {selectedProduct && (
        <div className="printable-area">
          <h3 className="text-lg font-bold mb-2">{selectedProduct.name}</h3>
          <svg id="barcode"></svg>
          <script>
            {`JsBarcode("#barcode", "${selectedProduct.sku || selectedProduct.id}");`}
          </script>
        </div>
      )}
      {selectedProduct && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handlePrint}
        >
          {__('Print Barcode', 'fendi-inventory-system')}
        </button>
      )}
    </div>
  );
};

export default BarcodeManagement;
