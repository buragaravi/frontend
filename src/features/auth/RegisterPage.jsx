import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [userId, setUserId] = useState('');
    const [labId, setLabId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const payload = role === 'lab_assistant'
                ? { userId, name, email, password, role, labId }
                : { userId, name, email, password, role };

            const response = await axios.post('http://localhost:7000/api/auth/register', payload);
            navigate('/login', { state: { registrationSuccess: true } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5F9FD] to-[#E1F1FF]">
            <div className="bg-[#0B3861] p-4 text-white text-center">
                <h1 className="text-2xl font-bold">Lab Management System</h1>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center justify-center px-4 py-8">
                <div className="hidden lg:flex flex-col items-start justify-center w-1/2 max-w-xl pr-12">
                    <div className="w-32 h-32 bg-[#0B3861] rounded-full flex items-center justify-center mb-6">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-16 w-16 text-white" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-[#0B3861] mb-4">Join LabConnect</h1>
                    <p className="text-xl text-[#64B5F6]">
                        Register to access the laboratory management system
                    </p>
                </div>

                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#BCE0FD]">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-[#0B3861] mb-6">Create your account</h2>
                            
                            {error && (
                                <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-5 w-5 mr-2" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                        />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-[#0B3861] mb-1">
                                        Select Your Role
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                className="h-5 w-5 text-[#64B5F6]" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                                                />
                                            </svg>
                                        </div>
                                        <select
                                            id="role"
                                            className="w-full pl-10 pr-4 py-3 border border-[#BCE0FD] rounded-lg focus:ring-2 focus:ring-[#0B3861] focus:border-transparent text-[#0B3861] appearance-none transition-all duration-200"
                                            value={role}
                                            onChange={(e) => {
                                                setRole(e.target.value);
                                                if (e.target.value !== 'lab_assistant') setLabId('');
                                            }}
                                            required
                                        >
                                            <option value="">Select your role</option>
                                            <option value="admin">Admin</option>
                                            <option value="central_lab_admin">Central Lab Admin</option>
                                            <option value="lab_assistant">Lab Assistant</option>
                                            <option value="faculty">Faculty</option>
                                        </select>
                                    </div>
                                </div>

                                {role === 'lab_assistant' && (
                                    <div>
                                        <label htmlFor="labId" className="block text-sm font-medium text-[#0B3861] mb-1">
                                            Select Lab
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    className="h-5 w-5 text-[#64B5F6]" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24" 
                                                    stroke="currentColor"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth={2} 
                                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                                                    />
                                                </svg>
                                            </div>
                                            <select
                                                id="labId"
                                                className="w-full pl-10 pr-4 py-3 border border-[#BCE0FD] rounded-lg focus:ring-2 focus:ring-[#0B3861] focus:border-transparent text-[#0B3861] appearance-none transition-all duration-200"
                                                value={labId}
                                                onChange={(e) => setLabId(e.target.value)}
                                                required
                                            >
                                                <option value="">Select your lab</option>
                                                {['LAB01', 'LAB02', 'LAB03', 'LAB04', 'LAB05', 'LAB06', 'LAB07', 'LAB08'].map((lab) => (
                                                    <option key={lab} value={lab}>{lab}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="userId" className="block text-sm font-medium text-[#0B3861] mb-1">
                                        User ID
                                    </label>
                                    <input
                                        id="userId"
                                        type="text"
                                        placeholder="Enter your university ID"
                                        className="w-full px-4 py-3 border border-[#BCE0FD] rounded-lg focus:ring-2 focus:ring-[#0B3861] focus:border-transparent text-[#0B3861] placeholder-[#64B5F6] transition-all duration-200"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-[#0B3861] mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 border border-[#BCE0FD] rounded-lg focus:ring-2 focus:ring-[#0B3861] focus:border-transparent text-[#0B3861] placeholder-[#64B5F6] transition-all duration-200"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[#0B3861] mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                className="h-5 w-5 text-[#64B5F6]" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="you@university.edu"
                                            className="w-full pl-10 pr-4 py-3 border border-[#BCE0FD] rounded-lg focus:ring-2 focus:ring-[#0B3861] focus:border-transparent text-[#0B3861] placeholder-[#64B5F6] transition-all duration-200"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-[#0B3861] mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                className="h-5 w-5 text-[#64B5F6]" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Create a password"
                                            className="w-full pl-10 pr-4 py-3 border border-[#BCE0FD] rounded-lg focus:ring-2 focus:ring-[#0B3861] focus:border-transparent text-[#0B3861] placeholder-[#64B5F6] transition-all duration-200"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-[#64B5F6]">
                                        Use 8 or more characters with a mix of letters, numbers & symbols
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0B3861] hover:bg-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B3861] transition-colors duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating account...
                                            </>
                                        ) : 'Create Account'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="px-8 py-4 bg-[#F5F9FD] border-t border-[#BCE0FD] text-center">
                            <p className="text-sm text-[#0B3861]">
                                Already have an account?{' '}
                                <a href="/login" className="font-medium text-[#0B3861] hover:text-[#1E88E5]">
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;