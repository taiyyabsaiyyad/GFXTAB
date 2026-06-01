'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import { mockDB, Message, CustomRequest } from '@/lib/supabase';
import { Send, Paperclip, CheckCheck, Bot, ShieldCheck, ArrowLeft, Download } from 'lucide-react';

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  // Inputs
  const [inputContent, setInputContent] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const user = mockDB.getCurrentUser();
    setCurrentUser(user);

    // Load customer requests
    const listReqs = mockDB.getCustomRequests().filter(
      (r) => r.client_id === user.id || user.role === 'admin'
    );
    setRequests(listReqs);

    if (listReqs.length > 0) {
      setSelectedRequestId(listReqs[0].id);
    }
  }, []);

  if (!isMounted || !currentUser) {
    return (
      <div className="min-h-screen bg-[#08090F] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C5CFF]"></div>
      </div>
    );
  }

  const loadMessages = React.useCallback(() => {
    const all = mockDB.getMessages();
    const filtered = all.filter((m) => m.custom_request_id === selectedRequestId);
    setMessages(filtered);
  }, [selectedRequestId]);

  useEffect(() => {
    if (selectedRequestId) {
      loadMessages();
    }
  }, [selectedRequestId, loadMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() && !attachedFileName) return;

    const receiverId = currentUser.role === 'admin' ? 'customer-1' : 'admin';
    mockDB.sendMessage(
      receiverId,
      inputContent || `Sent an attachment: ${attachedFileName}`,
      selectedRequestId || undefined,
      attachedFileName ? '#download-attachment-link' : undefined
    );

    // Refresh messages
    loadMessages();
    
    // Reset inputs
    const tempInput = inputContent;
    setInputContent('');
    setAttachedFileName('');

    // Trigger mock auto-reply from designer/admin after 2 seconds
    if (currentUser.role !== 'admin') {
      setTimeout(() => {
        let replyText = "Received! Let me relay this to the design studio. We will update you here shortly.";
        if (tempInput.toLowerCase().includes('deadline') || tempInput.toLowerCase().includes('urgent')) {
          replyText = "Understood. I will flag this request as High Priority with our design leads.";
        } else if (tempInput.toLowerCase().includes('change') || tempInput.toLowerCase().includes('color') || tempInput.toLowerCase().includes('font')) {
          replyText = "Got the details. We are editing the concept file with these typography and color updates.";
        }
        
        mockDB.sendMessage('customer-1', replyText, selectedRequestId || undefined);
        loadMessages();
      }, 2000);
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  const getActiveRequestTitle = () => {
    const found = requests.find((r) => r.id === selectedRequestId);
    return found ? `${found.project_type} Request` : 'General Workspace';
  };

  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#08090F] flex flex-col md:flex-row text-gray-300">
        
        {/* Left Side: Active Request Channels list */}
        <aside className="w-full md:w-80 bg-[#11131B] border-r border-white/5 p-6 flex flex-col gap-4 shrink-0">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Active Workspaces</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Project Channels</p>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
            {requests.length > 0 ? (
              requests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedRequestId === req.id
                      ? 'border-[#7C5CFF] bg-[#7C5CFF]/10 text-white'
                      : 'border-white/5 bg-[#08090F] text-gray-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  <h4 className="text-xs font-bold truncate">{req.project_type}</h4>
                  <p className="text-[10px] text-gray-500 mt-1 truncate">ID: {req.id}</p>
                  <span className="inline-block text-[9px] uppercase tracking-wider font-bold text-[#00D8FF] mt-2">
                    {req.status}
                  </span>
                </button>
              ))
            ) : (
              <div className="text-center py-12 text-xs text-gray-500 border border-dashed border-white/5 rounded-xl">
                No active project chats.
              </div>
            )}
          </div>
        </aside>

        {/* Right Side: Chat Container */}
        <section className="flex-1 flex flex-col h-[calc(100vh-112px)] bg-[#08090F]">
          
          {/* Channel Header */}
          <header className="px-6 py-4 bg-[#11131B] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#7C5CFF]/20 flex items-center justify-center text-[#7C5CFF]">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{getActiveRequestTitle()}</h3>
                <p className="text-[10px] text-gray-500 font-medium">Direct secure designer chat</p>
              </div>
            </div>
          </header>

          {/* Messages Logs Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isMe = msg.sender_id === currentUser.id;
                return (
                  <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <div className="w-6 h-6 rounded-full bg-[#11131B] border border-white/5 flex items-center justify-center shrink-0">
                        <Bot size={12} className="text-[#7C5CFF]" />
                      </div>
                    )}
                    <div className="max-w-[70%] space-y-1">
                      <div
                        className={`text-xs p-4 rounded-2xl leading-relaxed ${
                          isMe
                            ? 'bg-[#7C5CFF] text-white rounded-tr-none shadow-md shadow-[#7C5CFF]/15'
                            : 'bg-[#11131B] text-gray-300 rounded-tl-none border border-white/5'
                        }`}
                      >
                        <p>{msg.content}</p>

                        {/* File Attachment Mockup */}
                        {msg.file_url && (
                          <div className="mt-3 p-2 bg-black/40 border border-white/5 rounded-lg flex items-center justify-between gap-4 text-[10px]">
                            <span className="truncate max-w-[150px] font-mono text-white/70">Attached File</span>
                            <button
                              onClick={() => alert('Downloading attachments...')}
                              className="text-[#00D8FF] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              <Download size={10} /> Download
                            </button>
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-1 text-[9px] text-gray-500 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && <CheckCheck size={12} className="text-[#00D8FF]" />}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-xs text-gray-500 space-y-2">
                <p>Welcome to GFXTAB project workspace.</p>
                <p className="max-w-xs text-[11px] leading-relaxed">
                  Type a message below to clarify details, request re-edits, or attach reference images directly with GFXTAB team.
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attached File Indicator */}
          {attachedFileName && (
            <div className="px-6 py-2 bg-[#11131B] border-t border-white/5 flex justify-between items-center text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Paperclip size={12} className="text-[#00D8FF]" /> Ready to upload: <strong className="text-white">{attachedFileName}</strong>
              </span>
              <button
                onClick={() => setAttachedFileName('')}
                className="text-red-400 hover:text-red-500 text-[10px] font-bold"
              >
                Remove
              </button>
            </div>
          )}

          {/* Message Input Panel */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#11131B] border-t border-white/5 flex gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder="Type your message details or updates here..."
                className="w-full bg-[#08090F] border border-white/5 rounded-xl pl-4 pr-12 py-3.5 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
              />
              <label className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer p-1">
                <input
                  type="file"
                  onChange={handleFileAttach}
                  className="hidden"
                />
                <Paperclip size={16} />
              </label>
            </div>
            <button
              type="submit"
              className="action-primary px-6 py-3.5 rounded-xl text-xs font-bold hover:scale-102 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#7C5CFF]/20"
            >
              <Send size={14} /> Send
            </button>
          </form>

        </section>

      </main>
      <AIAssistant />
    </>
  );
}
