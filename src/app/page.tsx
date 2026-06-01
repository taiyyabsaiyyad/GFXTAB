'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDB, Product, NewsArticle } from '@/lib/supabase';
import { Heart, Bookmark, Share2, Play, ArrowRight, Eye, Star, Sparkles, Plus, Award } from 'lucide-react';

interface TrendingItem {
  id: string;
  title: string;
  image: string;
  category: string;
  designer: string;
  likes: number;
  liked?: boolean;
  saved?: boolean;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [trendingDesigns, setTrendingDesigns] = useState<TrendingItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Pre-populated trending design feed items
  const initialTrending: TrendingItem[] = [
    {
      id: 'trend-1',
      title: 'Neon Brutalism UI Dashboard',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ9pcwaFLfYUDz3sxWp8wl4TTYNC9JJEi8uNB8gYtn-QgQ6Z7-nhTK5Ba2n05SmRhFi8jzApdk-F51dCOjVsiEsI82XGAYb93nzpX9gj1nzr6svfn8-pMFiNB2usOiaupzmRLxPkbhTBJD9yzAXq5zqW9UZLhC2RVssTph-2r2VkvyQqFkmizOCTfvy9xuKscvWlLYlWHGo8-RmeeSgVGxd5W_OhAaueB88Nuv9dlEiISyMYLsgV9PZJTAGHyvnXsDc2hVgz5AWLc',
      category: 'UI/UX Design',
      designer: 'Alex Rivera',
      likes: 142
    },
    {
      id: 'trend-2',
      title: 'Cinematic Light leak overlays',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0h42dfKw8KDD8Ic3tn6-xqvYBPZJ8lyFbiNj1fdvufPkNguJWrrgGFEMaq5_c5sP9wZWvQvPSyd2zk5wbdFh1O5Rn0N3AM9iesrg-dWTUjwE8w0Y34O4ggtqSJtNWperi03yW1v6JTc-GrEwU121Aemd2JRKDoWIXZUe3byQFVoDrWId0_dPeGVv0xCnGIJHaeImxLNaC6OPvpA4-ONE0NYSNj88wA7mqErStR-JKSp8PF_vO_vNqm3LfAUpEoZFGSlxPLPfc74k',
      category: 'Motion Graphics',
      designer: 'Studio Minimalist',
      likes: 98
    },
    {
      id: 'trend-3',
      title: 'Foil-pressed Stationery mockup',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC24kajk7W804fFt9KFazG9kEmsZnIsn3kzeU4yPFMcVK_uCZHKmA9smMvq0U9Q0ujxRr2Tn1h3_x4kUyYOcQiBxojeA4Gb8_EYk_KpQsEp-IpqB3L-BIh07IXsT2HOgO4LfSLXY42mj7gavTA91pWGoT3OxDiY3JqiYAfZl7AISwcGAogyXTYCT3w4D7b-A2oBvRzQYRWRLgjzb4n0MNaTxdDgeODk12aJS5RtSORrTPtmgI-XtXrdOZSFiAsLxusN4pCwkhbZv0M',
      category: 'Branding Mockup',
      designer: 'Studio Minimalist',
      likes: 215
    },
    {
      id: 'trend-4',
      title: 'Neon Streetwear Social templates',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ-nmvMtiwcCpfdKHglhrkxKqgG6pwafmkPgQfqxBPZC-VTlp14AL77KAT_J1I5YVZmQQHfOh4HZMC9t6nea-boux-FHTrWRFzKxli29bh2MbtuliHCtGHudJwQ9rUdn9KIRGwu3JBaJTKZbatgdXddaynbxVEOhN7FB_M6wZG3Jj2OeRDJxfQr6uYzy6LJHckzkUbWUWRSJd80kE9S3WwQAHumYtwffLSOzUyW_4p4TiFCst_SF5jVaKmTyClH9s_78Qg8m_LHg8',
      category: 'Social Media',
      designer: 'Urban Creative',
      likes: 184
    }
  ];

  // Pre-populated video assets
  const trendingVideos = [
    {
      id: 'vid-1',
      title: 'How to craft a Luxury Wedding Invitation in PSD',
      duration: '14:20',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7ZBHcVtkvbuaXhLPOsNbx7OP2GZcmmfgmu3drXiK4JXaX76K1gRUlUfaqt8Wd6raSLLqtJrYt4UjMTx5RCtely_LFJRl7UvqnNah8BcElnMXcr-t3FKi_zTOxuJ4ZhNG0IPM-4fpaIlAq9o-nEgZGxo02xNordgUqg4irPvHuUhHsmhVNdtFvRP3HrYym_5QB3-qSYMs3Nz-Y62mvuP0AHnvIcRlsWK8fMQYb9_9xAatPwl_d4XKvLQVhI2WvjE2WRjTpNfhIdxI',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      id: 'vid-2',
      title: 'Streetwear Motion Poster Breakdown',
      duration: '08:45',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaACkBtg-r2W-rT_nfLeEeDSL9uqZsM8hOkp6OpwsBXvaXs9DUqc3FvbeJ60m5n9v2x-YxNikAJR-MIVMrKB9glBBdNnFoECvFNiCsRLSjE0TMoD-xJoK_IKo5oyNWCgUMa2r6p2TNMtPh6uAI3VmHVieohjjA9Zp7wOIT3tKNsWmpxI4wvEQHkf1GDYuiMc41HDH-4lMPs25Dx0UBB18uNH9oUE7uNcEyZ63BVoT1kr7kDWIxJh7GLq5iq4Pqe4o4Vaaaa3AZ4a4',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4'
    }
  ];

