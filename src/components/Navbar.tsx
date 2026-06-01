'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mockDB } from '@/lib/supabase';
import { ShoppingCart, User, Menu, X, MessageSquare, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>({
    id: 'user-default',
    full_name: 'Alex Rivera',
    avatar_url: '',
    role: 'customer',
    bio: 'Digital Creator',
    rating: 5.0,
    projects_completed: 4,
    earnings: 0,
    withdrawable_balance: 0
  });
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Update user state and cart counter
    const handleStorageChange = () => {
      setCurrentUser(mockDB.getCurrentUser());
      if (typeof window !== 'undefined') {
        const cart = localStorage.getItem('gfxtab_cart');
        setCartCount(cart ? JSON.parse(cart).length : 0);
      }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    // Interval check as storage events don't trigger in same tab
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const logout = () => {
    // Change user to guest/customer default or clear auth
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gfxtab_current_user');
      window.dispatchEvent(new Event('storage'));
      window.location.href = '/';
    }
  };

  const navLinks = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Custom Requests', href: '/custom-request' },
    { label: 'Design News', href: '/#news' },
    { label: 'Featured Videos', href: '/#videos' }
  ];

  const getDashboardHref = () => {
    if (currentUser.role === 'admin') return '/dashboard/admin';
    if (currentUser.role === 'seller') return '/dashboard/seller';
    return '/dashboard/customer';
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#08090F]/80 backdrop-blur-xl border-b border-white/5 shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center px-6 md:px-12 py-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-sans font-extrabold text-2xl tracking-tighter text-white">
            GFX<span className="text-[#7C5CFF] group-hover:text-[#00D8FF] transition-colors">TAB</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
            PRO
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive ? 'text-white border-b border-[#7C5CFF] pb-1' : 'text-gray-400'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-6">
          {/* Cart Icon */}
          <Link href="/marketplace?cart=true" className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#7C5CFF] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Messages */}
          <Link href="/messages" className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <MessageSquare size={20} />
          </Link>

          {/* User Account */}
          {currentUser ? (
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
               <Link href={getDashboardHref()} className="flex items-center gap-2 group">
                {isMounted && currentUser.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-8 h-8 rounded-full object-cover border border-white/10 group-hover:border-[#7C5CFF] transition-all"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#11131B] border border-white/10 flex items-center justify-center text-xs text-white">
                    {isMounted ? currentUser.full_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-white group-hover:text-[#7C5CFF] transition-colors">{isMounted ? currentUser.full_name : ''}</div>
                  <div className="text-[10px] text-gray-500 capitalize">{isMounted ? `${currentUser.role} Account` : ''}</div>
                </div>
              </Link>
              <button
                onClick={logout}
                className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="action-primary px-5 py-2 rounded-xl text-xs font-bold hover:scale-[1.02] transition-all"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/marketplace?cart=true" className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#7C5CFF] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#08090F] px-6 py-6 flex flex-col gap-6 w-full absolute left-0 top-16 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-white/5 w-full my-2"></div>
          {currentUser ? (
            <div className="flex flex-col gap-4">
              <Link
                href={getDashboardHref()}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                {isMounted && currentUser.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#11131B] border border-white/10 flex items-center justify-center text-sm text-white">
                    {isMounted ? currentUser.full_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-white">{isMounted ? currentUser.full_name : ''}</div>
                  <div className="text-xs text-gray-500 capitalize">{isMounted ? `${currentUser.role} Dashboard` : ''}</div>
                </div>
              </Link>
              <div className="flex gap-4">
                <Link
                  href="/messages"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  My Messages
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs text-gray-500 hover:text-white text-left cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              onClick={() => setIsMobileMenuOpen(false)}
              className="action-primary px-6 py-3 rounded-xl text-center text-sm font-bold"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
