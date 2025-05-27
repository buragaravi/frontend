import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import QuotationPage from '../quotations/QuotationPage';
import ChemicalDashboard from '../chemicals/ChemicalDashboard';
import TransactionsPage from '../transactions/TransactionsPage';
import UserDetails from '../../components/UserDetails';
import ExperimentsPage from '../../pages/ExperimentsPage';
import LabRequestListPage from '../requests/LabRequestListPage';
import ProductList from '../products/ProductList';
import IndentPage from '../indents/IndentPage';

const menuItems = [
  { key: 'chemicals', label: 'Chemicals', component: <ChemicalDashboard /> },
  { key: 'quotations', label: 'Quotations', component: <QuotationPage /> },
  { key: 'indents', label: 'Indents', component: <IndentPage /> },
  { key: 'transactions', label: 'Transactions', component: <TransactionsPage /> },
  { key: 'experiments', label: 'Experiments', component: <ExperimentsPage /> },
  { key: 'products', label: 'Products', component: <ProductList /> },
  { key: 'profile', label: 'Profile', component: <UserDetails /> },
  { key: 'labrequests', label: 'Lab Requests', component: null },
];

const labList = ['LAB01', 'LAB02', 'LAB03', 'LAB04', 'LAB05', 'LAB06', 'LAB07', 'LAB08'];

const LIGHT_BG = 'linear-gradient(135deg, #F5F9FD 0%, #E1F1FF 100%)';
const DARK_BG = 'linear-gradient(135deg, #0B3861 0%, #1E88E5 100%)';

const CentralLabAdminDashboard = () => {
  const [selected, setSelected] = useState('chemicals');
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedLab, setExpandedLab] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const renderLabRequests = () => {
    if (expandedLab) {
      return (
        <>
          <div className="flex flex-row flex-wrap gap-3 mb-6 items-center justify-between relative">
            <div className="flex flex-wrap gap-3 flex-grow">
              {labList.map((lab) => (
                <button
                  key={lab}
                  className={`px-4 py-2 rounded-full font-bold shadow border-2 transition-all duration-200 text-sm md:text-base focus:outline-none ${
                    expandedLab === lab
                      ? 'bg-blue-700 text-white border-blue-700 scale-110'
                      : 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 hover:border-blue-400 scale-90 opacity-80'
                  }`}
                  onClick={() => setExpandedLab(lab)}
                >
                  {lab}
                </button>
              ))}
            </div>
            <button
              className="ml-2 p-2 rounded-full bg-blue-100 text-blue-900 border border-blue-300 hover:bg-blue-200 font-bold text-lg flex items-center justify-center shadow transition-colors"
              style={{ minWidth: 36, minHeight: 36 }}
              onClick={() => setExpandedLab(null)}
              title="Close"
            >
              <span className="text-xl leading-none">✖</span>
            </button>
          </div>
          <LabRequestListPage labId={expandedLab} key={expandedLab} />
        </>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {labList.map((lab) => (
          <div
            key={lab}
            className="aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-blue-50 border-2 border-blue-400 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-200 overflow-hidden group"
            onClick={() => setExpandedLab(lab)}
          >
            <span className="text-2xl font-extrabold text-blue-900 drop-shadow mb-2">{lab}</span>
            <span className="text-lg font-semibold text-blue-700 mb-2">Lab Requests</span>
            <span className="inline-block bg-white/80 text-blue-700 font-bold rounded-lg px-4 py-2 mt-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">View</span>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (selected === 'labrequests') return renderLabRequests();
    if (selected === 'indents') return <IndentPage />;
    const found = menuItems.find((item) => item.key === selected);
    return found ? found.component : null;
  };

  // Theme-based classes
  const isDark = theme === 'dark';
  const sidebarBg = isDark
    ? 'bg-[#0B3861]/90 border-[#BCE0FD] text-white backdrop-blur-xl'
    : 'bg-white/90 border-[#BCE0FD] text-[#0B3861] backdrop-blur-xl';
  const mainBg = isDark
    ? 'bg-[#0B3861]/70 border-[#BCE0FD]'
    : 'bg-white/70 border-[#BCE0FD]';
  const buttonActive = isDark
    ? 'bg-gradient-to-r from-[#0B3861] via-[#64B5F6] to-[#0B3861] text-white shadow-lg border border-[#BCE0FD] scale-105'
    : 'bg-gradient-to-r from-[#F5F9FD] via-white to-[#E1F1FF] text-[#0B3861] shadow-lg border border-[#BCE0FD] scale-105';
  const buttonInactive = isDark
    ? 'bg-[#0B3861]/40 text-[#BCE0FD] hover:bg-[#64B5F6]/60 hover:text-white border border-transparent'
    : 'bg-white/30 text-[#0B3861] hover:bg-[#BCE0FD]/60 hover:text-[#0B3861] border border-transparent';

  return (    <div
      className="flex min-h-screen font-sans transition-colors duration-500 overflow-hidden"
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

      {/* Sidebar */}      <aside
        className={`fixed inset-y-0 left-0 w-72 flex flex-col backdrop-blur-2xl shadow-2xl border transition-all duration-300 ${
          isDark
            ? 'bg-[#0B3861]/90 border-[#BCE0FD] text-white'
            : 'bg-white/90 border-[#BCE0FD] text-[#0B3861]'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:rounded-none z-40`}
        style={{
          boxShadow: isDark
            ? '0 8px 32px rgba(188, 224, 253, 0.1)'
            : '0 8px 32px rgba(11, 56, 97, 0.1)',
        }}
      >        <div className="flex flex-col h-full">
          <div className="p-6 text-center flex flex-col items-center gap-2">
            <h1 className="text-3xl font-extrabold drop-shadow-lg tracking-tight">
              Central Lab Admin
            </h1>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`mt-2 px-4 py-1 rounded-full border transition-colors duration-300 ${
                isDark
                  ? 'bg-[#0B3861] text-[#BCE0FD] border-[#BCE0FD] hover:bg-[#64B5F6] hover:text-white'
                  : 'bg-[#F5F9FD] text-[#0B3861] border-[#BCE0FD] hover:bg-[#64B5F6] hover:text-white'
              }`}
              title="Toggle theme"
            >
              {isDark ? '🌙 Dark' : '☀️ Light'}
            </button>          </div>
          <nav className="flex-1 px-6 overflow-y-auto no-scrollbar">
            <div className="flex flex-col gap-3">
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
                  boxShadow: selected === item.key
                    ? isDark
                      ? '0 4px 12px rgba(188, 224, 253, 0.15)'
                      : '0 4px 12px rgba(11, 56, 97, 0.15)'
                    : undefined,
                }}
              >
                {item.label}
              </button>            ))}
            </div>
          </nav>
        </div>
        {/* User Info & Logout at Bottom */}
        <div className="p-6 flex flex-col items-center gap-2 border-t border-[#BCE0FD]/30">
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
                  ) : user.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    user.email.charAt(0).toUpperCase()
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
            className={`mt-2 w-full py-2 rounded-xl font-semibold transition-all duration-300 ${
              isDark
                ? 'bg-[#3b4a6b] text-blue-100 border border-[#b6e0fe] hover:bg-[#b6e0fe] hover:text-[#232946]'
                : 'bg-blue-100 text-blue-900 border border-blue-300 hover:bg-blue-400 hover:text-white'
            }`}
          >
            Logout
          </button>
        </div>
      </aside>
      {/* Main Content */}      <main className="flex-1 flex items-start justify-center p-2 md:p-6 transition-colors duration-300 md:ml-72 mt-4">
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

export default CentralLabAdminDashboard;