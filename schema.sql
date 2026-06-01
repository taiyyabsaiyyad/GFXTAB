-- GFXTAB.COM - Supabase / PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor to initialize all tables, roles, and triggers.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types / enums
CREATE TYPE user_role AS ENUM ('admin', 'seller', 'customer');
CREATE TYPE custom_request_status AS ENUM ('pending', 'briefing', 'concepts', 'refining', 'final_review', 'delivery', 'completed');
CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved');

-- 1. PROFILES Table (Extends Supabase Auth users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role public.user_role NOT NULL DEFAULT 'customer',
    bio TEXT,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    projects_completed INT DEFAULT 0,
    earnings DECIMAL(12, 2) DEFAULT 0.00,
    withdrawable_balance DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORIES Table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT, -- Lucide icon name or Material Symbol identifier
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS Table (Marketplace templates, mockups, etc.)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Price in INR
    file_url TEXT NOT NULL, -- URL to main downloadable zip/file in storage bucket
    preview_url TEXT NOT NULL, -- URL to main preview image
    formats TEXT[] NOT NULL, -- e.g., ARRAY['PSD', 'AI', 'PDF']
    resolution TEXT, -- e.g., '300 DPI'
    color_space TEXT, -- e.g., 'CMYK', 'RGB'
    dimensions TEXT, -- e.g., '5x7 inches'
    licensing_info TEXT DEFAULT 'Commercial License',
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PRODUCT PREVIEWS Table (Additional gallery images or videos)
CREATE TABLE public.product_previews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'video'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDERS Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    payment_id TEXT, -- Razorpay or Stripe reference
    gst_number TEXT,
    invoice_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDER ITEMS Table
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- 7. CUSTOM REQUESTS Table (Custom design projects)
CREATE TABLE public.custom_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    project_type TEXT NOT NULL, -- 'wedding', 'logo', 'brand_identity', 'social_media', 'video', 'motion'
    budget DECIMAL(10, 2) NOT NULL,
    deadline DATE NOT NULL,
    description TEXT NOT NULL,
    reference_links TEXT[],
    file_url TEXT, -- Attachments uploaded by client
    status public.custom_request_status NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. MESSAGES Table (Client-Admin chat for projects)
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    custom_request_id UUID REFERENCES public.custom_requests(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    file_url TEXT, -- Optional chat attachment
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. NEWS ARTICLES Table (Design News / Blog CMS)
CREATE TABLE public.news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL, -- 'design trends', 'AI tools', 'industry updates', 'marketing'
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. REVIEWS Table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(product_id, customer_id)
);

-- 11. WISHLIST Table
CREATE TABLE public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(customer_id, product_id)
);

-- 12. SUPPORT TICKETS Table
CREATE TABLE public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status public.ticket_status NOT NULL DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. SELLER WITHDRAWALS Table
CREATE TABLE public.seller_withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status public.withdrawal_status NOT NULL DEFAULT 'pending',
    payment_method TEXT NOT NULL, -- 'UPI', 'Bank Transfer'
    payment_details TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert/update their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Create profile trigger when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'customer'::public.user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to auto-update 'updated_at' columns
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_custom_requests_modtime BEFORE UPDATE ON public.custom_requests FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_news_articles_modtime BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
