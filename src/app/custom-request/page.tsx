'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import { mockDB } from '@/lib/supabase';
import { MessageSquare, History, UserCheck, CloudUpload, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CustomRequestPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    projectType: 'logo',
    description: '',
    budget: 1499,
    deadline: '',
    referenceLink: '',
    fileName: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectTypeChange = (val: string) => {
    setFormData((prev) => ({ ...prev, projectType: val }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        alert('Please fill out all contact fields before proceeding.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.description || !formData.deadline) {
        alert('Please describe your requirements and pick a target deadline.');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, fileName: e.target.files![0].name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Write request to mock DB
      mockDB.addCustomRequest({
        project_type: formData.projectType,
        budget: formData.budget,
        deadline: formData.deadline,
        description: formData.description,
        reference_links: formData.referenceLink ? [formData.referenceLink] : [],
        file_url: formData.fileName || ''
      });

      // Send welcome message in workspace channel
      mockDB.sendMessage(
        'admin',
        `Hi! Thanks for submitting your custom design request for "${formData.projectType}". Our team is reviewing the brief and will respond within 24 hours.`
      );

      setIsSubmitting(false);
      alert('Your custom design request has been received! Our team will review it and get back to you within 24 hours.');
      window.location.href = '/dashboard/customer';
    }, 1500);
  };

  const stepLabels = ['Project Basics', 'Scope & Budget', 'Resources'];

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-6 md:px-12 min-h-screen bg-[#08090F] flex flex-col items-center">
        {/* Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-[#7C5CFF]/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-[#00D8FF]/5 blur-[100px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-6xl w-full mb-12 text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Custom Design. <br />
            <span className="text-gradient">Tailored Excellence.</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl mt-4 leading-relaxed">
            Elevate your brand with bespoke assets crafted by our elite design network. Fill out the request portal to begin your creative journey.
          </p>
        </div>

        <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR: Selling points */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="glass-fill glass-stroke rounded-2xl p-6 md:p-8 sticky top-28 space-y-8">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Why Choose Custom?</h3>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7C5CFF]/10 flex items-center justify-center shrink-0 border border-[#7C5CFF]/15">
                    <MessageSquare className="text-[#7C5CFF]" size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">Direct Communication</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Speak directly with designers in real-time to align every pixel with your brand guidelines.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7C5CFF]/10 flex items-center justify-center shrink-0 border border-[#7C5CFF]/15">
                    <History className="text-[#7C5CFF]" size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">Unlimited Revisions</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      We refine concepts iteratively. Your satisfaction is our absolute benchmark.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7C5CFF]/10 flex items-center justify-center shrink-0 border border-[#7C5CFF]/15">
                    <UserCheck className="text-[#7C5CFF]" size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">Dedicated Designer</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Get matched with a dedicated creator specialized in your niche and aesthetic.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="rounded-xl overflow-hidden border border-white/5 relative aspect-video bg-[#08090F]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNGhIe65hedBMQpntQfoQ9c39rqSzj2Qc2lYFS7b05_TBo8JRUhazQFWiIqi8__QwklkV9U8p2FbUblHOqTKHGoXvV9CmYbbw7HETBOQCmpSQfqVzN8hVU9BZwtxoq0DgxIK7qN_mcesmxG2o-4vDVqeONzrtY0Aup5r5VDRlntXQDTlF6M3Qcg5bRYADnsO0FV6XNuZHo1hvyaiqLG5Yp-q5LXJY5OK6gnUBNcvKffrq90oreOMPgamrZpGMg6ahWY3wNNipT37o"
                  className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 hover:opacity-85 transition-all duration-500"
                  alt="Designer workspace"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090F]/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#7C5CFF] text-white rounded">
                    Artist Workspace
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN COLUMN: Request Wizard Form */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="glass-fill glass-stroke rounded-2xl p-6 md:p-10 space-y-8">
              
              {/* Progress Timeline Header */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#7C5CFF] font-bold">Step {step}: {stepLabels[step - 1]}</span>
                  <span className="text-gray-500 font-semibold">{step} / 3</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7C5CFF] transition-all duration-500"
                    style={{ width: `${(step / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Form Frame */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* STEP 1: Contact & Basics */}
                {step === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">Client Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                        <input
                          type="text"
                          required
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Rahul Sharma"
                          className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                        <input
                          type="email"
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="rahul@example.com"
                          className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                      <input
                        type="tel"
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 99999 88888"
                        className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Project Niche</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                          { id: 'logo', label: 'Logo & Identity' },
                          { id: 'wedding', label: 'Wedding Invitation' },
                          { id: 'social_media', label: 'Social Media Kit' },
                          { id: 'video', label: 'Video Editing' },
                          { id: 'motion', label: 'Motion Graphics' }
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleProjectTypeChange(item.id)}
                            className={`py-3 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                              formData.projectType === item.id
                                ? 'border-[#7C5CFF] bg-[#7C5CFF]/15 text-white'
                                : 'border-white/5 bg-[#08090F] text-gray-500 hover:text-white'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-6">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="action-primary px-8 py-3.5 rounded-xl text-xs font-bold hover:scale-102 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#7C5CFF]/20"
                      >
                        Continue to Scope <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Project Scope & Budget */}
                {step === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">Project Brief</h3>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Detailed Description</label>
                      <textarea
                        required
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Describe your design goals, mood, style, color preferences, and other requirements..."
                        className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Target Budget (INR)</label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                        >
                          <option value={499}>Basic (₹499)</option>
                          <option value={1499}>Standard (₹1,499)</option>
                          <option value={4999}>Premium (₹4,999)</option>
                          <option value={9999}>Custom Enterprise (₹9,999+)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Target Deadline</label>
                        <input
                          type="date"
                          required
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-3.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="action-primary px-8 py-3.5 rounded-xl text-xs font-bold hover:scale-102 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#7C5CFF]/20"
                      >
                        Continue to Resources <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Reference Links & Files */}
                {step === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">Reference Assets</h3>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Inspiration Links (Pinterest/Behance)</label>
                      <input
                        type="url"
                        name="referenceLink"
                        value={formData.referenceLink}
                        onChange={handleInputChange}
                        placeholder="https://pinterest.com/pin/..."
                        className="w-full bg-[#08090F] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Upload Brief Files / Mock Assets</label>
                      <div className="border-2 border-dashed border-white/10 hover:border-[#7C5CFF]/45 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 bg-[#08090F]/40 cursor-pointer relative transition-all group">
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <CloudUpload size={32} className="text-gray-500 group-hover:text-[#7C5CFF] transition-colors" />
                        <div className="text-center">
                          <p className="text-xs font-bold text-white mb-0.5">
                            {formData.fileName ? formData.fileName : 'Click or Drag files to upload'}
                          </p>
                          <p className="text-[10px] text-gray-500">ZIP, PSD, AI, JPG, PDF (Max 50MB)</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-3.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="action-primary px-12 py-3.5 rounded-xl text-xs font-bold hover:scale-102 flex items-center justify-center gap-2 shadow-lg shadow-[#7C5CFF]/30 cursor-pointer min-w-[150px]"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        ) : (
                          'Submit Request'
                        )}
                      </button>
                    </div>
                  </div>
                )}

              </form>
            </div>
          </div>

        </div>
      </main>
      <AIAssistant />
      <Footer />
    </>
  );
}
