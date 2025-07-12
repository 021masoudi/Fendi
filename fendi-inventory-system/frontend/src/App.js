import React from 'react';
import { __ } from '@wordpress/i18n';
import UserManagement from './UserManagement';

const App = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{__('Fendi Inventory System', 'fendi-inventory-system')}</h1>
      <UserManagement />
    </div>
  );
};

export default App;