  // Top Creators
  const topDesigners = [
    {
      name: 'Studio Minimalist',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG50rcatCOBclc2x-YSd0UF3KgEwKYD1bQCNKtpaxtVJ9GKGY-CRA792RjetFkKFhaKSrVmL41gcxjbadP7mRSpFy_duP3L5S-tunLmEkuW_K8m33Al76Z942-iBa39asHE5dPn_-u48KTDaBvq5HQyU_j-ZFq6bb955nTa5DzCxm5K_XP-oLQNvH9b_o0fZsGBL9F4B-vpUPfuiWR35HVHjQKcZj3cfSDkAyBJDxFcYvHCuw93sgeuq9TwpT2X6D0Cxje5BQCqAQ',
      rating: 4.9,
      completed: 45,
      role: 'Wedding & Branding Specialist'
    },
    {
      name: 'Urban Creative',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTKo0WhvevHNuO8NjYbWhB5aP4TwnRsRpM1z26RmbXqeVsDxBAyMLckT7dBRwktXnVxBeGa8owNxHPT6MY8oeEbHycLZ23HbXprVVEg9CRkFAeOOf45pVjQvKp9Nm5q8ai9W9CPwqDQ5niyyHcv8jHNXYLNYbCHBvMv7kWVC-LMZodEvq0VfaojZn8PSCgU9oLekAsqVqH3bu4e45wLTO0-AuI8vjqErYiaYhdwexEnjJVaf7FT8HSIJBHHnz_R8Z250U-qbahw_s',
      rating: 5.0,
      completed: 32,
      role: 'Social Media & Streetwear'
    }
  ];

  useEffect(() => {
    setProducts(mockDB.getProducts().slice(0, 3));
    setNews(mockDB.getNews());
    setTrendingDesigns(initialTrending);
  }, []);

