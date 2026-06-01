'use client';

import React, { useState } from 'react';
import { CreditCard, Smartphone, CheckCircle, FileText, X, ShieldCheck } from 'lucide-react';
import { mockDB } from '@/lib/supabase';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIds: string[];
  totalAmount: number;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, productIds, totalAmount, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<'upi' | 'card'>('upi');
  const [gst, setGst] = useState('');
  const [paymentState, setPaymentState] = useState<'input' | 'processing' | 'success'>('input');
  const [cardNumber, setCardNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [invoice, setInvoice] = useState<any>(null);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentState('processing');

    setTimeout(() => {
      // Create actual order in mock database
      const order = mockDB.createOrder(productIds, gst);
      setInvoice(order);
      setPaymentState('success');
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#08090F]/80 backdrop-blur-md p-4">
      <div className="bg-[#11131B] border border-white/5 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* Close Button */}
        {paymentState !== 'processing' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        )}

        {/* State 1: Payment Selection */}
        {paymentState === 'input' && (
          <form onSubmit={handlePay} className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">GFXTAB Checkout</h3>
              <p className="text-xs text-gray-400">Complete your payment securely via Razorpay / Stripe</p>
            </div>

            {/* Price Overview */}
            <div className="p-4 bg-[#08090F]/80 border border-white/5 rounded-xl flex justify-between items-center">
              <span className="text-xs text-gray-400">Total Amount (Incl. GST)</span>
              <span className="text-lg font-bold text-[#00D8FF]">₹{totalAmount}.00</span>
            </div>

            {/* GST IN */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 flex justify-between">
                <span>GSTIN (Optional)</span>
                <span className="text-[10px] text-gray-500 font-normal">For GST-ready Invoice</span>
              </label>
              <input
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value.toUpperCase())}
                placeholder="e.g. 27AAAAA1111A1Z1"
                maxLength={15}
                className="w-full bg-[#1a1d28] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
              />
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMethod('upi')}
                className={`py-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium cursor-pointer ${
                  method === 'upi'
                    ? 'border-[#7C5CFF] bg-[#7C5CFF]/10 text-white'
                    : 'border-white/5 bg-[#1a1d28] text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone size={16} />
                <span>UPI / QR / GPay</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`py-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium cursor-pointer ${
                  method === 'card'
                    ? 'border-[#7C5CFF] bg-[#7C5CFF]/10 text-white'
                    : 'border-white/5 bg-[#1a1d28] text-gray-400 hover:text-white'
                }`}
              >
                <CreditCard size={16} />
                <span>Credit / Debit Card</span>
              </button>
            </div>

            {/* Input Details */}
            {method === 'upi' ? (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-xs font-semibold text-gray-400">UPI Address</label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okaxis"
                  className="w-full bg-[#1a1d28] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                />
              </div>
            ) : (
              <div className="space-y-3 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400">Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    className="w-full bg-[#1a1d28] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                    className="w-full bg-[#1a1d28] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    required
                    maxLength={3}
                    className="w-full bg-[#1a1d28] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 action-primary text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-xs flex justify-center items-center gap-2 shadow-lg shadow-[#7C5CFF]/20 cursor-pointer"
            >
              Securely Pay ₹{totalAmount}.00
            </button>

            <div className="flex justify-center items-center gap-1.5 text-[10px] text-gray-500">
              <ShieldCheck size={12} className="text-[#00D8FF]" />
              <span>Razorpay & Stripe secure encryption protocols.</span>
            </div>
          </form>
        )}

        {/* State 2: Processing */}
        {paymentState === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-t-[#7C5CFF] border-white/5 rounded-full animate-spin"></div>
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-white">Contacting Payment Gateway...</h4>
              <p className="text-xs text-gray-400">Do not refresh or close this window.</p>
            </div>
          </div>
        )}

        {/* State 3: Success & GST Invoice Display */}
        {paymentState === 'success' && invoice && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <CheckCircle size={48} className="text-[#00D8FF] animate-bounce" />
              <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
              <p className="text-xs text-gray-400">Order ID: {invoice.id}</p>
            </div>

            {/* GST Invoice Details */}
            <div className="p-4 bg-[#08090F]/80 border border-white/5 rounded-xl space-y-3 text-xs">
              <h5 className="font-bold text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-[#7C5CFF]" />
                Tax Invoice (GST-Ready)
              </h5>
              <div className="space-y-1.5 text-gray-400">
                <div className="flex justify-between">
                  <span>Merchant:</span>
                  <span className="text-white font-medium">GFXTAB.COM Private Ltd.</span>
                </div>
                {invoice.gst_number && (
                  <div className="flex justify-between">
                    <span>Customer GSTIN:</span>
                    <span className="text-white font-medium">{invoice.gst_number}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>SGST (9%):</span>
                  <span>₹{((totalAmount * 0.09) / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST (9%):</span>
                  <span>₹{((totalAmount * 0.09) / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2 text-white font-bold">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#00D8FF]">₹{totalAmount}.00</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/dashboard/customer';
                }}
                className="w-full py-3.5 action-primary text-white font-bold rounded-xl hover:scale-[1.02] transition-transform text-xs cursor-pointer"
              >
                Go to Downloads
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#1a1d28] border border-white/5 text-gray-400 hover:text-white transition-colors rounded-xl text-xs cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
