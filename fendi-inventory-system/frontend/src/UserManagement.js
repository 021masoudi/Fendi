import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import api from './api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.getUsers().then((response) => {
      setUsers(response.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">{__('User Management', 'fendi-inventory-system')}</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {__('Add New User', 'fendi-inventory-system')}
      </button>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">{__('Username', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Role', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Status', 'fendi-inventory-system')}</th>
            <th className="px-4 py-2">{__('Actions', 'fendi-inventory-system')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.ID}>
              <td className="border px-4 py-2">{user.data.user_login}</td>
              <td className="border px-4 py-2">{user.roles[0]}</td>
              <td className="border px-4 py-2">{__('Active', 'fendi-inventory-system')}</td>
              <td className="border px-4 py-2">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2">
                  {__('Edit', 'fendi-inventory-system')}
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                  {__('Delete', 'fendi-inventory-system')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
