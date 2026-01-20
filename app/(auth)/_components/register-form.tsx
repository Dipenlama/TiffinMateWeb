"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from '../schema';
import { useRouter } from "next/navigation";
import { handleRegister } from "@/lib/actions/auth-action";
import { Eye, EyeOff } from "lucide-react";

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await handleRegister(data);
      if (!result.success) throw new Error(result.message);
      setError("");
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setSuccessMessage("");
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 lg:p-0">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl items-stretch">

        {/* Left Branding */}
        <div className="hidden lg:flex lg:w-1/2 justify-center items-center p-12">
          <div className="bg-[#fdfaf6] rounded-[40px] p-12 flex flex-col items-center text-center w-full max-w-lg aspect-square justify-center shadow-sm">
            <img
              src="/tiffin-illustration.png"
              alt="TiffinMate"
              className="w-64 h-64 object-contain mb-6"
            />
            <h1 className="text-4xl font-bold text-[#4A3728]">TIFFINMATE</h1>
            <p className="text-xl font-medium tracking-[0.2em] mt-2 text-[#4A3728]">
              DAILY TREATS
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-1/2 flex justify-center px-6 md:px-16 py-12">
          <div className="max-w-md w-full">
            <h2 className="text-sm font-bold text-orange-200 uppercase mb-1">
              Get Started
            </h2>
            <h3 className="text-3xl font-extrabold text-orange-500 mb-8">
              Create New Account
            </h3>

            {error && (
              <p className="text-red-600 text-sm mb-4 font-medium">{error}</p>
            )}

            {successMessage && (
              <p className="text-green-600 text-sm mb-4 font-medium">{successMessage}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500">
                  Full Name
                </label>
                <input
                  {...register("username")}
                  type="text"
                  placeholder="Dipen Tamang"
                  className="w-full bg-[#abb8c5] rounded-xl py-4 px-4 mt-2"
                />
                {errors.username && (
                  <span className="text-red-500 text-sm">{errors.username.message}</span>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full bg-[#abb8c5] rounded-xl py-4 px-4 mt-2"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500">
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="* * * * * * * *"
                    className="w-full bg-[#abb8c5] rounded-xl py-4 px-4 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">{errors.password.message}</span>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500">
                  Confirm Password
                </label>
                <div className="relative mt-2">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="* * * * * * * *"
                    className="w-full bg-[#abb8c5] rounded-xl py-4 px-4 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E85916] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#d44e13] transition-all"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-bold text-blue-600 hover:underline"
              >
                LOG IN
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
