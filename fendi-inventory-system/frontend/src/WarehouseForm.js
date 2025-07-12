import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';

const WarehouseForm = ({ warehouse, onSubmit, onCancel }) => {
  const [name, setName] = useState(warehouse ? warehouse.title.rendered : '');
  const [isCentral, setIsCentral] = useState(warehouse ? warehouse.meta._is_central : false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title: name, meta: { _is_central: isCentral } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          {__('Warehouse Name', 'fendi-inventory-system')}
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="is-central">
          <input
            id="is-central"
            type="checkbox"
            checked={isCentral}
            onChange={(e) => setIsCentral(e.target.checked)}
            className="mr-2"
          />
          {__('Is Central Warehouse?', 'fendi-inventory-system')}
        </label>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {warehouse ? __('Update Warehouse', 'fendi-inventory-system') : __('Add Warehouse', 'fendi-inventory-system')}
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onCancel}
        >
          {__('Cancel', 'fendi-inventory-system')}
        </button>
      </div>
    </form>
  );
};

export default WarehouseForm;
