import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import api from './api';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [username, setUsername] = useState(user ? user.data.user_login : '');
  const [email, setEmail] = useState(user ? user.data.user_email : '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user ? user.roles[0] : 'subscriber');
  const [assignedWarehouse, setAssignedWarehouse] = useState(user ? user.meta._assigned_warehouse : '');
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    api.getWarehouses().then((response) => {
      setWarehouses(response.data);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, email, password, role, meta: { _assigned_warehouse: assignedWarehouse } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          {__('Username', 'fendi-inventory-system')}
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          {__('Email', 'fendi-inventory-system')}
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          {__('Password', 'fendi-inventory-system')}
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={user ? __('Leave blank to keep current password', 'fendi-inventory-system') : ''}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
          {__('Role', 'fendi-inventory-system')}
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="cashier">{__('Cashier', 'fendi-inventory-system')}</option>
          <option value="warehouse_manager">{__('Warehouse Manager', 'fendi-inventory-system')}</option>
          <option value="administrator">{__('Administrator', 'fendi-inventory-system')}</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assigned-warehouse">
          {__('Assigned Warehouse', 'fendi-inventory-system')}
        </label>
        <select
          id="assigned-warehouse"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={assignedWarehouse}
          onChange={(e) => setAssignedWarehouse(e.target.value)}
        >
          <option value="">{__('None', 'fendi-inventory-system')}</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.title.rendered}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {user ? __('Update User', 'fendi-inventory-system') : __('Add User', 'fendi-inventory-system')}
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

export default UserForm;
