import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import api from './api';
import Modal from './Modal';
import WarehouseForm from './WarehouseForm';

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  useEffect(() => {
    api.getWarehouses().then((response) => {
      setWarehouses(response.data);
    });
  }, []);

  const handleAddWarehouse = () => {
    setEditingWarehouse(null);
    setIsModalOpen(true);
  };

  const handleEditWarehouse = (warehouse) => {
    setEditingWarehouse(warehouse);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingWarehouse) {
      api.updateWarehouse(editingWarehouse.id, data).then((response) => {
        setWarehouses(
          warehouses.map((warehouse) =>
            warehouse.id === editingWarehouse.id ? response.data : warehouse
          )
        );
      });
    } else {
      api.createWarehouse(data).then((response) => {
        setWarehouses([...warehouses, response.data]);
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteWarehouse = (id) => {
    if (window.confirm(__('Are you sure you want to delete this warehouse?', 'fendi-inventory-system'))) {
      api.deleteWarehouse(id).then(() => {
        setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id));
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">{__('Warehouse Management', 'fendi-inventory-system')}</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAddWarehouse}
      >
        {__('Add New Warehouse', 'fendi-inventory-system')}
      </button>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">{__('Name', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Actions', 'fendi-inventory-system')}</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => (
            <tr key={warehouse.id}>
              <td className="border px-4 py-2">{warehouse.title.rendered}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                  onClick={() => handleEditWarehouse(warehouse)}
                >
                  {__('Edit', 'fendi-inventory-system')}
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => handleDeleteWarehouse(warehouse.id)}
                >
                  {__('Delete', 'fendi-inventory-system')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <WarehouseForm
            warehouse={editingWarehouse}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default WarehouseManagement;
