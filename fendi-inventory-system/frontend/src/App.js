import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { idb } from './idb';
import * as api from './api';
import UserManagement from './UserManagement';
import WarehouseManagement from './WarehouseManagement';
import POS from './POS';
import Reports from './Reports';
import StockRequests from './StockRequests';
import SupplierManagement from './SupplierManagement';
import PurchaseOrderManagement from './PurchaseOrderManagement';
import FinancialReports from './FinancialReports';
import Notifications from './Notifications';
import ExpenseManagement from './ExpenseManagement';
import TransactionManagement from './TransactionManagement';
import Ledger from './Ledger';
import BalanceSheet from './BalanceSheet';
import CashDrawerManagement from './CashDrawerManagement';
import BarcodeManagement from './BarcodeManagement';
import InventoryCount from './InventoryCount';
import AccountsReceivable from './AccountsReceivable';
import AccountsPayable from './AccountsPayable';
import SMSSettings from './SMSSettings';
import LoyaltySettings from './LoyaltySettings';
import DiscountCampaignManagement from './DiscountCampaignManagement';
import TimeClock from './TimeClock';
import TimeLogReport from './TimeLogReport';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync offline data when online
      idb.getAll('sales').then(sales => {
        sales.forEach(sale => {
          api.createOrder(sale).then(() => {
            idb.delete('sales', sale.id);
          });
        });
      });
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    api.getCurrentUserData().then((response) => {
      setCurrentUser(response.data);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{__('Fendi Inventory System', 'fendi-inventory-system')}</h1>
          {!isOnline && (
            <div className="text-red-500 font-bold">
              {__('Offline Mode', 'fendi-inventory-system')}
            </div>
          )}
        </div>
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
            {canAccess('warehouse_manager') && (
              <li className="mr-6">
                <Link to="/barcode" className="text-blue-500 hover:text-blue-800">{__('Barcode Management', 'fendi-inventory-system')}</Link>
              </li>
            )}
            {canAccess('warehouse_manager') && (
              <li className="mr-6">
                <Link to="/inventory-count" className="text-blue-500 hover:text-blue-800">{__('Inventory Count', 'fendi-inventory-system')}</Link>
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
                <li className="mr-6">
                  <Link to="/expenses" className="text-blue-500 hover:text-blue-800">{__('Expenses', 'fendi-inventory-system')}</Link>
                </li>
                <li className="mr-6">
                  <Link to="/transactions" className="text-blue-500 hover:text-blue-800">{__('Transactions', 'fendi-inventory-system')}</Link>
                </li>
                <li className="mr-6">
                  <Link to="/ledger" className="text-blue-500 hover:text-blue-800">{__('Ledger', 'fendi-inventory-system')}</Link>
                </li>
                <li className="mr-6">
                  <Link to="/balance-sheet" className="text-blue-500 hover:text-blue-800">{__('Balance Sheet', 'fendi-inventory-system')}</Link>
                </li>
                <li className="mr-6">
                  <Link to="/accounts-receivable" className="text-blue-500 hover:text-blue-800">{__('Accounts Receivable', 'fendi-inventory-system')}</Link>
                </li>
                <li className="mr-6">
                  <Link to="/accounts-payable" className="text-blue-500 hover:text-blue-800">{__('Accounts Payable', 'fendi-inventory-system')}</Link>
                </li>
              </>
            )}
            {canAccess('cashier') && (
              <li className="mr-6">
                <Link to="/cash-drawer" className="text-blue-500 hover:text-blue-800">{__('Cash Drawer', 'fendi-inventory-system')}</Link>
              </li>
            )}
            {canAccess('administrator') && (
              <li className="mr-6">
                <Link to="/notifications" className="text-blue-500 hover:text-blue-800">{__('Notifications', 'fendi-inventory-system')}</Link>
              </li>
            )}
             {canAccess('administrator') && (
              <li className="mr-6">
                <Link to="/settings/sms" className="text-blue-500 hover:text-blue-800">{__('SMS Settings', 'fendi-inventory-system')}</Link>
              </li>
            )}
            {canAccess('administrator') && (
                <li className="mr-6">
                    <Link to="/settings/loyalty" className="text-blue-500 hover:text-blue-800">{__('Loyalty Settings', 'fendi-inventory-system')}</Link>
                </li>
            )}
            {canAccess('administrator') && (
                <li className="mr-6">
                    <Link to="/discounts" className="text-blue-500 hover:text-blue-800">{__('Discount Campaigns', 'fendi-inventory-system')}</Link>
                </li>
            )}
            {canAccess('administrator') && (
                <li className="mr-6">
                    <Link to="/reports/time-logs" className="text-blue-500 hover:text-blue-800">{__('Time Log Report', 'fendi-inventory-system')}</Link>
                </li>
            )}
          </ul>
        </nav>
        {isOnline && <TimeClock currentUser={currentUser} />}
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
              <Route path="/expenses" element={<ExpenseManagement />} />
              <Route path="/transactions" element={<TransactionManagement />} />
              <Route path="/ledger" element={<Ledger />} />
              <Route path="/balance-sheet" element={<BalanceSheet />} />
              <Route path="/accounts-receivable" element={<AccountsReceivable />} />
              <Route path="/accounts-payable" element={<AccountsPayable />} />
            </>
          )}
          {canAccess('warehouse_manager') && <Route path="/barcode" element={<BarcodeManagement />} />}
          {canAccess('warehouse_manager') && <Route path="/inventory-count" element={<InventoryCount />} />}
          {canAccess('cashier') && <Route path="/cash-drawer" element={<CashDrawerManagement />} />}
          {canAccess('administrator') && <Route path="/notifications" element={<Notifications />} />}
          {canAccess('administrator') && <Route path="/settings/sms" element={<SMSSettings />} />}
          {canAccess('administrator') && <Route path="/settings/loyalty" element={<LoyaltySettings />} />}
          {canAccess('administrator') && <Route path="/discounts" element={<DiscountCampaignManagement />} />}
          {canAccess('administrator') && <Route path="/reports/time-logs" element={<TimeLogReport />} />}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
