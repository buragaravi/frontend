import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4"
         style={{
           background: 'linear-gradient(135deg, #F5F9FD 0%, #E1F1FF 100%)',
         }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#0B3861]">
          Access Denied
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          You don't have permission to access this page
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#0B3861] text-white rounded-lg hover:bg-[#1E88E5] transition-colors shadow-lg"
        >
          Return Home
        </motion.button>
      </motion.div>

      {/* Background Decorations */}
      <motion.div 
        className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #BCE0FD 0%, #64B5F6 100%)',
          opacity: 0.1
        }}
      />
      <motion.div 
        className="absolute -right-32 -top-32 w-96 h-96 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #64B5F6 0%, #0B3861 100%)',
          opacity: 0.1
        }}
      />
    </div>
  );
};

export default UnauthorizedPage;