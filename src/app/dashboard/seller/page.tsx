'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import Link from 'next/link';
import { mockDB, Product, Category } from '@/lib/supabase';
import { Plus, Download, Coins, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';

export default function SellerDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'withdraw'>('dashboard');
  const [categories, setCategories] = useState<Category[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  
  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState(99);
  const [newCatId, setNewCatId] = useState('');
  const [newPreviewUrl, setNewPreviewUrl] = useState('');
  const [newFormats, setNewFormats] = useState<string[]>(['PSD']);

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState(1000);
  const [upiId, setUpiId] = useState('');
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const user = mockDB.getCurrentUser();
    setCurrentUser(user);

    // Redirect if not seller/admin
    if (user && user.role === 'customer') {
      window.location.href = '/dashboard/customer';
    }

    setCategories(mockDB.getCategories());
    setMyProducts(mockDB.getProducts().filter(p => p.seller_id === user.id));

    // Pre-populate default category selection
    const cats = mockDB.getCategories();
    if (cats.length > 0) setNewCatId(cats[0].id);

    // Retrieve withdrawals history
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gfxtab_withdrawals');
      setWithdrawals(stored ? JSON.parse(stored) : [
        { id: 'w-1', amount: 3000, status: 'approved', upi_id: 'studio@okaxis', created_at: '2026-05-15' }
      ]);
    }
  }, []);

  if (!isMounted || !currentUser) {
    return (
      <div className="min-h-screen bg-[#08090F] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C5CFF]"></div>
      </div>
    );
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newPrice || !newPreviewUrl) return;

    mockDB.addProduct({
      seller_id: currentUser.id,
      seller_name: currentUser.full_name,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newDesc,
      price: Number(newPrice),
      file_url: '#download-source-zip',
      preview_url: newPreviewUrl,
      formats: newFormats,
      category_id: newCatId,
      is_approved: true,
      tags: ['custom', 'design', 'upload']
    });

    // Refresh products list
    setMyProducts(mockDB.getProducts().filter(p => p.seller_id === currentUser.id));

    // Clear form
    setNewTitle('');
    setNewDesc('');
    setNewPrice(99);
    setNewPreviewUrl('');
    alert('Product uploaded successfully and is now live on the marketplace!');
    setActiveTab('products');
  };

  const handleCreateWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId || withdrawAmount <= 0) return;

    if (withdrawAmount > currentUser.withdrawable_balance) {
      alert('Withdrawal amount exceeds your current withdrawable balance!');
      return;
    }

    const newW = {
      id: 'w-' + (withdrawals.length + 1),
      amount: withdrawAmount,
      upi_id: upiId,
      status: 'pending',
      created_at: new Date().toISOString().split('T')[0]
    };

    // Deduct withdrawable balance in mock user profile
    const newBal = currentUser.withdrawable_balance - withdrawAmount;
    const updatedUser = mockDB.setCurrentUser({ withdrawable_balance: newBal });
    setCurrentUser(updatedUser);

    const updatedWithdrawals = [newW, ...withdrawals];
    setWithdrawals(updatedWithdrawals);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gfxtab_withdrawals', JSON.stringify(updatedWithdrawals));
    }

    setWithdrawAmount(1000);
    alert('Withdrawal request submitted! The amount will be transferred to your UPI ID within 24 hours.');
  };

  const toggleFormat = (f: string) => {
    setNewFormats((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  return (
    <>
      <Navbar />
      <div className="pt-28 min-h-screen bg-[#08090F] text-gray-300 flex">
        
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#11131B] border-r border-white/5 p-6 flex flex-col gap-2 shrink-0 hidden md:flex">
          <div className="mb-8 px-2 py-4">
            <h2 className="text-lg font-bold text-white tracking-tighter">GFXTAB Panel</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Seller Console</p>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { id: 'dashboard', label: 'Overview Metrics', icon: 'trending_up' },
              { id: 'products', label: 'My Storefront', icon: 'storefront' },
              { id: 'withdraw', label: 'Earnings & Payout', icon: 'payments' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#7C5CFF]/15 text-white border-l-2 border-[#7C5CFF]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Console */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-[1200px] mx-auto space-y-10">
          
          {/* Header */}
          <header className="flex justify-between items-end border-b border-white/5 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">Hello, {currentUser.full_name}!</h1>
              <p className="text-xs text-gray-500 mt-1">Manage downloads, list templates, and withdraw store earnings.</p>
            </div>
            <span className="text-[10px] bg-[#00D8FF]/10 border border-[#00D8FF]/20 text-[#00D8FF] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Verified Designer
            </span>
          </header>

          {/* TAB 1: Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Financial Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total Earnings</span>
                  <h3 className="text-3xl font-extrabold text-[#00D8FF]">₹{currentUser.earnings}</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Withdrawable Balance</span>
                  <h3 className="text-3xl font-extrabold text-[#7C5CFF]">₹{currentUser.withdrawable_balance}</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Products Uploaded</span>
                  <h3 className="text-3xl font-extrabold text-white">{myProducts.length}</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Author Rating</span>
                  <h3 className="text-3xl font-extrabold text-white">{currentUser.rating} ★</h3>
                </div>
              </div>

              {/* Upload Product Form */}
              <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Plus size={16} className="text-[#00D8FF]" /> Upload New Marketplace Asset
                </h3>

                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Asset Title</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Modern Glassmorphic Presentation template"
                        className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Pricing (INR)</label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        placeholder="₹99"
                        className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Category</label>
                      <select
                        value={newCatId}
                        onChange={(e) => setNewCatId(e.target.value)}
                        className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Preview Image URL</label>
                      <input
                        type="url"
                        required
                        value={newPreviewUrl}
                        onChange={(e) => setNewPreviewUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Description</label>
                      <textarea
                        required
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        rows={4}
                        placeholder="Describe technical features, layers, formats, resolution, etc..."
                        className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                      ></textarea>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Formats</label>
                    <div className="flex gap-4">
                      {['PSD', 'AI', 'PDF', 'Figma', 'PRPROJ'].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => toggleFormat(f)}
                          className={`px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                            newFormats.includes(f)
                              ? 'border-[#7C5CFF] bg-[#7C5CFF]/10 text-white'
                              : 'border-white/5 bg-[#08090F] text-gray-500 hover:text-white'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="action-primary px-8 py-3.5 rounded-xl text-xs font-bold hover:scale-[1.02] shadow-lg shadow-[#7C5CFF]/20 cursor-pointer"
                    >
                      Publish to Marketplace
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* TAB 2: Products List */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-base font-bold text-white">Your Listed Assets ({myProducts.length})</h3>
              {myProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProducts.map((prod) => (
                    <div key={prod.id} className="glass-card p-4 rounded-xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <img src={prod.preview_url} alt="" className="w-full aspect-video object-cover rounded-lg" />
                        <h4 className="text-xs font-bold text-white line-clamp-1">{prod.title}</h4>
                        <p className="text-[11px] text-[#00D8FF] font-bold">₹{prod.price}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                        <Link
                          href={`/marketplace/${prod.slug}`}
                          className="w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-[10px] font-bold text-center text-white"
                        >
                          View Listing
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[#11131B] border border-white/5 rounded-2xl">
                  <p className="text-xs text-gray-500">You haven't listed any products yet.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Withdrawal / Payout panel */}
          {activeTab === 'withdraw' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
              {/* Request Withdrawal */}
              <div className="lg:col-span-5">
                <form onSubmit={handleCreateWithdrawal} className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Request UPI Withdrawal</h3>
                  <div className="p-4 bg-[#08090F] border border-white/5 rounded-xl flex justify-between items-center text-xs">
                    <span className="text-gray-500">Withdrawable Balance</span>
                    <strong className="text-white text-base">₹{currentUser.withdrawable_balance}</strong>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Withdraw Amount (INR)</label>
                    <input
                      type="number"
                      required
                      min={500}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                      placeholder="₹1000"
                      className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">UPI Address (GPay / PhonePe / Paytm)</label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okaxis"
                      className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="action-primary w-full py-3.5 rounded-xl text-xs font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-[#7C5CFF]/20 cursor-pointer"
                  >
                    Submit Withdrawal Request
                  </button>
                </form>
              </div>

              {/* Withdrawal History */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Withdrawal History</h3>
                {withdrawals.length > 0 ? (
                  <div className="space-y-3">
                    {withdrawals.map((w) => (
                      <div key={w.id} className="bg-[#11131B] border border-white/5 p-4 rounded-xl flex justify-between items-center text-xs">
                        <div className="space-y-1">
                          <h4 className="font-bold text-white">Payout Amount: ₹{w.amount}</h4>
                          <p className="text-[10px] text-gray-500">UPI: {w.upi_id} | Date: {w.created_at}</p>
                        </div>
                        <span className={`px-3 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                          w.status === 'approved'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {w.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-[#11131B] border border-white/5 rounded-xl">
                    <p className="text-xs text-gray-500">No withdrawal records found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
      <AIAssistant />
      <Footer />
    </>
  );
}
