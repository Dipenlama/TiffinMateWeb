"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/actions/auth-action"; // <-- backend API

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const result = await handleLogin({ email, password });

      if (!result.success) throw new Error(result.message || "Login failed");

      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white font-sans">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-orange-500 relative overflow-hidden">
        <div className="relative z-10 w-full flex flex-col justify-center items-center text-white p-12 text-center">
          <Utensils size={80} className="mb-6" />
          <h1 className="text-5xl font-extrabold mb-4">TiffinMate</h1>
          <p className="text-xl font-light max-w-md">
            The taste of home, delivered straight to your doorstep.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-orange-500 mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-8">
            Please enter your credentials to access your account.
          </p>

          {/* Error / Success */}
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {successMessage && <p className="text-green-600 mb-2">{successMessage}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-10 py-3 border rounded-lg focus:ring-orange-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-10 py-3 border rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            New to TiffinMate?
            <button
              onClick={() => router.push("/register")}
              className="ml-2 text-orange-600 font-semibold hover:underline"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
