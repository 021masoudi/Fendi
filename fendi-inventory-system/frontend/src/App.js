import React from 'react';
import { __ } from '@wordpress/i18n';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserManagement from './UserManagement';
import WarehouseManagement from './WarehouseManagement';
import POS from './POS';

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{__('Fendi Inventory System', 'fendi-inventory-system')}</h1>
        <nav className="mb-4">
          <ul className="flex">
            <li className="mr-6">
              <Link to="/users" className="text-blue-500 hover:text-blue-800">{__('User Management', 'fendi-inventory-system')}</Link>
            </li>
            <li className="mr-6">
              <Link to="/warehouses" className="text-blue-500 hover:text-blue-800">{__('Warehouse Management', 'fendi-inventory-system')}</Link>
            </li>
            <li className="mr-6">
              <Link to="/pos" className="text-blue-500 hover:text-blue-800">{__('POS', 'fendi-inventory-system')}</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/users" element={<UserManagement />} />
          <Route path="/warehouses" element={<WarehouseManagement />} />
          <Route path="/pos" element={<POS />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
