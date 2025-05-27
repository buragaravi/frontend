import React, { useEffect, useState } from 'react';
import UserDetails from '../../components/UserDetails';
import QuotationPage from '../quotations/QuotationPage';
import ChemicalDashboard from '../chemicals/ChemicalDashboard';
import TransactionsPage from '../transactions/TransactionsPage';
// import AnalyticsContainer from '../../components/analytics/AnalyticsContainer';
import { jwtDecode } from 'jwt-decode';
import { useQuery } from '@tanstack/react-query';
import ExperimentsPage from '../../pages/ExperimentsPage';
import UserManagement from '../users/UserManagement';

const menuItems = [
  { key: 'chemicals', label: 'Chemicals', component: <ChemicalDashboard /> },
  { key: 'quotations', label: 'Quotations', component: <QuotationPage /> },
  { key: 'experiments', label: 'Experiments', component: <ExperimentsPage /> },
  { key: 'transactions', label: 'Transactions', component: <TransactionsPage /> },
  { key: 'users', label: 'Users', component: <UserManagement /> },
  { key: 'profile', label: 'Profile', component: <UserDetails /> },
];

const AdminDashboard = () => {
  const [selected, setSelected] = useState('quotations');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info (optional, for avatar/name/email)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:7000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };  const LIGHT_BG = 'linear-gradient(135deg, #F5F9FD 0%, #E1F1FF 100%)';
  const DARK_BG = 'linear-gradient(135deg, #0B3861 0%, #1E88E5 100%)';
  const isDark = false; // We'll use light theme by default like Central Lab Admin
  const sidebarBg = 'bg-white/90 border-[#BCE0FD] text-[#0B3861] backdrop-blur-xl';
  const mainBg = 'bg-white/70 border-[#BCE0FD]';
  const buttonActive = 'bg-gradient-to-r from-[#F5F9FD] via-white to-[#E1F1FF] text-[#0B3861] shadow-lg border border-[#BCE0FD] scale-105';
  const buttonInactive = 'bg-white/30 text-[#0B3861] hover:bg-[#BCE0FD]/60 hover:text-[#0B3861] border border-transparent';

  const renderContent = () => {
    const found = menuItems.find((item) => item.key === selected);
    return found ? found.component : null;
  };

  return (    <div
      className="flex min-h-screen font-sans transition-colors duration-500 overflow-hidden"
      style={{
        background: LIGHT_BG
      }}
    >
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-100 text-blue-900 p-2 rounded-full shadow-lg border border-blue-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Open sidebar"
      >
        <span className="text-2xl">{sidebarOpen ? '✖' : '☰'}</span>
      </button>

      {/* Sidebar */}      <aside
        className={`
          fixed left-0 top-0 bottom-0 w-72 border-r backdrop-blur-2xl shadow-2xl transition-all duration-500 z-40
          flex flex-col h-full py-6
          ${sidebarBg}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
        style={{
          boxShadow: '0 8px 32px rgba(11, 56, 97, 0.1)'
        }}
      >
        <div className="flex-1 overflow-y-auto px-6">
          <div className="mb-8 text-center">            <h1 className="text-2xl font-extrabold text-[#0B3861] tracking-tight">
              Admin Panel
            </h1>
          </div>          <nav className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setSelected(item.key);
                  setSidebarOpen(false); // close sidebar on mobile
                }}
                className={`py-2.5 px-4 rounded-xl transition-all font-semibold text-base flex items-center gap-2 w-full
                  ${selected === item.key ? buttonActive : buttonInactive}
                  `}style={{
                  boxShadow: selected === item.key ? '0 6px 24px 0 rgba(79, 70, 229, 0.15)' : undefined,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>        {/* User Info & Logout at Bottom */}
        <div className="px-6 py-4 border-t border-[#BCE0FD]/30 mt-auto">
          {loading ? (
            <div className="w-full flex justify-center items-center py-4">
              <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></span>
            </div>
          ) : user ? (
            <div className="w-full flex flex-col items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-900 shadow-md mb-1">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    user.name
                      ? user.name.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()
                  )}
                </div>                <span className="font-semibold text-base text-[#0B3861] truncate">{user.name || user.email}</span>
                <span className="text-xs text-[#64B5F6] truncate">{user.email}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-400">User not found</div>
          )}          <button
            onClick={handleLogout}
            className="mt-4 w-full py-2 rounded-xl font-semibold transition-all duration-300 bg-blue-100 text-blue-900 border border-blue-300 hover:bg-blue-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}      <main className="flex-1 min-h-screen md:ml-72 p-2 md:p-8 transition-colors duration-500 overflow-auto">
        <div
          className={`w-full max-w-5xl mx-auto backdrop-blur-2xl rounded-3xl shadow-2xl p-2 md:p-10 border transition-all duration-500 ${mainBg}`}style={{
            background: '#fff',
            boxShadow: '0 12px 48px 0 rgba(11, 56, 97, 0.15)'
          }}
        >
          <div className="mt-2 md:mt-6">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
