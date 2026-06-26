'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import { toast } from 'sonner';
import { Layers, Loader2 } from 'lucide-react';
import { AuthLeftPanel } from '@/components/auth-left-panel';

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    // Redirect if already logged in
    if (user && !authLoading) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  // Load remembered credentials on mount
  useEffect(() => {
    try {
      const remembered = localStorage.getItem('rememberedCredentials');
      if (remembered) {
        const credentials = JSON.parse(remembered);
        setEmail(credentials.email || '');
        setPassword(credentials.password || '');
        setRememberMe(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const formatIdentifier = (value: string) => {
    if (!value) return value;
    if (value.startsWith('07') && value.length === 10 && /^\d+$/.test(value)) {
      return '+94' + value.substring(1);
    }
    if (value.startsWith('7') && value.length === 9 && /^\d+$/.test(value)) {
      return '+94' + value;
    }
    return value;
  };

  const isValidEmail = (value: string) => {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+94|0)?7\d{8}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = formatIdentifier(val.trim());
    setEmail(val);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) newErrors.email = 'Email address or Phone number is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please correct the errors before submitting');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);

      // Save credentials if Remember Me is active
      if (rememberMe) {
        localStorage.setItem('rememberedCredentials', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('rememberedCredentials');
      }

      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen md:overflow-hidden overflow-y-auto flex items-stretch bg-[#F5F7F9] p-6 gap-6 select-none">
      {/* Reusable Auth Left Panel component */}
      <AuthLeftPanel />

      {/* Right panel: Login form */}
      <div className="flex-1 flex flex-col justify-between items-center py-4 md:py-6 px-4 md:px-0">
        <div className="w-full max-w-[480px] my-auto space-y-8">

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
              Admin Workspace Panel
            </h1>
            <p className="text-[14px] text-[#9B9B9B] leading-relaxed">
              Login to manage tasks, collaborators, and workspace operations efficiently.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <div
                className={`relative flex items-center border-[1.5px] rounded-[16px] bg-white transition-all duration-250 focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(255,80,45,0.1)] ${errors.email ? 'border-[#e74c3c]' : 'border-[#cbd5e1]'
                  }`}
              >
                <div className="px-4 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="w-[1.5px] h-[28px] bg-[#cbd5e1] align-self-center" />
                <input
                  type="text"
                  name="email"
                  placeholder="Email address"
                  value={email}
                  onChange={handleEmailChange}
                  className="flex-1 py-4 px-4 bg-transparent text-[15px] text-[#334155] outline-none font-sans w-full"
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
                <span className="color-[#e74c3c] text-[13px] mt-0.5 pl-2 font-sans font-medium text-[#e74c3c]">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <div
                className={`relative flex items-center border-[1.5px] rounded-[16px] bg-white transition-all duration-250 focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(255,80,45,0.1)] ${errors.password ? 'border-[#e74c3c]' : 'border-[#cbd5e1]'
                  }`}
              >
                <div className="px-4 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="3" ry="3" />
                    <circle cx="7" cy="12" r="1.5" fill="#94a3b8" />
                    <circle cx="12" cy="12" r="1.5" fill="#94a3b8" />
                    <circle cx="17" cy="12" r="1.5" fill="#94a3b8" />
                  </svg>
                </div>
                <div className="w-[1.5px] h-[28px] bg-[#cbd5e1] align-self-center" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="flex-1 py-4 px-4 bg-transparent text-[15px] text-[#334155] outline-none font-sans w-full"
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
                <span className="color-[#e74c3c] text-[13px] mt-0.5 pl-2 font-sans font-medium text-[#e74c3c]">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center gap-2">
              <label className="flex items-center cursor-pointer text-[14px] text-[#475569] font-sans">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="appearance-none w-5 h-5 border-[1.5px] border-[#ffaa95] rounded-[6px] bg-white cursor-pointer mr-2.5 transition-all duration-200 checked:bg-brand checked:border-brand flex items-center justify-center after:content-[''] after:w-[9px] after:h-[6px] after:border-l-2 after:border-b-2 after:border-white after:-rotate-45 after:-translate-y-1 after:hidden checked:after:block"
                />
                Remember me
              </label>

              <button
                type="button"
                className="bg-none border-none text-brand text-[14px] cursor-pointer font-sans font-medium hover:text-[#e04324] hover:underline"
              >
                Forgot Password ?
              </button>
            </div>

            {/* Action buttons */}
            <div className="space-y-4 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand text-white border-none rounded-[16px] py-3.5 px-6 text-[16px] font-semibold cursor-pointer font-sans transition-all duration-250 shadow-[0_8px_20px_-6px_rgba(255,80,45,0.4)] hover:bg-[#e04324] hover:translate-y-[-2px] hover:shadow-[0_12px_24px_-6px_rgba(255,80,45,0.5)] active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Signing In...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

          {/* Or sign up separator */}
          <div className="flex items-center justify-center gap-3 w-full">
            <div className="flex-1 h-[1.5px] bg-[#e2e8f0]" />
            <span className="text-[#94a3b8] text-[14px] font-sans">or sign up</span>
            <div className="flex-1 h-[1.5px] bg-[#e2e8f0]" />
          </div>

          {/* SignUp Area */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[#475569] text-[15px] font-sans">
              Don&apos;t have an account ?
            </span>
            <Link
              href="/register"
              className="text-brand text-[16px] font-bold underline hover:text-[#e04324] font-sans"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Footer info links */}
        <div className="text-center mt-6">
          <p className="text-[13px] text-[#94a3b8] font-sans leading-relaxed">
            By logging in, you agree to the ApexFlow{' '}
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
