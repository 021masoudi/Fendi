import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import api from './api';
import Modal from './Modal';
import UserForm from './UserForm';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    api.getUsers().then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingUser) {
      api.updateUser(editingUser.ID, data).then((response) => {
        setUsers(
          users.map((user) => (user.ID === editingUser.ID ? response.data : user))
        );
      });
    } else {
      api.createUser(data).then((response) => {
        setUsers([...users, response.data]);
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm(__('Are you sure you want to delete this user?', 'fendi-inventory-system'))) {
      api.deleteUser(id).then(() => {
        setUsers(users.filter((user) => user.ID !== id));
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">{__('User Management', 'fendi-inventory-system')}</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAddUser}
      >
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
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                  onClick={() => handleEditUser(user)}
                >
                  {__('Edit', 'fendi-inventory-system')}
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => handleDeleteUser(user.ID)}
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
          <UserForm
            user={editingUser}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;
