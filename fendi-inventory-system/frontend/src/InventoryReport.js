import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import api from './api';
import * as XLSX from 'xlsx';

const InventoryReport = () => {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    api.getProducts().then((response) => {
      setProducts(response.data);
    });
    api.getWarehouses().then((response) => {
      setWarehouses(response.data);
    });
  }, []);

  const handleExport = () => {
    const data = products.map((product) => {
      const row = { Product: product.name };
      warehouses.forEach((warehouse) => {
        row[warehouse.title.rendered] = product.warehouse_stock[warehouse.id] || 0;
      });
      row.Total = Object.values(product.warehouse_stock).reduce(
        (total, stock) => total + parseInt(stock || 0),
        0
      );
      return row;
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Report');
    XLSX.writeFile(workbook, 'inventory_report.xlsx');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{__('Inventory Report', 'fendi-inventory-system')}</h1>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleExport}
        >
          {__('Export to Excel', 'fendi-inventory-system')}
        </button>
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">{__('Product', 'fendi-inventory-system')}</th>
            {warehouses.map((warehouse) => (
              <th key={warehouse.id} className="px-4 py-2">
                {warehouse.title.rendered}
              </th>
            ))}
            <th className="px-4 py-2">{__('Total', 'fendi-inventory-system')}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.name}</td>
              {warehouses.map((warehouse) => (
                <td key={warehouse.id} className="border px-4 py-2">
                  {product.warehouse_stock[warehouse.id] || 0}
                </td>
              ))}
              <td className="border px-4 py-2">
                {Object.values(product.warehouse_stock).reduce(
                  (total, stock) => total + parseInt(stock || 0),
                  0
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryReport;
