'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import { mockDB, CustomRequest, NewsArticle } from '@/lib/supabase';
import { Check, X, ShieldAlert, Plus, Edit, FileText, Settings, User } from 'lucide-react';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'requests' | 'news' | 'withdrawals' | 'tickets'>('analytics');
  
  // Custom Requests State
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [selectedRequestStatus, setSelectedRequestStatus] = useState<CustomRequest['status']>('briefing');
  const [adminNotes, setAdminNotes] = useState('');

  // News CMS State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCat, setNewsCat] = useState('Design Trends');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);

  // Withdrawals State
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  // Tickets State
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const user = mockDB.getCurrentUser();
    setCurrentUser(user);

    // Redirect if not admin
    if (user && user.role !== 'admin') {
      window.location.href = '/dashboard/customer';
    }

    setRequests(mockDB.getCustomRequests());
    setNewsList(mockDB.getNews());

    // Withdrawals
    if (typeof window !== 'undefined') {
      const storedW = localStorage.getItem('gfxtab_withdrawals');
      setWithdrawals(storedW ? JSON.parse(storedW) : [
        { id: 'w-1', amount: 3000, status: 'approved', upi_id: 'studio@okaxis', created_at: '2026-05-15' }
      ]);

      const storedT = localStorage.getItem('gfxtab_tickets');
      setTickets(storedT ? JSON.parse(storedT) : [
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

  // Request Status Updates
  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId) return;
    const updated = mockDB.updateCustomRequestStatus(selectedRequestId, selectedRequestStatus, adminNotes);
    if (updated) {
      alert('Custom request status updated successfully!');
      setRequests(mockDB.getCustomRequests());
      setSelectedRequestId('');
      setAdminNotes('');
    }
  };

  // CMS Article Addition
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) return;

    mockDB.addNews({
      title: newsTitle,
      slug: newsTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: newsContent,
      image_url: newsImage || 'https://images.unsplash.com/photo-1541462608141-2f58c6e68e67?auto=format&fit=crop&w=400&q=80',
      category: newsCat
    });

    setNewsList(mockDB.getNews());
    setNewsTitle('');
    setNewsContent('');
    setNewsImage('');
    alert('News article successfully published to GFXTAB homepage!');
  };

  // Payout Verification
  const handleApproveWithdrawal = (id: string) => {
    const updated = withdrawals.map((w) => (w.id === id ? { ...w, status: 'approved' } : w));
    setWithdrawals(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gfxtab_withdrawals', JSON.stringify(updated));
    }
    alert('Withdrawal request approved and processed.');
  };

  // Ticket Resolver
  const handleResolveTicket = (id: string) => {
    const updated = tickets.map((t) => (t.id === id ? { ...t, status: 'resolved' } : t));
    setTickets(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gfxtab_tickets', JSON.stringify(updated));
    }
    alert('Ticket status updated to resolved.');
  };

  return (
    <>
      <Navbar />
      <div className="pt-28 min-h-screen bg-[#08090F] text-gray-300 flex">
        
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#11131B] border-r border-white/5 p-6 flex flex-col gap-2 shrink-0 hidden md:flex">
          <div className="mb-8 px-2 py-4">
            <h2 className="text-lg font-bold text-white tracking-tighter">GFXTAB Panel</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Control Center</p>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { id: 'analytics', label: 'Platform Metrics', icon: 'bar_chart' },
              { id: 'requests', label: 'Client Briefs', icon: 'assignment' },
              { id: 'news', label: 'Homepage CMS', icon: 'newspaper' },
              { id: 'withdrawals', label: 'Seller Payouts', icon: 'payments' },
              { id: 'tickets', label: 'Support Queue', icon: 'support' }
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

        {/* Main Workspace */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-[1200px] mx-auto space-y-10">
          
          {/* Header */}
          <header className="flex justify-between items-end border-b border-white/5 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">System Operations</h1>
              <p className="text-xs text-gray-500 mt-1">Verify payouts, update timeline trackers, and edit homepage content.</p>
            </div>
            <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Root Admin
            </span>
          </header>

          {/* TAB 1: Analytics overview */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Analytics Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Estimated Revenue (INR)</span>
                  <h3 className="text-3xl font-extrabold text-[#00D8FF]">₹45,890.00</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total Orders</span>
                  <h3 className="text-3xl font-extrabold text-[#7C5CFF]">124</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Unique Visitors</span>
                  <h3 className="text-3xl font-extrabold text-white">5.8k</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Store Downloads</span>
                  <h3 className="text-3xl font-extrabold text-white">412</h3>
                </div>
              </div>

              {/* Table of Top Products */}
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Performing Assets</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-500">
                        <th className="pb-3">Product Name</th>
                        <th className="pb-3 text-right">Downloads</th>
                        <th className="pb-3 text-right">Revenue (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-400">
                      <tr>
                        <td className="py-3 text-white font-semibold">Eternal Bloom: Luxury Wedding Set</td>
                        <td className="py-3 text-right font-medium">85</td>
                        <td className="py-3 text-right text-[#00D8FF] font-bold">₹12,665.00</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-white font-semibold">Urban Vibes Social Media Post Pack</td>
                        <td className="py-3 text-right font-medium">62</td>
                        <td className="py-3 text-right text-[#00D8FF] font-bold">₹6,138.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Design Request Management */}
          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
              
              {/* Left Column: Requests List */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Custom Briefs Queue</h3>
                {requests.length > 0 ? (
                  <div className="space-y-4">
                    {requests.map((req) => (
                      <div key={req.id} className="bg-[#11131B] border border-white/5 p-5 rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-bold text-white">{req.project_type} Project</h4>
                            <p className="text-[10px] text-gray-500">ID: {req.id} | Client: {req.client_name}</p>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-wider border border-[#00D8FF]/20 bg-[#00D8FF]/10 text-[#00D8FF] px-2.5 py-0.5 rounded-full">
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2">{req.description}</p>
                        <div className="flex gap-3 text-xs pt-1">
                          <button
                            onClick={() => {
                              setSelectedRequestId(req.id);
                              setSelectedRequestStatus(req.status);
                            }}
                            className="text-[#7C5CFF] hover:underline cursor-pointer"
                          >
                            Update Progress
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-[#11131B] border border-white/5 rounded-2xl">
                    <p className="text-xs text-gray-500">No requests submitted yet.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Update Form */}
              <div className="lg:col-span-5">
                {selectedRequestId ? (
                  <form onSubmit={handleUpdateStatus} className="glass-card p-6 rounded-2xl space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Update Timeline Tracker</h3>
                    <p className="text-[10px] text-gray-500">Target Request ID: {selectedRequestId}</p>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Timeline Phase</label>
                      <select
                        value={selectedRequestStatus}
                        onChange={(e) => setSelectedRequestStatus(e.target.value as any)}
                        className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                      >
                        <option value="briefing">Briefing</option>
                        <option value="concepts">Concepts</option>
                        <option value="refining">Refining</option>
                        <option value="final_review">Final Review</option>
                        <option value="delivery">Delivery</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Designer / Admin Note</label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Write direct progress updates for the client timeline bar..."
                        rows={4}
                        className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="action-primary w-full py-3.5 rounded-xl text-xs font-bold hover:scale-[1.02] shadow-lg shadow-[#7C5CFF]/20 cursor-pointer"
                    >
                      Apply Status Update
                    </button>
                  </form>
                ) : (
                  <div className="glass-card p-6 rounded-2xl text-center py-12 text-xs text-gray-500 border-dashed border-2 border-white/5">
                    Click "Update Progress" on any request to edit its timeline track.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: Homepage CMS (Blog/News Publish) */}
          {activeTab === 'news' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
              {/* Publisher form */}
              <div className="lg:col-span-5">
                <form onSubmit={handleAddNews} className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Publish News Article</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Article Title</label>
                    <input
                      type="text"
                      required
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      placeholder="e.g. Canva Templates Updates in 2026"
                      className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Category</label>
                    <select
                      value={newsCat}
                      onChange={(e) => setNewsCat(e.target.value)}
                      className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                    >
                      <option>Design Trends</option>
                      <option>AI Design Tools</option>
                      <option>Creative Industry Updates</option>
                      <option>Adobe & Canva news</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Article Banner URL</label>
                    <input
                      type="url"
                      value={newsImage}
                      onChange={(e) => setNewsImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Content</label>
                    <textarea
                      required
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      rows={5}
                      placeholder="Write blog post description here..."
                      className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="action-primary w-full py-3.5 rounded-xl text-xs font-bold hover:scale-[1.02] shadow-lg shadow-[#7C5CFF]/20 cursor-pointer"
                  >
                    Publish to Homepage
                  </button>
                </form>
              </div>

              {/* Published articles list */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Articles</h3>
                <div className="space-y-3">
                  {newsList.map((art) => (
                    <div key={art.id} className="bg-[#11131B] border border-white/5 p-4 rounded-xl flex gap-3 text-xs">
                      <img src={art.image_url} alt="" className="w-12 h-12 object-cover rounded-lg border border-white/10" />
                      <div className="flex-grow min-w-0">
                        <span className="text-[8px] uppercase font-bold text-[#00D8FF] tracking-wider block mb-0.5">{art.category}</span>
                        <h4 className="font-bold text-white truncate">{art.title}</h4>
                        <p className="text-[10px] text-gray-500 truncate">{art.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Withdrawal Verification */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Seller Withdrawal Requests</h3>
              {withdrawals.length > 0 ? (
                <div className="space-y-3">
                  {withdrawals.map((w) => (
                    <div key={w.id} className="bg-[#11131B] border border-white/5 p-5 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-1">
                        <h4 className="font-bold text-white">Amount: ₹{w.amount}</h4>
                        <p className="text-[10px] text-gray-500">UPI: {w.upi_id} | Created: {w.created_at}</p>
                      </div>
                      <div>
                        {w.status === 'pending' ? (
                          <button
                            onClick={() => handleApproveWithdrawal(w.id)}
                            className="bg-[#7C5CFF] hover:bg-[#7C5CFF]/85 text-white font-bold px-4 py-2 rounded-lg text-[10px] cursor-pointer"
                          >
                            Approve & Pay
                          </button>
                        ) : (
                          <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold">
                            Processed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[#11131B] border border-white/5 rounded-2xl">
                  <p className="text-xs text-gray-500">No withdrawal payouts requested.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Support Tickets Queue */}
          {activeTab === 'tickets' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Support tickets Queue</h3>
              {tickets.length > 0 ? (
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div key={t.id} className="bg-[#11131B] border border-white/5 p-5 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-white">{t.subject}</h4>
                        <p className="text-[10px] text-gray-500">ID: {t.id} | Status: <span className="capitalize">{t.status}</span></p>
                      </div>
                      <div>
                        {t.status === 'open' ? (
                          <button
                            onClick={() => handleResolveTicket(t.id)}
                            className="bg-[#00D8FF] hover:bg-[#00D8FF]/85 text-black font-bold px-4 py-2 rounded-lg text-[10px] cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold">
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[#11131B] border border-white/5 rounded-2xl">
                  <p className="text-xs text-gray-500">No tickets in the queue.</p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
      <AIAssistant />
      <Footer />
    </>
  );
}
