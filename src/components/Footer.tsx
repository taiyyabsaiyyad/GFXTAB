'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full border-t border-white/5 bg-[#0b0c13] pt-16 pb-12 px-6 md:px-12 text-gray-400">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
        {/* Brand Column */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <Link href="/" className="font-sans font-extrabold text-2xl tracking-tighter text-white">
            GFX<span className="text-[#7C5CFF]">TAB</span>
          </Link>
          <p className="text-xs max-w-xs leading-relaxed">
            India's creative marketplace for templates, assets, and custom design requests. Launch projects faster with elite design assets.
          </p>
          <p className="text-[11px] text-gray-500">
            Domain: gfxtab.com | Tagline: Create. Sell. Inspire.
          </p>
        </div>

        {/* Categories Link Grid */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Assets</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/marketplace?cat=wedding" className="hover:text-white transition-colors">Wedding Cards</Link></li>
            <li><Link href="/marketplace?cat=social-media" className="hover:text-white transition-colors">Social Media Kits</Link></li>
            <li><Link href="/marketplace?cat=mockups" className="hover:text-white transition-colors">PSD Mockups</Link></li>
            <li><Link href="/marketplace?cat=video-assets" className="hover:text-white transition-colors">Video Templates</Link></li>
            <li><Link href="/marketplace?cat=logos" className="hover:text-white transition-colors">Vector Logos</Link></li>
          </ul>
        </div>

        {/* Custom Services Grid */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Services</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/custom-request?type=logo" className="hover:text-white transition-colors">Custom Logo Design</Link></li>
            <li><Link href="/custom-request?type=wedding" className="hover:text-white transition-colors">Wedding Invitations</Link></li>
            <li><Link href="/custom-request?type=video" className="hover:text-white transition-colors">Video Editing</Link></li>
            <li><Link href="/custom-request?type=motion" className="hover:text-white transition-colors">Motion Graphics</Link></li>
            <li><Link href="/custom-request?type=brand" className="hover:text-white transition-colors">Brand Identity</Link></li>
          </ul>
        </div>

        {/* Resources / Support */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Support</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/#help" className="hover:text-white transition-colors">Help Center</Link></li>
            <li><Link href="/#tickets" className="hover:text-white transition-colors">Support Tickets</Link></li>
            <li><Link href="/#faq" className="hover:text-white transition-colors">FAQs</Link></li>
            <li><Link href="/#terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup Column */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Join GFXTAB Newsletter</h4>
          <p className="text-xs leading-relaxed">
            Get notified of premium design asset drops and design trends.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="bg-[#11131B] border border-white/5 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7C5CFF] text-white flex-grow min-w-0"
            />
            <button
              type="submit"
              className="action-primary px-3 py-2 rounded-lg text-xs font-bold shrink-0 hover:scale-[1.02] transition-transform"
            >
              Join
            </button>
          </form>
          {subscribed && (
            <p className="text-[11px] text-[#00D8FF] animate-pulse">
              Awesome! Welcome to the GFXTAB circle.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© 2026 GFXTAB.COM. All rights reserved. Created in India for the global creative market.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Behance</a>
          <a href="#" className="hover:text-white transition-colors">Dribbble</a>
        </div>
      </div>
    </footer>
  );
}
