"use client";

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Utensils } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 lg:p-0">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl items-stretch">
        
        {/* Left Side: Branding Card */}
        <div className="hidden lg:flex lg:w-1/2 justify-center items-center p-12">
          <div className="bg-[#FFF7ED] rounded-[40px] p-12 flex flex-col items-center text-center w-full max-w-lg aspect-square justify-center shadow-sm">
            <div className="mb-6">
              {/* Replace with your actual image asset */}
              <img 
                src="/tiffin-illustration.png" 
                alt="TiffinMate Illustration" 
                className="w-64 h-64 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-[#4A3728] tracking-tight">TIFFINMATE</h1>
            <p className="text-xl font-medium text-[#4A3728] mt-2 tracking-[0.2em]">DAILY TREATS</p>
          </div>
        </div>

        {/* Right Side: Sign Up Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-16 lg:px-20 py-12">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Get Started</h2>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-8">Create New Account</h3>

            <form className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-[#F0F5FA] border-none rounded-xl py-4 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Dipen lama"
                  />
                </div>

              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full bg-[#F0F5FA] border-none rounded-xl py-4 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-[#F0F5FA] border-none rounded-xl py-4 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="* * * * * * * * * * * *"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
              </div>

              {/* Retype Password Field */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Retype Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full bg-[#F0F5FA] border-none rounded-xl py-4 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="* * * * * * * * * * * *"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Sign Up Button */}
              <div className="pt-4">
                <button
                onClick={() => router.push('/login')}
                  type="button"
                  className="w-full bg-[#E85916] hover:bg-[#d44e13] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all uppercase tracking-widest text-sm"
                >
                  Sign Up
                </button>
              </div>

              <div className="text-center mt-8">
                <p className="text-gray-500 text-sm font-medium">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#007AFF] font-bold hover:underline ml-1">
                    LOG IN
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;