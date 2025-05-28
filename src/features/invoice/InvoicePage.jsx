// InvoicePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceForm from './InvoiceForm';
import InvoiceList from './InvoiceList';

const CARD_STYLE =
  'flex flex-col items-center justify-center cursor-pointer rounded-xl shadow-md border border-[#E8D8E1] p-6 m-2 transition-all duration-200 hover:shadow-lg hover:bg-blue-50 min-w-[160px] min-h-[120px]';

const InvoicePage = () => {
  const [activeModule, setActiveModule] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (module) => {
    setActiveModule((prev) => (prev === module ? null : module));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FD] to-[#E1F1FF] flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-7xl mx-auto px-2 md:px-8">
        <button
          className="mb-6 px-4 py-2 bg-[#0B3861] text-white rounded-lg hover:bg-[#1E88E5] transition-colors flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#0B3861] mb-2 tracking-tight drop-shadow-sm">
          Invoice Management
        </h1>
        <p className="text-center text-[#6D123F]/80 mb-8 text-lg">
          Easily create and manage your invoices with a modern, interactive
          interface.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center mb-10">
          <div
            className={
              CARD_STYLE +
              (activeModule === 'create'
                ? ' ring-4 ring-blue-400 scale-105 bg-blue-50'
                : ' bg-white hover:scale-105')
            }
            onClick={() => handleCardClick('create')}
            aria-pressed={activeModule === 'create'}
            tabIndex={0}
            role="button"
            style={{ transition: 'all 0.2s' }}
          >
            <svg
              className="w-10 h-10 mb-3 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                strokeWidth="2"
                stroke="currentColor"
                fill="#E3F2FD"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v8m4-4H8"
              />
            </svg>
            <span className="font-semibold text-blue-900 text-lg">
              Create Invoice
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Add a new invoice to the system
            </span>
          </div>
          <div
            className={
              CARD_STYLE +
              (activeModule === 'list'
                ? ' ring-4 ring-blue-400 scale-105 bg-blue-50'
                : ' bg-white hover:scale-105')
            }
            onClick={() => handleCardClick('list')}
            aria-pressed={activeModule === 'list'}
            tabIndex={0}
            role="button"
            style={{ transition: 'all 0.2s' }}
          >
            <svg
              className="w-10 h-10 mb-3 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect
                x="4"
                y="6"
                width="16"
                height="12"
                rx="2"
                fill="#E3F2FD"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h8M8 14h5"
              />
            </svg>
            <span className="font-semibold text-blue-900 text-lg">
              Invoice List
            </span>
            <span className="text-xs text-gray-500 mt-1">
              View and manage all invoices
            </span>
          </div>
        </div>
        <div className="mt-2 min-h-[350px] w-full">
          {activeModule === null && (
            <div className="flex flex-col items-center justify-center h-60 bg-white/80 rounded-2xl border border-[#E8D8E1] shadow-inner animate-fade-in w-full">
              <svg
                className="w-16 h-16 text-blue-200 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="#E3F2FD"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v8m4-4H8"
                />
              </svg>
              <p className="text-lg text-[#0B3861]/80 font-medium">
                Select an option above to get started!
              </p>
            </div>
          )}
          {activeModule === 'create' && (
            <div className="bg-white rounded-2xl shadow-lg border border-[#E8D8E1] p-8 animate-fade-in w-full">
              <h2 className="text-xl font-semibold text-[#0B3861] mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Create New Invoice
              </h2>
              <InvoiceForm />
            </div>
          )}
          {activeModule === 'list' && (
            <div className="bg-white rounded-2xl shadow-lg border border-[#E8D8E1] p-8 animate-fade-in w-full">
              <h2 className="text-xl font-semibold text-[#0B3861] mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Invoice List
              </h2>
              <InvoiceList />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
