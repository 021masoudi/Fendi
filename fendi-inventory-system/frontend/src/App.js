import React from 'react';
import { __ } from '@wordpress/i18n';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserManagement from './UserManagement';
import WarehouseManagement from './WarehouseManagement';
import POS from './POS';
import Reports from './Reports';
import StockRequests from './StockRequests';
import SupplierManagement from './SupplierManagement';
import PurchaseOrderManagement from './PurchaseOrderManagement';
import FinancialReports from './FinancialReports';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    api.getCurrentUserData().then((response) => {
      setCurrentUser(response.data);
    });
  }, []);

  if (!currentUser) {
    return <div>{__('Loading...', 'fendi-inventory-system')}</div>;
  }

  const canAccess = (role) => {
    if (!currentUser) return false;
    return currentUser.roles.includes(role) || currentUser.roles.includes('administrator');
  };

  return (
    <Router>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{__('Fendi Inventory System', 'fendi-inventory-system')}</h1>
        <nav className="mb-4">
          <ul className="flex">
            {canAccess('administrator') && (
              <li className="mr-6">
                <Link to="/users" className="text-blue-500 hover:text-blue-800">{__('User Management', 'fendi-inventory-system')}</Link>
              </li>
            )}
            {canAccess('warehouse_manager') && (
              <li className="mr-6">
                <Link to="/warehouses" className="text-blue-500 hover:text-blue-800">{__('Warehouse Management', 'fendi-inventory-system')}</Link>
              </li>
            )}
            {canAccess('cashier') && (
              <li className="mr-6">
                <Link to="/pos" className="text-blue-500 hover:text-blue-800">{__('POS', 'fendi-inventory-system')}</Link>
              </li>
            )}
            {canAccess('administrator') && (
              <li className="mr-6">
                <Link to="/reports" className="text-blue-500 hover:text-blue-800">{__('Reports', 'fendi-inventory-system')}</Link>
              </li>
            )}
            {canAccess('warehouse_manager') && (
              <li className="mr-6">
                <Link to="/stock-requests" className="text-blue-500 hover:text-blue-800">{__('Stock Requests', 'fendi-inventory-system')}</Link>
              </li>
            )}
            {canAccess('accountant') && (
              <>
                <li className="mr-6">
                  <Link to="/suppliers" className="text-blue-500 hover:text-blue-800">{__('Suppliers', 'fendi-inventory-system')}</Link>
                </li>
                <li className="mr-6">
                  <Link to="/purchase-orders" className="text-blue-500 hover:text-blue-800">{__('Purchase Orders', 'fendi-inventory-system')}</Link>
                </li>
                <li className="mr-6">
                  <Link to="/financial-reports" className="text-blue-500 hover:text-blue-800">{__('Financial Reports', 'fendi-inventory-system')}</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <Routes>
          {canAccess('administrator') && <Route path="/users" element={<UserManagement />} />}
          {canAccess('warehouse_manager') && <Route path="/warehouses" element={<WarehouseManagement />} />}
          {canAccess('cashier') && <Route path="/pos" element={<POS />} />}
          {canAccess('administrator') && <Route path="/reports" element={<Reports />} />}
          {canAccess('warehouse_manager') && <Route path="/stock-requests" element={<StockRequests />} />}
          {canAccess('accountant') && (
            <>
              <Route path="/suppliers" element={<SupplierManagement />} />
              <Route path="/purchase-orders" element={<PurchaseOrderManagement />} />
              <Route path="/financial-reports" element={<FinancialReports />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
