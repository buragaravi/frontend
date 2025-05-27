import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import QuotationPage from '../quotations/QuotationPage';
import IndentPage from '../indents/IndentPage';
import ChemicalDashboard from '../chemicals/ChemicalDashboard';
import TransactionsPage from '../transactions/TransactionsPage';
import LabRequestListPage from '../requests/LabRequestListPage';
import UserDetails from '../../components/UserDetails';

const menuItems = [
  { key: 'quotations', label: 'Quotations', component: <QuotationPage /> },
  { key: 'indents', label: 'Indents', component: <IndentPage /> },
  { key: 'chemicals', label: 'Chemicals', component: <ChemicalDashboard /> },
  { key: 'requests', label: 'Lab Requests', component: null },
  { key: 'transactions', label: 'Transactions', component: <TransactionsPage /> },
  { key: 'profile', label: 'Profile', component: <UserDetails /> },
];

const LIGHT_BG = 'linear-gradient(135deg, #F5F9FD 0%, #E1F1FF 100%)';
const DARK_BG = 'linear-gradient(135deg, #0B3861 0%, #1E88E5 100%)';

const LabAssistantDashboard = () => {
  const [labId, setLabId] = useState('');
  const [selected, setSelected] = useState('quotations');
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:7000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch labId from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const { labId } = decoded.user;
        setLabId(labId);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const renderContent = () => {
    switch (selected) {
      case 'quotations':
        return <QuotationPage />;
      case 'indents':
        return <IndentPage />;
      case 'chemicals':
        return <ChemicalDashboard />;
      case 'requests':
        return <LabRequestListPage labId={labId} />;
      case 'transactions':
        return <TransactionsPage />;
      case 'profile':
        return <UserDetails />;
      default:
        return null;
    }
  };

  // Theme-based classes
  const isDark = theme === 'dark';
  const sidebarBg = isDark
    ? 'bg-[#0B3861]/60 border-[#BCE0FD] text-white'
    : 'bg-white/40 border-[#BCE0FD] text-[#0B3861]';
  const mainBg = isDark
    ? 'bg-[#0B3861]/70 border-[#BCE0FD]'
    : 'bg-white/70 border-[#BCE0FD]';
  const buttonActive = isDark
    ? 'bg-gradient-to-r from-[#0B3861] via-[#64B5F6] to-[#0B3861] text-white shadow-lg border border-[#BCE0FD] scale-105'
    : 'bg-gradient-to-r from-[#F5F9FD] via-white to-[#E1F1FF] text-[#0B3861] shadow-lg border border-[#BCE0FD] scale-105';
  const buttonInactive = isDark
    ? 'bg-[#0B3861]/40 text-[#BCE0FD] hover:bg-[#64B5F6]/60 hover:text-white border border-transparent'
    : 'bg-white/30 text-[#0B3861] hover:bg-[#BCE0FD]/60 hover:text-[#0B3861] border border-transparent';

  return (
    <div
      className={`flex min-h-screen font-sans transition-colors duration-500`}
      style={{
        background: isDark ? DARK_BG : LIGHT_BG,
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

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 flex flex-col backdrop-blur-2xl shadow-2xl border transition-all duration-300 ${sidebarBg} ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
        style={{
          boxShadow: isDark
            ? '0 12px 48px 0 rgba(35, 41, 70, 0.28)'
            : '0 12px 48px 0 rgba(31, 38, 135, 0.18)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 text-center flex flex-col items-center gap-2 border-b border-[#BCE0FD]/30">
            <h1 className="text-3xl font-extrabold drop-shadow-lg tracking-tight">
              Lab Management
            </h1>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`mt-2 px-4 py-1 rounded-full border transition-all duration-300 ${
                isDark
                  ? 'bg-[#3b4a6b] text-blue-100 border-[#b6e0fe] hover:bg-[#b6e0fe] hover:text-[#232946]'
                  : 'bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-400 hover:text-white'
              }`}
              title="Toggle theme"
            >
              {isDark ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6">
            <nav className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setSelected(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`py-3 px-5 rounded-xl transition-all font-semibold text-lg flex items-center gap-2 ${
                    selected === item.key ? buttonActive : buttonInactive
                  }`}
                  style={{
                    boxShadow:
                      selected === item.key
                        ? isDark
                          ? '0 4px 12px rgba(188, 224, 253, 0.15)'
                          : '0 4px 12px rgba(11, 56, 97, 0.15)'
                        : undefined,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* User Info & Logout */}
          <div className="p-6 border-t border-[#BCE0FD]/30">
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
                      user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="font-semibold text-base truncate">{user.name || user.email}</span>
                  <span className="text-xs text-blue-500 truncate">{user.email}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-red-400">User not found</div>
            )}
            <button
              onClick={handleLogout}
              className={`mt-4 w-full py-2 rounded-xl font-semibold transition-all duration-300 ${
                isDark
                  ? 'bg-[#3b4a6b] text-blue-100 border border-[#b6e0fe] hover:bg-[#b6e0fe] hover:text-[#232946]'
                  : 'bg-blue-100 text-blue-900 border border-blue-300 hover:bg-blue-400 hover:text-white'
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center p-2 md:p-6 transition-colors duration-300 md:ml-72 mt-4">
        <div
          className={`w-full max-w-4xl backdrop-blur-2xl rounded-xl shadow-xl p-4 md:p-8 border transition-all duration-300 ${mainBg}`}
          style={{
            background: !isDark ? '#fff' : undefined,
            boxShadow: isDark
              ? '0 12px 48px 0 rgba(35, 41, 70, 0.28)'
              : '0 12px 48px 0 rgba(31, 38, 135, 0.18)',
          }}
        >
          <div className="mt-2">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default LabAssistantDashboard;
