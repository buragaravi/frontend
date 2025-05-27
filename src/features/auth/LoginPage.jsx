import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post('https://pharmacy-stocks-backend.onrender.com/api/auth/login', {
                email,
                password,
            });

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('labId', user.labId || '');
            localStorage.setItem('user', JSON.stringify(user));
            
            // Navigate to role-specific dashboard
            switch (user.role) {
                case 'admin':
                    navigate('/dashboard/admin');
                    break;
                case 'central_lab_admin':
                    navigate('/dashboard/central');
                    break;
                case 'lab_assistant':
                    navigate('/dashboard/lab');
                    break;
                case 'faculty':
                    navigate('/dashboard/faculty');
                    break;
                default:
                    setError('Unknown user role');
                    break;
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5F9FD] to-[#E1F1FF]">
            <div className="bg-[#0B3861] p-4 text-white text-center">
                  <h1 className="text-2xl font-bold">Lab Management System</h1>
            </div>
            {/* Container for desktop layout */}
            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center lg:justify-center min-h-screen">
                {/* Logo Section */}
                <div className="w-full lg:w-1/4 flex flex-col items-center lg:items-start mb-8 lg:mb-0 lg:pr-8">
                    <div className="w-32 h-32 bg-[#0B3861] rounded-full flex items-center justify-center mb-4">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-10 w-10 text-white" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-[#0B3861] text-center lg:text-left">LabConnect</h1>
                    <p className="text-[#64B5F6] mt-2 text-center lg:text-left">
                        Laboratory Management System
                    </p>
                </div>

                {/* Login Card */}
                <div className="w-full lg:w-1/2 max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#BCE0FD]">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-[#0B3861] mb-6">Sign in to your account</h2>
                            
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

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[#0B3861] mb-1">
                                        Email address
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
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-4 py-3 border border-[#BCE0FD] rounded-lg focus:ring-2 focus:ring-[#0B3861] focus:border-transparent text-[#0B3861] placeholder-[#64B5F6] transition-all duration-200"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-[#0B3861] focus:ring-[#0B3861] border-[#BCE0FD] rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-[#0B3861]">
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <button
                                            type="button"
                                            className="font-medium text-[#0B3861] hover:text-[#1E88E5] bg-transparent border-none p-0 m-0 cursor-pointer"
                                            onClick={() => navigate('/password-reset')}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                </div>

                                <div>
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
                                                Signing in...
                                            </>
                                        ) : 'Sign in'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="px-8 py-4 bg-[#F5F9FD] border-t border-[#BCE0FD] text-center">
                            <p className="text-sm text-[#0B3861]">
                                Don't have an account?{' '}
                                <a href="/register" className="font-medium text-[#0B3861] hover:text-[#1E88E5]">
                                    Register here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;