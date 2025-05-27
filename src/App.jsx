import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import TransactionsPage from './features/transactions/TransactionsPage';
import AdminDashboard from './features/dashboard/AdminDashboard';
import CentralAdminDashboard from './features/dashboard/CentralLabAdminDashboard';
import LabAssistantDashboard from './features/dashboard/LabAssistantDashboard';
import FacultyDashboard from './features/dashboard/FacultyDashboard';
import NotificationPage from './features/notification/NotificationPage';
import RequestPage from './features/requests/RequestPage';
import QuotationPage from './features/quotations/QuotationPage';
import UnauthorizedPage from './UnauthorizedPage';
import ExperimentsPage from './pages/ExperimentsPage';
import UserManagement from './features/users/UserManagement';
import ProductList from './features/products/ProductList';
import VendorList from './features/vendor/VendorList';
import InvoicePage from './features/invoice/InvoicePage';
import InvoiceList from './features/invoice/InvoiceList';
import VendorInvoices from './features/vendor/VendorInvoices';
import PasswordResetFlow from './features/auth/PasswordResetFlow';

import Home from './Home';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-[#F8F4F6] to-[#F0E6EE]">
          <Routes>
            {/* Public Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/vendor-invoices" element={<VendorInvoices />} />
            <Route path="/password-reset" element={<PasswordResetFlow />} />

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Protected Routes */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/central"
              element={
                <ProtectedRoute allowedRoles={['central_lab_admin']}>
                      <CentralAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lab"
              element={
                <ProtectedRoute allowedRoles={['lab_assistant']}>
                 
                      <LabAssistantDashboard />
                   
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/faculty"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                      <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute allowedRoles={['central_lab_admin', 'lab_assistant']}>
                  <div className="p-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E8D8E1] p-6">
                      <TransactionsPage />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['admin', 'faculty', 'lab_assistant', 'central_lab_admin']}>
                  <div className="p-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E8D8E1] p-6">
                      <NotificationPage />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/request"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <div className="p-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E8D8E1] p-6">
                      <RequestPage />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quotation"
              element={
                <ProtectedRoute allowedRoles={['central_lab_admin', 'admin']}>
                  <div className="p-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E8D8E1] p-2">
                      <QuotationPage />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/experiments"
              element={
                <ProtectedRoute allowedRoles={['admin', 'central_lab_admin']}>
                  <div className="p-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E8D8E1] p-6">
                      <div className="bg-[#6D123F] p-4 text-white text-center rounded-lg">
                        <h1 className="text-2xl font-bold">Lab Management System</h1>
                      </div>
                      <ExperimentsPage />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route path="/users" element={<UserManagement />} />
            <Route path="/invoices/create" element={<InvoicePage />} />
            <Route path="/invoices" element={<InvoiceList />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;