  const handleLike = (id: string) => {
    setTrendingDesigns((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isLiked = !item.liked;
          return {
            ...item,
            liked: isLiked,
            likes: isLiked ? item.likes + 1 : item.likes - 1
          };
        }
        return item;
      })
    );
  };

  const handleSave = (id: string) => {
    setTrendingDesigns((prev) =>
      prev.map((item) => (item.id === id ? { ...item, saved: !item.saved } : item))
    );
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, text: `Check out this trending design on GFXTAB.COM`, url: window.location.href });
    } else {
      alert(`Copied link to clipboard: ${window.location.origin}`);
    }
  };

  return (
    <>
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-44 pb-32 md:pt-60 md:pb-48 bg-[#08090F] overflow-hidden px-6 md:px-12">
        {/* Glow Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none">
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#7C5CFF]/10 blur-[130px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#00D8FF]/10 blur-[110px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-fill glass-stroke text-[#00D8FF] text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles size={12} className="animate-spin" /> New Assets Dropping Daily
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight"
          >
            India's Creative Marketplace for <span className="text-gradient">Designers, Creators & Businesses</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-medium"
          >
            Buy templates, hire experts, discover inspiration and launch projects faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/marketplace"
              className="action-primary w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#7C5CFF]/20"
            >
              Browse Marketplace <ArrowRight size={16} />
            </Link>
            <Link
              href="/custom-request"
              className="glass-fill glass-stroke w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              Hire a Designer
            </Link>
            <Link
              href="/auth"
              className="text-xs font-semibold text-gray-500 hover:text-white transition-colors"
            >
              Sell Assets
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. TRENDING DESIGN FEED (Pinterest/Behance Style) */}
      <section className="py-20 px-6 md:px-12 border-t border-white/5 bg-[#08090F]">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold text-[#7C5CFF] uppercase tracking-widest block mb-2">Inspiration</span>
              <h2 className="text-3xl font-bold text-white">Trending Design Feed</h2>
            </div>
            <Link href="/marketplace" className="text-xs font-bold text-[#00D8FF] hover:underline flex items-center gap-1.5">
              View all work <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDesigns.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden group">
                <div className="aspect-[4/3] overflow-hidden relative bg-[#11131B]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                    {item.category}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                    <p className="text-[11px] text-gray-500">By {item.designer}</p>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-3">
                    <button
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1 text-[11px] cursor-pointer transition-colors ${
                        item.liked ? 'text-red-500' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Heart size={14} fill={item.liked ? 'currentColor' : 'none'} />
                      <span>{item.likes}</span>
                    </button>

                    <div className="flex items-center gap-3 text-gray-400">
                      <button
                        onClick={() => handleSave(item.id)}
                        className={`hover:text-white cursor-pointer ${item.saved ? 'text-[#00D8FF]' : ''}`}
                      >
                        <Bookmark size={14} fill={item.saved ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => handleShare(item.title)}
                        className="hover:text-white cursor-pointer"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Fey Marketplace items) */}
      <section className="py-20 px-6 md:px-12 bg-[#0b0c13] border-t border-white/5">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold text-[#7C5CFF] uppercase tracking-widest block mb-2">Premium Assets</span>
              <h2 className="text-3xl font-bold text-white">Featured Marketplace Products</h2>
            </div>
            <Link href="/marketplace" className="text-xs font-bold text-[#00D8FF] hover:underline flex items-center gap-1.5">
              Explore Store <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((prod) => (
              <Link href={`/marketplace/${prod.slug}`} key={prod.id} className="glass-card rounded-2xl p-4 flex flex-col justify-between hover-glow">
                <div className="space-y-4">
                  <div className="aspect-video rounded-xl overflow-hidden bg-[#08090F] relative">
                    <img src={prod.preview_url} alt={prod.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#00D8FF]">
                      ₹{prod.price}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white leading-snug">{prod.title}</h3>
                    <div className="text-xs text-gray-400 line-clamp-2">{prod.description}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                  <span className="text-[10px] text-gray-500">By {prod.seller_name}</span>
                  <div className="flex gap-1.5">
                    {prod.formats.map((f, i) => (
                      <span key={i} className="text-[9px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DESIGN NEWS FEED */}
      <span id="news" className="block relative -top-24"></span>
      <section className="py-20 px-6 md:px-12 bg-[#08090F] border-t border-white/5">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#7C5CFF] uppercase tracking-widest">Industry Updates</span>
            <h2 className="text-3xl font-bold text-white">Design & Tech News Feed</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {news.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/3 aspect-[4/3] sm:aspect-auto overflow-hidden bg-[#11131B]">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#00D8FF]">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-white hover:text-[#7C5CFF] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-3">{item.content}</p>
                  </div>
                  <p className="text-[10px] text-gray-500">Published in India</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRENDING VIDEOS */}
      <span id="videos" className="block relative -top-24"></span>
      <section className="py-20 px-6 md:px-12 bg-[#0b0c13] border-t border-white/5">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div>
            <span className="text-xs font-bold text-[#7C5CFF] uppercase tracking-widest block mb-2">Tutorials & Reels</span>
            <h2 className="text-3xl font-bold text-white">Trending Videos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trendingVideos.map((vid) => (
              <div key={vid.id} className="glass-card rounded-2xl overflow-hidden group relative">
                <div className="aspect-video relative overflow-hidden bg-black">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Play Overlay */}
                  <button
                    onClick={() => setSelectedVideo(vid.videoUrl)}
                    className="absolute inset-0 flex items-center justify-center group/btn cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#7C5CFF]/90 flex items-center justify-center text-white shadow-lg group-hover/btn:scale-110 active:scale-95 transition-all">
                      <Play size={24} fill="currentColor" className="ml-1" />
                    </div>
                  </button>
                  <span className="absolute bottom-4 right-4 bg-black/75 px-2 py-0.5 rounded text-[10px] font-semibold text-white">
                    {vid.duration}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-white">{vid.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURED CREATORS */}
      <section className="py-20 px-6 md:px-12 bg-[#08090F] border-t border-white/5">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#7C5CFF] uppercase tracking-widest">Our Talent</span>
            <h2 className="text-3xl font-bold text-white">Featured Designers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {topDesigners.map((designer, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 flex items-center gap-6">
                <img
                  src={designer.avatar}
                  alt={designer.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/5"
                />
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      {designer.name}
                      <Award size={14} className="text-[#00D8FF]" />
                    </h3>
                    <p className="text-xs text-gray-500">{designer.role}</p>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Star size={12} fill="#00D8FF" className="text-[#00D8FF]" />
                      <strong className="text-white">{designer.rating}</strong>
                    </span>
                    <span>
                      <strong className="text-white">{designer.completed}</strong> Completed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Playback Lightbox Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={28} />
            </button>
            <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-white/5 bg-[#11131B]">
              <video src={selectedVideo} controls autoPlay className="w-full h-full object-contain" />
            </div>
          </div>
        )}
      </AnimatePresence>

      <AIAssistant />
      <Footer />
    </>
  );
}

// Simple close icon for lightbox modal helper
const X = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
