"use client";

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Utensils } from 'lucide-react';
import router from 'next/router';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white font-sans">
      {/* Left Side: Branding & Image (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            {/* Pattern or subtle food texture can go here */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-20"></div>
        </div>
        
        <div className="relative z-10 w-full flex flex-col justify-center items-center text-white p-12 text-center">
          <Utensils size={80} className="mb-6" />
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">TiffinMate</h1>
          <p className="text-xl font-light max-w-md">
            The taste of home, delivered straight to your doorstep. Join our community of food lovers today.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 lg:hidden flex items-center gap-2 text-orange-600">
             <Utensils size={32} />
             <span className="text-2xl font-bold">TiffinMate</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Please enter your credentials to access your account.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-500">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
            onClick={() => router.push('/dashboard')}
              type="submit"
              className="w-full bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
            >
              Sign In
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
             <p className="text-gray-600">
               New to TiffinMate? 
               <button 
               onClick={() => router.push("/register")}
               className="ml-2 font-semibold text-orange-600 hover:underline">
                 Create an account
               </button>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LoginPage;