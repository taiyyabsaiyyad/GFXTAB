'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Eye, EyeOff, Mail, Key, Shield, Sparkles } from 'lucide-react';
import { mockDB } from '@/lib/supabase';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [role, setRole] = useState<'customer' | 'seller' | 'admin'>('customer');
  
  // Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLogin) {
      if (loginMode === 'password') {
        if (!email || !password) {
          setErrorMsg('Please enter both email and password.');
          return;
        }

        // Simulate admin login bypass
        if (email.startsWith('admin')) {
          mockDB.setCurrentUser({
            id: 'admin-1',
            full_name: 'System Administrator',
            role: 'admin',
            bio: 'Lead Overseer'
          });
        } else if (email.startsWith('seller')) {
          mockDB.setCurrentUser({
            id: 'seller-1',
            full_name: 'Studio Minimalist',
            role: 'seller',
            bio: 'Elite Design Agency',
            rating: 4.9,
            projects_completed: 45,
            earnings: 12500,
            withdrawable_balance: 4500
          });
        } else {
          mockDB.setCurrentUser({
            id: 'customer-1',
            full_name: email.split('@')[0],
            role: 'customer',
            bio: 'GFXTAB Creative Client'
          });
        }
        window.location.href = email.startsWith('admin') ? '/dashboard/admin' : email.startsWith('seller') ? '/dashboard/seller' : '/dashboard/customer';
      } else {
        // OTP Login
        if (!otpSent) {
          if (!email) {
            setErrorMsg('Please enter your email to request an OTP.');
            return;
          }
          setOtpSent(true);
        } else {
          if (!otpCode) {
            setErrorMsg('Please enter the verification code.');
            return;
          }
          // Successful OTP check
          mockDB.setCurrentUser({
            id: 'customer-otp',
            full_name: email.split('@')[0],
            role: 'customer',
            bio: 'OTP Logged In Client'
          });
          window.location.href = '/dashboard/customer';
        }
      }
    } else {
      // Register Flow
      if (!fullName || !email || !password) {
        setErrorMsg('Please fill in all registration fields.');
        return;
      }
      mockDB.setCurrentUser({
        id: role + '-' + Math.floor(Math.random() * 1000),
        full_name: fullName,
        role: role,
        bio: role === 'seller' ? 'Aspiring Marketplace Author' : 'Active Asset Buyer',
        rating: 5.0,
        projects_completed: 0,
        earnings: 0,
        withdrawable_balance: 0
      });
      window.location.href = role === 'seller' ? '/dashboard/seller' : '/dashboard/customer';
    }
  };

  const handleGoogleLogin = () => {
    mockDB.setCurrentUser({
      id: 'google-user',
      full_name: 'Google Creative',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTKo0WhvevHNuO8NjYbWhB5aP4TwnRsRpM1z26RmbXqeVsDxBAyMLckT7dBRwktXnVxBeGa8owNxHPT6MY8oeEbHycLZ23HbXprVVEg9CRkFAeOOf45pVjQvKp9Nm5q8ai9W9CPwqDQ5niyyHcv8jHNXYLNYbCHBvMv7kWVC-LMZodEvq0VfaojZn8PSCgU9oLekAsqVqH3bu4e45wLTO0-AuI8vjqErYiaYhdwexEnjJVaf7FT8HSIJBHHnz_R8Z250U-qbahw_s',
      role: 'customer',
      bio: 'Google Connected Account'
    });
    window.location.href = '/dashboard/customer';
  };

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-6 min-h-screen flex justify-center items-center relative overflow-hidden bg-[#08090F]">
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#7C5CFF]/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#00D8FF]/5 blur-[100px] rounded-full"></div>
        </div>

        <div className="relative z-10 w-full max-w-md bg-[#11131B] border border-white/5 rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-gray-400">
              {isLogin ? 'Access your creative workspaces and purchases' : 'Join India\'s premium asset hub'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 bg-[#08090F] p-1 rounded-xl border border-white/5">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                isLogin ? 'bg-[#11131B] text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                !isLogin ? 'bg-[#11131B] text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
              <Shield size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Registration Only) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full bg-[#08090F] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                />
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
              {isLogin && (
                <div className="text-right">
                  <p className="text-[10px] text-gray-500">
                    Bypasses: <code className="text-[#00D8FF] bg-black/40 px-1 py-0.5 rounded">admin@x</code>, <code className="text-[#7C5CFF] bg-black/40 px-1 py-0.5 rounded">seller@x</code>
                  </p>
                </div>
              )}
            </div>

            {/* Password Field (Only for non-OTP login or Registration) */}
            {(!isLogin || loginMode === 'password') && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      className="text-[10px] text-gray-500 hover:text-white cursor-pointer"
                      onClick={() => alert('Check your email for password recovery details.')}
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#08090F] border border-white/5 rounded-xl pl-10 pr-10 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                  />
                  <Key size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Field (OTP Login Only) */}
            {isLogin && loginMode === 'otp' && otpSent && (
              <div className="space-y-1 animate-fadeIn">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">OTP Code</label>
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white tracking-widest text-center focus:outline-none focus:border-[#7C5CFF]"
                />
              </div>
            )}

            {/* Role Selection (Registration Only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">I want to:</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all text-xs font-semibold ${
                      role === 'customer'
                        ? 'border-[#7C5CFF] bg-[#7C5CFF]/10 text-white'
                        : 'border-white/5 bg-[#08090F] text-gray-500 hover:text-white'
                    }`}
                  >
                    Buy Assets
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`py-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all text-xs font-semibold ${
                      role === 'seller'
                        ? 'border-[#00D8FF] bg-[#00D8FF]/10 text-white'
                        : 'border-white/5 bg-[#08090F] text-gray-500 hover:text-white'
                    }`}
                  >
                    Sell Assets
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 action-primary text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-xs flex justify-center items-center gap-2 shadow-lg shadow-[#7C5CFF]/20 cursor-pointer"
            >
              {isLogin
                ? loginMode === 'password'
                  ? 'Sign In with Password'
                  : otpSent
                  ? 'Verify & Sign In'
                  : 'Request OTP Code'
                : 'Create GFXTAB Account'}
            </button>
          </form>

          {/* Toggle Login Mode (Password vs OTP) */}
          {isLogin && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setLoginMode(loginMode === 'password' ? 'otp' : 'password');
                  setOtpSent(false);
                  setErrorMsg('');
                }}
                className="text-[11px] text-[#00D8FF] hover:underline cursor-pointer"
              >
                {loginMode === 'password' ? 'Sign In via OTP Code' : 'Sign In with Password'}
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px bg-white/5 flex-grow"></div>
            <span className="text-[10px] uppercase tracking-wider text-gray-500">Or continue with</span>
            <div className="h-px bg-white/5 flex-grow"></div>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 bg-[#08090F] border border-white/5 hover:bg-[#1a1d28] hover:border-white/10 text-white font-bold rounded-xl transition-all text-xs flex justify-center items-center gap-2.5 cursor-pointer"
          >
            <Sparkles size={14} className="text-[#00D8FF]" />
            Continue with Google
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
