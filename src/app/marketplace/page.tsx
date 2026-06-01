'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaymentModal from '@/components/PaymentModal';
import AIAssistant from '@/components/AIAssistant';
import Link from 'next/link';
import { Search, Filter, ShoppingBag, Eye, Heart, Star, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { mockDB, Product, Category } from '@/lib/supabase';

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('cat') || '';
  const showCartOnLoad = searchParams.get('cart') === 'true';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  // Cart & Checkout
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(showCartOnLoad);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProductIds, setCheckoutProductIds] = useState<string[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);

  const loadCart = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gfxtab_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    }
  }, []);

  useEffect(() => {
    setProducts(mockDB.getProducts());
    setCategories(mockDB.getCategories());
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (showCartOnLoad) {
      setIsCartOpen(true);
    }
  }, [showCartOnLoad, searchParams]);

  const saveCart = (newCart: Product[]) => {
    setCart(newCart);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gfxtab_cart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const addToCart = (product: Product) => {
    if (cart.some((p) => p.id === product.id)) {
      alert('Product is already in your cart!');
      return;
    }
    const updated = [...cart, product];
    saveCart(updated);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    const updated = cart.filter((p) => p.id !== id);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Checkout Actions
  const handleQuickBuy = (product: Product) => {
    setCheckoutProductIds([product.id]);
    setCheckoutTotal(product.price);
    setIsCheckoutOpen(true);
  };

  const handleCartCheckout = () => {
    if (cart.length === 0) return;
    const ids = cart.map((p) => p.id);
    const total = cart.reduce((acc, curr) => acc + curr.price, 0);
    setCheckoutProductIds(ids);
    setCheckoutTotal(total);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    // If checking out cart items, clear cart upon success
    if (checkoutProductIds.length > 1 || cart.some(item => checkoutProductIds.includes(item.id))) {
      clearCart();
    }
  };

  // Search & Filters
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || 
                            prod.category_id === selectedCategory || 
                            categories.find(c => c.slug === selectedCategory)?.id === prod.category_id;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-6 md:px-12 min-h-screen bg-[#08090F] relative">
        <div className="max-w-[1440px] mx-auto space-y-10">
          
          {/* Header Description */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">GFXTAB Assets</h1>
            <p className="text-sm text-gray-400 max-w-xl">
              Discover premium templates, photorealistic mockups, high-converting social media creatives, and cinematic video presets crafted in India.
            </p>
          </div>

          {/* Search and Filters Toolbar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <input
                type="text"
                placeholder="Search templates, mockups, LUTs, logos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#11131B] border border-white/5 rounded-xl pl-12 pr-4 py-4 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>

            {/* Category Filter Dropdown */}
            <div className="md:col-span-4 flex items-center gap-2 bg-[#11131B] border border-white/5 rounded-xl px-4 py-3">
              <Filter size={16} className="text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
              >
                <option value="" className="bg-[#11131B]">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#11131B]">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Grid View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Product Cards Grid */}
            <div className={`lg:col-span-12 space-y-6 ${isCartOpen ? 'lg:col-span-8' : ''}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => (
                    <div key={prod.id} className="glass-card rounded-2xl p-4 flex flex-col justify-between hover-glow">
                      <div className="space-y-4">
                        {/* Preview Img */}
                        <div className="aspect-video rounded-xl overflow-hidden bg-[#08090F] relative">
                          <img
                            src={prod.preview_url}
                            alt={prod.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-3 right-3 bg-black/75 px-3 py-1 rounded-full text-xs font-bold text-[#00D8FF]">
                            ₹{prod.price}
                          </div>
                        </div>

                        {/* Title and Specs */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">{prod.title}</h3>
                          <p className="text-[11px] text-gray-500 line-clamp-2">{prod.description}</p>
                        </div>
                      </div>

                      {/* Buy CTAs */}
                      <div className="mt-6 space-y-3">
                        <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-white/5 pt-3">
                          <span>By {prod.seller_name}</span>
                          <span className="font-semibold text-white/50">{prod.formats.join(', ')}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={() => handleQuickBuy(prod)}
                            className="action-primary py-2.5 rounded-lg text-[10px] font-bold hover:scale-[1.02] transition-transform cursor-pointer"
                          >
                            Buy Now
                          </button>
                          <button
                            onClick={() => addToCart(prod)}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 py-2.5 rounded-lg text-[10px] font-bold text-white transition-colors cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        </div>
                        <div className="text-center">
                          <Link href={`/marketplace/${prod.slug}`} className="text-[10px] text-gray-500 hover:text-white hover:underline flex items-center justify-center gap-1">
                            <Eye size={12} /> View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <p className="text-sm text-gray-500">No assets found matching your criteria.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                      }}
                      className="text-xs text-[#00D8FF] hover:underline"
                    >
                      Clear Search & Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Drawer Panel (Right Sidebar) */}
            {isCartOpen && (
              <div className="lg:col-span-4 bg-[#11131B] border border-white/5 rounded-2xl p-6 h-fit space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShoppingCart size={16} className="text-[#7C5CFF]" />
                    Shopping Cart ({cart.length})
                  </h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs text-gray-500 hover:text-white cursor-pointer"
                  >
                    Hide
                  </button>
                </div>

                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {/* Cart Items List */}
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-3 bg-[#08090F]/60 border border-white/5 p-3 rounded-xl">
                          <img
                            src={item.preview_url}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-lg border border-white/10"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] text-white font-semibold truncate">{item.title}</h4>
                            <p className="text-[10px] text-[#00D8FF] font-bold">₹{item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors self-center cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Pricing Tally */}
                    <div className="border-t border-white/5 pt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>Items Subtotal:</span>
                        <span>₹{cart.reduce((a, c) => a + c.price, 0)}.00</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>GST (Included):</span>
                        <span>18%</span>
                      </div>
                      <div className="flex justify-between text-white font-bold border-t border-white/5 pt-2 text-sm">
                        <span>Order Total:</span>
                        <span className="text-[#00D8FF]">₹{cart.reduce((a, c) => a + c.price, 0)}.00</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCartCheckout}
                      className="w-full py-3.5 action-primary text-white font-bold rounded-xl text-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-[#7C5CFF]/20 cursor-pointer"
                    >
                      Checkout via Razorpay <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-2">
                    <p className="text-xs text-gray-500">Your shopping cart is empty.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-[10px] text-[#00D8FF] hover:underline"
                    >
                      Keep Browsing
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Payment Processing Gateway Modal */}
      {isCheckoutOpen && (
        <PaymentModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          productIds={checkoutProductIds}
          totalAmount={checkoutTotal}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      <AIAssistant />
      <Footer />
    </>
  );
}
