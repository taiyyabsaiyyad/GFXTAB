'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  recommendations?: Array<{
    title: string;
    price: string;
    url: string;
    type: 'product' | 'designer' | 'service';
  }>;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Namaste! I am your GFXTAB Creative Partner. Tell me what you're working on (e.g. 'I need a luxury wedding invite video' or 'show me Instagram mockups') and I'll find the perfect assets for you."
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input.toLowerCase();
    const newUserMsg: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput('');

    setTimeout(() => {
      let replyText = "I see what you mean! Here are some creative options on GFXTAB matching your request:";
      let recs: Message['recommendations'] = [];

      if (userQuery.includes('wedding') || userQuery.includes('marriage') || userQuery.includes('invite')) {
        replyText = "I found premium wedding assets and custom design services for you:";
        recs = [
          { title: 'Eternal Bloom: Luxury Wedding Invitation Suite (₹149)', price: '₹149', url: '/marketplace/eternal-bloom-wedding-suite', type: 'product' },
          { title: 'Bespoke Wedding Invitation Service (Starts ₹499)', price: '₹499', url: '/custom-request?type=wedding', type: 'service' },
          { title: 'Studio Minimalist (Elite Author)', price: '4.9 Rating', url: '/marketplace?seller=Studio+Minimalist', type: 'designer' }
        ];
      } else if (userQuery.includes('social') || userQuery.includes('instagram') || userQuery.includes('post') || userQuery.includes('ad')) {
        replyText = "For high-converting social campaigns, check out these templates and creators:";
        recs = [
          { title: 'Urban Vibes Social Media Post Pack (₹99)', price: '₹99', url: '/marketplace/urban-vibes-social-pack', type: 'product' },
          { title: 'Custom Social Media Package (Starts ₹1,499)', price: '₹1499', url: '/custom-request?type=social_media', type: 'service' },
          { title: 'Urban Creative (Top Seller)', price: '5.0 Rating', url: '/marketplace?seller=Urban+Creative', type: 'designer' }
        ];
      } else if (userQuery.includes('video') || userQuery.includes('motion') || userQuery.includes('transition') || userQuery.includes('leak')) {
        replyText = "Enhance your footage with these overlays and motion services:";
        recs = [
          { title: 'Cinematic Light Leaks & Transitions Pack (₹299)', price: '₹299', url: '/marketplace/cinematic-light-leaks-pack', type: 'product' },
          { title: 'Professional Custom Video Editing (Starts ₹999)', price: '₹999', url: '/custom-request?type=video', type: 'service' },
          { title: 'Bespoke Motion Graphics Service (Starts ₹2,999)', price: '₹2999', url: '/custom-request?type=motion', type: 'service' }
        ];
      } else if (userQuery.includes('mockup') || userQuery.includes('card') || userQuery.includes('branding')) {
        replyText = "Present your work in style with these photorealistic mockups:";
        recs = [
          { title: 'Minimalist Business Card Mockup Vol 1 (₹79)', price: '₹79', url: '/marketplace/minimalist-business-card-mockup-v1', type: 'product' },
          { title: 'Complete Brand Identity Package (Starts ₹1,499)', price: '₹1499', url: '/custom-request?type=brand', type: 'service' }
        ];
      } else {
        replyText = "I couldn't pinpoint specific assets, but GFXTAB supports standard creative assets. Would you like to check out general categories or request a custom design project?";
        recs = [
          { title: 'Browse Complete Marketplace', price: 'Free Search', url: '/marketplace', type: 'product' },
          { title: 'Submit Custom Design Brief', price: '₹499+', url: '/custom-request', type: 'service' }
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: replyText,
          recommendations: recs
        }
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating Sparkle Trigger Button */}
      <div className="fixed bottom-6 right-6 z-[99]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="action-primary w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group relative cursor-pointer"
        >
          <Sparkles size={24} className="text-white animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D8FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D8FF]"></span>
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[550px] bg-[#11131B] border border-white/5 rounded-2xl shadow-2xl flex flex-col z-[999] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#08090F] px-6 py-4 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#7C5CFF]/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-[#7C5CFF]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Design Assistant</h3>
                  <p className="text-[10px] text-gray-500 font-medium">GFXTAB Smart Companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chats Pane */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-[#11131B] border border-white/5 flex items-center justify-center shrink-0">
                      <Bot size={12} className="text-[#00D8FF]" />
                    </div>
                  )}
                  <div className="max-w-[80%] space-y-2">
                    <div
                      className={`text-xs p-3 rounded-2xl leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#7C5CFF] text-white rounded-tr-none'
                          : 'bg-[#1a1d28] text-gray-300 rounded-tl-none border border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Recommendations Block */}
                    {msg.recommendations && (
                      <div className="space-y-2 pt-1">
                        {msg.recommendations.map((rec, rIdx) => (
                          <Link
                            key={rIdx}
                            href={rec.url}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#08090F]/60 border border-white/5 hover:border-[#7C5CFF]/30 hover:bg-[#1a1d28] transition-all group"
                          >
                            <div className="flex-1 min-w-0 pr-2">
                              <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block mb-0.5">
                                {rec.type}
                              </span>
                              <p className="text-[11px] text-white font-semibold truncate group-hover:text-[#7C5CFF] transition-colors">
                                {rec.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-[#00D8FF]">{rec.price}</span>
                              <ArrowRight size={10} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 bg-[#08090F] border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What template or service do you need?"
                className="bg-[#11131B] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 flex-1 focus:outline-none focus:border-[#7C5CFF]"
              />
              <button
                type="submit"
                className="action-primary w-9 h-9 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
