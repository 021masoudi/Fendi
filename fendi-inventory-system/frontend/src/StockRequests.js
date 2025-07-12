import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import api from './api';
import Modal from './Modal';
import StockRequestForm from './StockRequestForm';

const StockRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.getStockRequests().then((response) => {
      setRequests(response.data);
    });
  }, []);

  const handleCreateRequest = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    api.createStockRequest(data).then((response) => {
      setRequests([...requests, response.data]);
      setIsModalOpen(false);
    });
  };

  const handleUpdateRequest = (id, status) => {
    api.updateStockRequest(id, { status }).then((response) => {
      setRequests(
        requests.map((request) =>
          request.id === id ? response.data : request
        )
      );
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{__('Stock Requests', 'fendi-inventory-system')}</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleCreateRequest}
      >
        {__('Create New Request', 'fendi-inventory-system')}
      </button>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">{__('ID', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Source Warehouse', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Destination Warehouse', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Status', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Actions', 'fendi-inventory-system')}</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="border px-4 py-2">{request.id}</td>
              <td className="border px-4 py-2">{request.meta._source_warehouse[0]}</td>
              <td className="border px-4 py-2">{request.meta._destination_warehouse[0]}</td>
              <td className="border px-4 py-2">{request.meta._status[0]}</td>
              <td className="border px-4 py-2">
                {request.meta._status[0] === 'pending' && (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() => handleUpdateRequest(request.id, 'approved')}
                    >
                      {__('Approve', 'fendi-inventory-system')}
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleUpdateRequest(request.id, 'rejected')}
                    >
                      {__('Reject', 'fendi-inventory-system')}
                    </button>
                  </>
                )}
                {request.meta._status[0] === 'approved' && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleUpdateRequest(request.id, 'completed')}
                  >
                    {__('Mark as Completed', 'fendi-inventory-system')}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <StockRequestForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default StockRequests;
