'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import Link from 'next/link';
import { mockDB, CustomRequest, Product } from '@/lib/supabase';
import { Download, Ticket, Sparkles, HelpCircle, FileText, CheckCircle } from 'lucide-react';

export default function CustomerDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'downloads' | 'requests' | 'support'>('dashboard');
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  
  // Support Tickets
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  useEffect(() => {
    setIsMounted(true);
    const user = mockDB.getCurrentUser();
    setCurrentUser(user);

    // Redirect if not customer/admin
    if (user && user.role === 'seller') {
      window.location.href = '/dashboard/seller';
    }

    // Retrieve bought items by checking mock orders
    const orders = mockDB.getOrders();
    const allProducts = mockDB.getProducts();
    const boughtIds = orders
      .filter((o) => o.customer_id === user.id)
      .flatMap((o) => o.products);
    
    setPurchasedProducts(allProducts.filter((p) => boughtIds.includes(p.id)));
    setRequests(mockDB.getCustomRequests().filter((r) => r.client_id === user.id));

    // Load tickets from local storage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gfxtab_tickets');
      setTickets(stored ? JSON.parse(stored) : [
        { id: 'tick-1', subject: 'PSD Template Font Missing', status: 'resolved', created_at: '2026-05-28' }
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

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;
    const newTicket = {
      id: 'tick-' + (tickets.length + 1),
      subject: ticketSubject,
      description: ticketDesc,
      status: 'open',
      created_at: new Date().toISOString().split('T')[0]
    };
    const updated = [newTicket, ...tickets];
    setTickets(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gfxtab_tickets', JSON.stringify(updated));
    }
    setTicketSubject('');
    setTicketDesc('');
    alert('Support ticket created successfully! Our team will get back to you shortly.');
  };

  const getStatusStepIndex = (status: CustomRequest['status']) => {
    const steps: CustomRequest['status'][] = ['pending', 'briefing', 'concepts', 'refining', 'final_review', 'delivery', 'completed'];
    return steps.indexOf(status);
  };

  return (
    <>
      <Navbar />
      <div className="pt-28 min-h-screen bg-[#08090F] text-gray-300 flex">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-[#11131B] border-r border-white/5 p-6 flex flex-col gap-2 shrink-0 hidden md:flex">
          <div className="mb-8 px-2 py-4">
            <h2 className="text-lg font-bold text-white tracking-tighter">GFXTAB Panel</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Customer Console</p>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
              { id: 'downloads', label: 'My Downloads', icon: 'download' },
              { id: 'requests', label: 'Custom Requests', icon: 'assignment' },
              { id: 'support', label: 'Support Desk', icon: 'support' }
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
          
          <div className="pt-6 border-t border-white/5 mt-auto">
            <Link
              href="/marketplace"
              className="action-primary w-full py-3 rounded-xl text-xs font-bold flex justify-center items-center gap-1.5 shadow-lg shadow-[#7C5CFF]/10 hover:scale-[1.02] transition-transform"
            >
              Shop Templates
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-[1200px] mx-auto space-y-10">
          
          {/* Header */}
          <header className="flex justify-between items-end border-b border-white/5 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">Welcome back, {currentUser.full_name}!</h1>
              <p className="text-xs text-gray-500 mt-1">Manage your downloaded design files and custom request timelines.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 text-[#7C5CFF] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Pro Buyer
              </span>
            </div>
          </header>

          {/* TAB 1: Dashboard Home */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Quick Stats Bento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total Downloads</span>
                  <h3 className="text-3xl font-extrabold text-[#00D8FF]">{purchasedProducts.length}</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Active Projects</span>
                  <h3 className="text-3xl font-extrabold text-[#00D8FF]">{requests.filter(r => r.status !== 'completed').length}</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32 bg-[#7C5CFF]/5">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Saved Credits</span>
                  <div className="flex items-baseline gap-1.5">
                    <h3 className="text-3xl font-extrabold text-[#7C5CFF]">350</h3>
                    <span className="text-[9px] font-bold text-white/50">G-PTS</span>
                  </div>
                </div>
              </div>

              {/* Active Projects Tracker */}
              {requests.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white">Active Project Timeline</h3>
                  {requests.map((req) => {
                    const stepIdx = getStatusStepIndex(req.status);
                    const steps = ['Briefing', 'Concepts', 'Refining', 'Review', 'Delivery'];
                    return (
                      <div key={req.id} className="glass-card p-6 rounded-2xl space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-bold text-white">{req.project_type} Request</h4>
                            <p className="text-[10px] text-gray-500">ID: {req.id} | Budget: ₹{req.budget}</p>
                          </div>
                          <span className="bg-[#00D8FF]/10 text-[#00D8FF] border border-[#00D8FF]/20 px-3 py-1 rounded-full text-[10px] font-bold capitalize">
                            {req.status}
                          </span>
                        </div>

                        {/* Horizontal Tracker Timeline */}
                        <div className="relative pt-6 pb-2">
                          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2"></div>
                          <div
                            className="absolute top-1/2 left-0 h-0.5 bg-[#7C5CFF] -translate-y-1/2 transition-all duration-1000"
                            style={{ width: `${(stepIdx / 6) * 100}%` }}
                          ></div>
                          
                          <div className="relative flex justify-between">
                            {steps.map((st, sIdx) => {
                              const isCompleted = stepIdx >= sIdx;
                              const isCurrent = stepIdx === sIdx;
                              return (
                                <div key={sIdx} className="flex flex-col items-center gap-2">
                                  <div
                                    className={`w-3.5 h-3.5 rounded-full z-10 transition-all ${
                                      isCurrent
                                        ? 'bg-[#7C5CFF] ring-4 ring-[#7C5CFF]/30 shadow-[0_0_15px_#7C5CFF]'
                                        : isCompleted
                                        ? 'bg-[#7C5CFF]'
                                        : 'bg-white/10'
                                    }`}
                                  ></div>
                                  <span className={`text-[10px] ${isCurrent ? 'text-white font-bold' : 'text-gray-500'}`}>
                                    {st}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {req.admin_notes && (
                          <div className="p-3 bg-[#08090F]/80 border border-white/5 rounded-xl text-xs text-gray-400 leading-relaxed">
                            <strong>Designer Note:</strong> {req.admin_notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Downloads Grid */}
          {activeTab === 'downloads' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-base font-bold text-white">My Purchased Assets</h3>
              {purchasedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchasedProducts.map((prod) => (
                    <div key={prod.id} className="glass-card p-4 rounded-xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <img src={prod.preview_url} alt="" className="w-full aspect-video object-cover rounded-lg" />
                        <h4 className="text-xs font-bold text-white line-clamp-1">{prod.title}</h4>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                        <a
                          href={prod.file_url}
                          onClick={() => alert('Downloading asset source ZIP package...')}
                          className="action-primary w-full py-2.5 rounded-lg text-[10px] font-bold flex justify-center items-center gap-1 cursor-pointer"
                        >
                          <Download size={12} /> Download Again
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[#11131B] border border-white/5 rounded-2xl space-y-4">
                  <p className="text-xs text-gray-500">You haven't bought any premium assets yet.</p>
                  <Link href="/marketplace" className="text-xs text-[#00D8FF] hover:underline">
                    Browse Marketplace
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Custom Requests Lists */}
          {activeTab === 'requests' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white">Custom Briefs</h3>
                <Link
                  href="/custom-request"
                  className="action-primary px-4 py-2 rounded-xl text-xs font-bold hover:scale-102"
                >
                  Start New Request
                </Link>
              </div>

              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req.id} className="glass-card p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-start border-b border-white/5 pb-4">
                        <div>
                          <h4 className="text-sm font-bold text-white">{req.project_type} Project</h4>
                          <p className="text-[10px] text-gray-500">Submitted: {new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#00D8FF] capitalize bg-[#00D8FF]/10 px-3 py-1 rounded-full border border-[#00D8FF]/20">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{req.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>
                          <span>Budget:</span> <strong className="text-white">₹{req.budget}</strong>
                        </div>
                        <div>
                          <span>Deadline:</span> <strong className="text-white">{req.deadline}</strong>
                        </div>
                      </div>
                      <div className="flex gap-4 pt-2 text-xs">
                        <Link href="/messages" className="text-[#7C5CFF] hover:underline flex items-center gap-1">
                          Message Designer
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[#11131B] border border-white/5 rounded-2xl">
                  <p className="text-xs text-gray-500">No active custom briefs found.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Support Desk */}
          {activeTab === 'support' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
              {/* Left Column: Create Ticket */}
              <div className="lg:col-span-5">
                <form onSubmit={handleCreateTicket} className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Create Support Ticket</h3>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Subject</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Asset Download Failing"
                      className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Description</label>
                    <textarea
                      required
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      placeholder="Explain the problem you are experiencing in detail..."
                      rows={4}
                      className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="action-primary w-full py-3 rounded-xl text-xs font-bold hover:scale-[1.02] shadow-lg shadow-[#7C5CFF]/20 cursor-pointer"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>

              {/* Right Column: Past Tickets */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Your Support Tickets</h3>
                {tickets.length > 0 ? (
                  <div className="space-y-3">
                    {tickets.map((t) => (
                      <div key={t.id} className="bg-[#11131B] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-bold text-white">{t.subject}</h4>
                          <p className="text-[10px] text-gray-500">ID: {t.id} | Created: {t.created_at}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          t.status === 'resolved'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-[#11131B] border border-white/5 rounded-xl">
                    <p className="text-xs text-gray-500">No support tickets found.</p>
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
