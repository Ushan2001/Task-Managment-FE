'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import { toast } from 'sonner';
import { Layers, Loader2, User as UserIcon, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { AuthLeftPanel } from '@/components/auth-left-panel';

export default function RegisterPage() {
  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'User' | 'Admin'>('User');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  useEffect(() => {
    // Redirect if already logged in
    if (user && !authLoading) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  const isValidEmail = (value: string) => {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    fieldName: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (errors[fieldName as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) newErrors.name = 'Full Name is required';
    if (!email.trim()) newErrors.email = 'Email address is required';
    else if (!isValidEmail(email)) newErrors.email = 'Please enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please correct the errors before submitting');
      return;
    }

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password, role);
      toast.success('Registration successful! Welcome aboard.');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Email might be already in use.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen md:overflow-hidden overflow-y-auto flex items-stretch bg-[#F5F7F9] p-6 gap-6 select-none">
      {/* Reusable Auth Left Panel component */}
      <AuthLeftPanel />

      {/* Right panel: Register form */}
      <div className="flex-1 flex flex-col justify-between items-center py-4 md:py-6 px-4 md:px-0">
        <div className="w-full max-w-[480px] my-auto space-y-6">

          {/* Logo container */}
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/20">
                <Layers size={24} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-2xl tracking-wider text-[#231F20] font-sans">
                ApexFlow
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center space-y-2">
            <h1 className="text-[26px] sm:text-[28px] font-bold text-[#231F20] font-sans">
              Create Workspace Account
            </h1>
            <p className="text-[14px] text-[#9B9B9B] leading-relaxed">
              Register to start creating, tracking, and prioritizing team tasks.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name Field */}
            <div className="flex flex-col gap-1">
              <div
                className={`relative flex items-center border-[1.5px] rounded-[16px] bg-white transition-all duration-250 focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(255,80,45,0.1)] ${errors.name ? 'border-[#e74c3c]' : 'border-[#cbd5e1]'
                  }`}
              >
                <div className="px-4 flex items-center justify-center">
                  <UserIcon size={20} className="text-[#94a3b8]" />
                </div>
                <div className="w-[1.5px] h-[28px] bg-[#cbd5e1] align-self-center" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={handleInputChange(setName, 'name')}
                  className="flex-1 py-3.5 px-4 bg-transparent text-[15px] text-[#334155] outline-none font-sans w-full"
                />
              </div>
              {errors.name && (
                <span className="text-[13px] mt-0.5 pl-2 font-sans font-medium text-[#e74c3c]">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <div
                className={`relative flex items-center border-[1.5px] rounded-[16px] bg-white transition-all duration-250 focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(255,80,45,0.1)] ${errors.email ? 'border-[#e74c3c]' : 'border-[#cbd5e1]'
                  }`}
              >
                <div className="px-4 flex items-center justify-center">
                  <Mail size={20} className="text-[#94a3b8]" />
                </div>
                <div className="w-[1.5px] h-[28px] bg-[#cbd5e1] align-self-center" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={handleInputChange(setEmail, 'email')}
                  className="flex-1 py-3.5 px-4 bg-transparent text-[15px] text-[#334155] outline-none font-sans w-full"
                />
                {email && (
                  <div className="px-4 flex items-center">
                    {isValidEmail(email) ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="10" fill="#2ecc71" />
                        <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="10" fill="#e74c3c" />
                        <path d="M6 6L14 14M14 6L6 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              {errors.email && (
                <span className="text-[13px] mt-0.5 pl-2 font-sans font-medium text-[#e74c3c]">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Access Role Dropdown */}
            <div className="flex flex-col gap-1">
              <div className="relative flex items-center border-[1.5px] border-[#cbd5e1] rounded-[16px] bg-white transition-all duration-250 focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(255,80,45,0.1)]">
                <div className="px-4 flex items-center justify-center">
                  <Shield size={20} className="text-[#94a3b8]" />
                </div>
                <div className="w-[1.5px] h-[28px] bg-[#cbd5e1] align-self-center" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'User' | 'Admin')}
                  className="flex-1 py-3.5 px-3 bg-transparent text-[15px] text-[#334155] outline-none font-sans w-full cursor-pointer appearance-none pr-8"
                >
                  <option value="User">Regular User (Sees assigned tasks)</option>
                  <option value="Admin">Administrator (Manages all tasks)</option>
                </select>
                <div className="absolute right-4 pointer-events-none text-[#94a3b8]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <div
                className={`relative flex items-center border-[1.5px] rounded-[16px] bg-white transition-all duration-250 focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(255,80,45,0.1)] ${errors.password ? 'border-[#e74c3c]' : 'border-[#cbd5e1]'
                  }`}
              >
                <div className="px-4 flex items-center justify-center">
                  <Lock size={20} className="text-[#94a3b8]" />
                </div>
                <div className="w-[1.5px] h-[28px] bg-[#cbd5e1] align-self-center" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (Min 6 chars)"
                  value={password}
                  onChange={handleInputChange(setPassword, 'password')}
                  className="flex-1 py-3.5 px-4 bg-transparent text-[15px] text-[#334155] outline-none font-sans w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="px-4 bg-none border-none cursor-pointer flex items-center text-[#94a3b8] hover:text-[#64748b] transition-colors focus:outline-none"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" />
                    ) : (
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.39 1 12A18.45 18.45 0 0 1 5.06 5.06M9.9 4.24A9.12 9.12 0 0 1 12 4C17 4 21.27 7.61 23 12A18.5 18.5 0 0 1 19.42 16.42M14.12 14.12A3 3 0 1 1 9.88 9.88M1 1L23 23" />
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <span className="text-[13px] mt-0.5 pl-2 font-sans font-medium text-[#e74c3c]">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand text-white border-none rounded-[16px] py-3.5 px-6 text-[16px] font-semibold cursor-pointer font-sans transition-all duration-250 shadow-[0_8px_20px_-6px_rgba(255,80,45,0.4)] hover:bg-[#e04324] hover:translate-y-[-2px] hover:shadow-[0_12px_24px_-6px_rgba(255,80,45,0.5)] active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Registering...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </form>

          {/* SignIn Link */}
          <div className="text-center pt-2">
            <p className="text-[14px] text-[#475569] font-sans">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-brand font-bold underline hover:text-[#e04324] ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info links */}
        <div className="text-center mt-6">
          <p className="text-[13px] text-[#94a3b8] font-sans leading-relaxed">
            By registering, you agree to the ApexFlow{' '}
            <a
              href="https://apexflow.com/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline hover:text-[#e04324] font-medium"
            >
              Terms & Conditions
            </a>
            {' and '}
            <a
              href="https://apexflow.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline hover:text-[#e04324] font-medium"
            >
              Privacy Policy.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
