'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaymentModal from '@/components/PaymentModal';
import AIAssistant from '@/components/AIAssistant';
import Link from 'next/link';
import { mockDB, Product } from '@/lib/supabase';
import { ChevronRight, FileText, Verified, Sparkles, Star, Download, ShieldCheck, Heart, User } from 'lucide-react';

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}


export default function ProductDetailPage() {
  const { slug } = useParams();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [mainImage, setMainImage] = useState('');
  
  // Checkout Sim
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Review Form state
  const [reviews, setReviews] = useState<Review[]>([
    { name: 'Karan Mehta', rating: 5, comment: 'Exceptional details on the gold foil layers. Extremely easy to edit in Photoshop!', date: 'May 12, 2026' },
    { name: 'Pooja Rawat', rating: 4, comment: 'Beautiful font choice. Worked perfectly for my clients wedding invitation stationery.', date: 'May 04, 2026' }
  ]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Thumbnails gallery (pre-populated with mock variations based on slug)
  const [gallery, setGallery] = useState<string[]>([]);

  useEffect(() => {
    const list = mockDB.getProducts();
    const found = list.find((p) => p.slug === slug);
    if (found) {
      setProduct(found);
      setMainImage(found.preview_url);
      setGallery([
        found.preview_url,
        // Mock sub-previews
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB7ZBHcVtkvbuaXhLPOsNbx7OP2GZcmmfgmu3drXiK4JXaX76K1gRUlUfaqt8Wd6raSLLqtJrYt4UjMTx5RCtely_LFJRl7UvqnNah8BcElnMXcr-t3FKi_zTOxuJ4ZhNG0IPM-4fpaIlAq9o-nEgZGxo02xNordgUqg4irPvHuUhHsmhVNdtFvRP3HrYym_5QB3-qSYMs3Nz-Y62mvuP0AHnvIcRlsWK8fMQYb9_9xAatPwl_d4XKvLQVhI2WvjE2WRjTpNfhIdxI',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAqzn8ZLfLuIpw5YRjNJfz72sjDa-ME0FmX3k628oMDNoRJU8P3TQOZwvLaN2tdSs6hm9O_wRUbBfkp2VQO7KPWHFaRJUJ-SvSWU_ybwfxbDcLr0pHt4h0sdF58wQMzBl5uwK2ed0M6r5ZdnmQeXrhlfkTNFb24OQrPnJBNVlOoS7HUIbNr6Fa8O_SzsIJr5i-Aa0SeoyZJ3Cga0zA18Mg3zpvqg7xDc7WB4ZDWob94tcu2HrUk3OdSolU23xsYUgpXmFNvaNi3sZg',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDf3XjcGYQXsA0clfR-HcxuZjYRy-Boa9zYn8MoXLcj3uQ1Y1R8g3SaJN0jBMpE4A1vKsGnDzjJ61X2JdzY8wKyYFmeYkL1vPFfiGZfnuqtHw0CBPFPFZCqygEF3IKzwlNG7nY7a0NxPvw45DELdQgyyT8myuIHI3UXjkFzPRtS4GvrJNgIMCSqJ-C0fgv4iJRt4AqvAATw7oKfc-FTgY-ldoj_AyliAH_9Ck7AkpJbDzEBfjse_HdNaF8IerCxanBN7Smb7q4tN_I'
      ]);
      
      // Related products in same category
      const sameCat = list.filter((p) => p.category_id === found.category_id && p.id !== found.id);
      setRelated(sameCat.length > 0 ? sameCat : list.filter(p => p.id !== found.id).slice(0, 3));
    }
  }, [slug]);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#08090F] text-white">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">Loading product details...</p>
            <Link href="/marketplace" className="text-xs text-[#00D8FF] hover:underline">
              Back to Marketplace
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gfxtab_cart');
      const cart: Product[] = stored ? JSON.parse(stored) : [];
      if (cart.some((p) => p.id === product.id)) {
        alert('Product is already in your cart!');
        return;
      }
      cart.push(product);
      localStorage.setItem('gfxtab_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      alert('Product added to your cart successfully!');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newRev: Review = {
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setReviews((prev) => [newRev, ...prev]);
    setReviewName('');
    setReviewComment('');
  };

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto bg-[#08090F] text-gray-300">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-8">
          <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
          <ChevronRight size={12} />
          <Link href={`/marketplace?cat=${product.category_id}`} className="hover:text-white transition-colors">Templates</Link>
          <ChevronRight size={12} />
          <span className="text-[#7C5CFF] font-medium truncate">{product.title}</span>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Gallery & Info */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="glass-fill glass-stroke rounded-2xl overflow-hidden aspect-[4/3] relative bg-[#11131B]">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>

              {/* Thumbnails list */}
              <div className="grid grid-cols-4 gap-4">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`glass-fill glass-stroke rounded-xl overflow-hidden aspect-square border transition-all cursor-pointer ${
                      mainImage === img ? 'border-[#7C5CFF]' : 'border-white/5 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* About this Asset */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">About this Asset</h2>
              <p className="text-sm text-gray-400 leading-relaxed">{product.description}</p>
            </div>

            {/* Technical Specifications & License */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Specs Box */}
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <FileText size={16} className="text-[#00D8FF]" /> Technical Specifications
                </h3>
                <ul className="text-xs text-gray-400 space-y-3">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>File Formats:</span>
                    <strong className="text-white font-medium">{product.formats.join(', ')}</strong>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Resolution:</span>
                    <strong className="text-white font-medium">{product.resolution || '300 DPI'}</strong>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Color Space:</span>
                    <strong className="text-white font-medium">{product.color_space || 'RGB'}</strong>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Dimensions:</span>
                    <strong className="text-white font-medium">{product.dimensions || 'Custom Size'}</strong>
                  </li>
                </ul>
              </div>

              {/* License Box */}
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#00D8FF]" /> Licensing & Support
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {product.licensing_info || 'This purchase includes a standard Commercial License, perfect for client branding, freelance gigs, and individual creative assets.'}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[9px] font-bold text-[#7C5CFF] bg-[#7C5CFF]/10 px-2.5 py-1 rounded-full border border-[#7C5CFF]/20">Client Projects</span>
                  <span className="text-[9px] font-bold text-[#7C5CFF] bg-[#7C5CFF]/10 px-2.5 py-1 rounded-full border border-[#7C5CFF]/20">Unlimited Uses</span>
                  <span className="text-[9px] font-bold text-[#7C5CFF] bg-[#7C5CFF]/10 px-2.5 py-1 rounded-full border border-[#7C5CFF]/20">Print Ready</span>
                </div>
              </div>
            </div>

            {/* Product Reviews */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Product Reviews</h2>
              
              {/* Review Input */}
              <form onSubmit={handleAddReview} className="glass-card p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Leave a Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Your Name"
                    className="bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                  />
                  <div className="flex items-center gap-2 bg-[#08090F] border border-white/5 rounded-xl px-4 py-3">
                    <span className="text-xs text-gray-500">Rating:</span>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
                    >
                      <option value={5} className="bg-[#11131B]">5 Stars (Excellent)</option>
                      <option value={4} className="bg-[#11131B]">4 Stars (Good)</option>
                      <option value={3} className="bg-[#11131B]">3 Stars (Average)</option>
                      <option value={2} className="bg-[#11131B]">2 Stars (Poor)</option>
                      <option value={1} className="bg-[#11131B]">1 Star (Terrible)</option>
                    </select>
                  </div>
                </div>
                <textarea
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Your review comment..."
                  rows={3}
                  className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                ></textarea>
                <button
                  type="submit"
                  className="action-primary px-6 py-2.5 rounded-xl text-xs font-bold hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Submit Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="bg-[#11131B] border border-white/5 rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <strong className="text-white">{rev.name}</strong>
                      <span className="text-gray-500">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[#00D8FF]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Buying Actions & Creator Bio */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Action Card */}
            <div className="glass-fill glass-stroke rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
              <div>
                <h1 className="text-xl font-bold text-white leading-snug">{product.title}</h1>
                <p className="text-xs text-gray-500 mt-1">Author: {product.seller_name}</p>
              </div>

              {/* Price Details */}
              <div className="flex items-baseline gap-2 border-b border-white/5 pb-4">
                <span className="text-3xl font-extrabold text-[#7C5CFF]">₹{product.price}</span>
                <span className="text-xs text-gray-500 font-semibold uppercase">Inclusive of GST</span>
              </div>

              {/* Instant Buy Controls */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 action-primary text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-xs flex justify-center items-center gap-1.5 shadow-lg shadow-[#7C5CFF]/20 cursor-pointer"
                >
                  <Sparkles size={14} className="animate-pulse" /> Buy It Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-xs flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>

              {/* Technical features list */}
              <div className="space-y-3.5 pt-4 text-xs text-gray-400">
                <div className="flex items-center gap-2.5">
                  <Download size={14} className="text-[#00D8FF]" />
                  <span>Instant ZIP file download after purchase</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Verified size={14} className="text-[#00D8FF]" />
                  <span>GST-ready tax invoice instantly generated</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={14} className="text-[#00D8FF]" />
                  <span>Elite designer technical support</span>
                </div>
              </div>
            </div>

            {/* Creator Bio Card */}
            <div className="glass-fill glass-stroke rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#11131B] border border-white/10">
                <div className="w-full h-full flex items-center justify-center text-[#7C5CFF] font-bold">
                  {product.seller_name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{product.seller_name}</h4>
                <p className="text-[10px] text-gray-500 font-medium">Verified GFXTAB Author</p>
                <div className="flex items-center gap-1 text-[10px] text-[#00D8FF] mt-1 font-bold">
                  <Star size={10} fill="currentColor" /> 4.9 Elite Rating
                </div>
              </div>
              <button
                onClick={() => alert('You are now following this designer. Updates will be visible in your feed!')}
                className="ml-auto px-3.5 py-1.5 border border-white/10 rounded-lg text-[10px] font-semibold hover:bg-white/5 transition-colors cursor-pointer"
              >
                Follow
              </button>
            </div>

          </aside>

        </div>

        {/* Related Products Grid */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-white/5 pt-16 space-y-8">
            <h2 className="text-lg font-bold text-white">Related Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.slice(0, 3).map((item) => (
                <Link
                  href={`/marketplace/${item.slug}`}
                  key={item.id}
                  className="glass-card rounded-2xl p-4 flex flex-col justify-between hover-glow"
                >
                  <div className="space-y-4">
                    <div className="aspect-video rounded-xl overflow-hidden bg-[#08090F]">
                      <img src={item.preview_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xs font-bold text-white leading-snug line-clamp-1">{item.title}</h3>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-4 text-[10px] text-gray-500">
                    <span>₹{item.price}</span>
                    <span className="font-semibold text-white/50">{item.formats.join(', ')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Payment Processing Gateway Modal */}
      {isCheckoutOpen && (
        <PaymentModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          productIds={[product.id]}
          totalAmount={product.price}
          onSuccess={() => {}}
        />
      )}

      <AIAssistant />
      <Footer />
    </>
  );
}
