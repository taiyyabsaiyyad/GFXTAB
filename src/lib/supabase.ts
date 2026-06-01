// GFXTAB.COM - Supabase Client & Local Mock State Manager
// This file coordinates DB requests, supporting real Supabase instances and a high-fidelity local fallback.

// Mock Database Initial State
export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  role: 'admin' | 'seller' | 'customer';
  bio: string;
  rating: number;
  projects_completed: number;
  earnings: number;
  withdrawable_balance: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Product {
  id: string;
  seller_id: string;
  seller_name?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  file_url: string;
  preview_url: string;
  formats: string[];
  resolution?: string;
  color_space?: string;
  dimensions?: string;
  licensing_info?: string;
  category_id: string;
  is_approved: boolean;
  tags: string[];
  created_at: string;
}

export interface CustomRequest {
  id: string;
  client_id: string;
  client_name?: string;
  project_type: string;
  budget: number;
  deadline: string;
  description: string;
  reference_links: string[];
  file_url?: string;
  status: 'pending' | 'briefing' | 'concepts' | 'refining' | 'final_review' | 'delivery' | 'completed';
  admin_notes?: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  custom_request_id?: string;
  content: string;
  file_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  category: string;
  created_at: string;
}

// Initial mock data pre-populated with real assets matching GFXTAB pricing & aesthetics
const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Wedding Cards', slug: 'wedding', icon: 'favorite', description: 'Premium invitations and stationery templates.' },
  { id: 'cat-2', name: 'Social Media Kits', slug: 'social-media', icon: 'campaign', description: 'High-converting Instagram, Facebook & ad templates.' },
  { id: 'cat-3', name: 'Mockups', slug: 'mockups', icon: 'layers', description: 'Photorealistic apparel, brand & packaging mockups.' },
  { id: 'cat-4', name: 'Video templates', slug: 'video-assets', icon: 'movie', description: 'Cinematic transitions, Premiere Pro presets & overlays.' },
  { id: 'cat-5', name: 'Logos & Branding', slug: 'logos', icon: 'pentagon', description: 'Minimalist vector logos and identity packages.' }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    seller_id: 'seller-1',
    seller_name: 'Studio Minimalist',
    title: 'Eternal Bloom: Luxury Wedding Invitation Suite',
    slug: 'eternal-bloom-wedding-suite',
    description: 'Elevate your wedding stationery with this meticulously crafted invitation template. Featuring elegant gold-foil textures and sophisticated serif layouts. Print-ready and fully editable.',
    price: 149,
    file_url: '#download-link-wedding',
    preview_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC24kajk7W804fFt9KFazG9kEmsZnIsn3kzeU4yPFMcVK_uCZHKmA9smMvq0U9Q0ujxRr2Tn1h3_x4kUyYOcQiBxojeA4Gb8_EYk_KpQsEp-IpqB3L-BIh07IXsT2HOgO4LfSLXY42mj7gavTA91pWGoT3OxDiY3JqiYAfZl7AISwcGAogyXTYCT3w4D7b-A2oBvRzQYRWRLgjzb4n0MNaTxdDgeODk12aJS5RtSORrTPtmgI-XtXrdOZSFiAsLxusN4pCwkhbZv0M',
    formats: ['AI', 'PSD', 'PDF'],
    resolution: '300 DPI (CMYK)',
    color_space: 'CMYK',
    dimensions: '5" x 7" (Standard)',
    licensing_info: 'Commercial License included',
    category_id: 'cat-1',
    is_approved: true,
    tags: ['wedding', 'luxury', 'gold', 'floral'],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-2',
    seller_id: 'seller-2',
    seller_name: 'Urban Creative',
    title: 'Urban Vibes Social Media Post Pack',
    slug: 'urban-vibes-social-pack',
    description: 'A set of 50+ bold, high-contrast Instagram posts and stories tailored for designers, artists, and streetwear brands.',
    price: 99,
    file_url: '#download-link-social',
    preview_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ-nmvMtiwcCpfdKHglhrkxKqgG6pwafmkPgQfqxBPZC-VTlp14AL77KAT_J1I5YVZmQQHfOh4HZMC9t6nea-boux-FHTrWRFzKxli29bh2MbtuliHCtGHudJwQ9rUdn9KIRGwu3JBaJTKZbatgdXddaynbxVEOhN7FB_M6wZG3Jj2OeRDJxfQr6uYzy6LJHckzkUbWUWRSJd80kE9S3WwQAHumYtwffLSOzUyW_4p4TiFCst_SF5jVaKmTyClH9s_78Qg8m_LHg8',
    formats: ['PSD', 'Figma'],
    resolution: '72 DPI (RGB)',
    color_space: 'RGB',
    dimensions: '1080 x 1080 px',
    category_id: 'cat-2',
    is_approved: true,
    tags: ['instagram', 'streetwear', 'neon', 'social-media'],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-3',
    seller_id: 'seller-1',
    seller_name: 'Studio Minimalist',
    title: 'Cinematic Light Leaks & Transitions Pack',
    slug: 'cinematic-light-leaks-pack',
    description: '12 high-resolution 4K overlays for Premiere Pro, DaVinci Resolve, and Final Cut. Includes organic lens flares and light leaks.',
    price: 299,
    file_url: '#download-link-video',
    preview_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0h42dfKw8KDD8Ic3tn6-xqvYBPZJ8lyFbiNj1fdvufPkNguJWrrgGFEMaq5_c5sP9wZWvQvPSyd2zk5wbdFh1O5Rn0N3AM9iesrg-dWTUjwE8w0Y34O4ggtqSJtNWperi03yW1v6JTc-GrEwU121Aemd2JRKDoWIXZUe3byQFVoDrWId0_dPeGVv0xCnGIJHaeImxLNaC6OPvpA4-ONE0NYSNj88wA7mqErStR-JKSp8PF_vO_vNqm3LfAUpEoZFGSlxPLPfc74k',
    formats: ['MP4', 'PRPROJ'],
    resolution: '4K UHD',
    color_space: 'RGB',
    dimensions: '3840 x 2160',
    category_id: 'cat-4',
    is_approved: true,
    tags: ['transitions', 'premiere-pro', 'cinematic', 'video'],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-4',
    seller_id: 'seller-3',
    seller_name: 'Pixel Perfect',
    title: 'Minimalist Business Card Mockup Vol 1',
    slug: 'minimalist-business-card-mockup-v1',
    description: 'Photorealistic business card mockup featuring elegant shadows, textured paper overlays, and premium glassmorphic accents.',
    price: 79,
    file_url: '#download-link-mockup',
    preview_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ9pcwaFLfYUDz3sxWp8wl4TTYNC9JJEi8uNB8gYtn-QgQ6Z7-nhTK5Ba2n05SmRhFi8jzApdk-F51dCOjVsiEsI82XGAYb93nzpX9gj1nzr6svfn8-pMFiNB2usOiaupzmRLxPkbhTBJD9yzAXq5zqW9UZLhC2RVssTph-2r2VkvyQqFkmizOCTfvy9xuKscvWlLYlWHGo8-RmeeSgVGxd5W_OhAaueB88Nuv9dlEiISyMYLsgV9PZJTAGHyvnXsDc2hVgz5AWLc',
    formats: ['PSD'],
    resolution: '300 DPI',
    color_space: 'RGB',
    dimensions: '4000 x 3000 px',
    category_id: 'cat-3',
    is_approved: true,
    tags: ['business-card', 'mockup', 'psd', 'branding'],
    created_at: new Date().toISOString()
  }
];

const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Top Typography Trends to Watch in 2026',
    slug: 'top-typography-trends-2026',
    content: 'From kinetic serifs to brutalist sans-serifs, typography is moving towards high-impact and emotionally expressive displays. Discover how fonts are defining the modern dark UI trend.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEUcAO2eROZ0hDKgRB5GDq1pJv5gdIbVXd7S9eruaacZxwiT9y1yC__r1WTyj5DZ6Gub7k0rwmfrzdaMs75dJZS_7MzbKi7FicaBnr-bM8t0d25Hv-ty9vCFjBP2eQeV0k7Yq5GuRLP4KXtUow2XJhRnC-1F6tGjzIODK9ZAYbUVDEsBdRCQ8u2zF744xiug32I_weWt-KvXWZXcPb9zdEHsbAGD_EKTKg4klgSTJzOivgUU1h4EIVgMXHbTyCDnwlAMmGHkjkNCE',
    category: 'Design Trends',
    created_at: new Date().toISOString()
  },
  {
    id: 'news-2',
    title: 'How AI Design Assistants Are Changing Frontend Workflows',
    slug: 'ai-assistants-changing-workflows',
    content: 'AI design tools are integrating directly into IDEs and workspaces, generating contextual layouts and template recommendations. Learn how creatives can utilize this to scale design work.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNGhIe65hedBMQpntQfoQ9c39rqSzj2Qc2lYFS7b05_TBo8JRUhazQFWiIqi8__QwklkV9U8p2FbUblHOqTKHGoXvV9CmYbbw7HETBOQCmpSQfqVzN8hVU9BZwtxoq0DgxIK7qN_mcesmxG2o-4vDVqeONzrtY0Aup5r5VDRlntXQDTlF6M3Qcg5bRYADnsO0FV6XNuZHo1hvyaiqLG5Yp-q5LXJY5OK6gnUBNcvKffrq90oreOMPgamrZpGMg6ahWY3wNNipT37o',
    category: 'AI Design Tools',
    created_at: new Date().toISOString()
  }
];

class MockDBService {
  private getStorage<T>(key: string, initial: T[]): T[] {
    if (typeof window === 'undefined') return initial;
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(item);
  }

  private setStorage<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Active User State
  getCurrentUser(): Profile {
    if (typeof window === 'undefined') {
      return {
        id: 'user-default',
        full_name: 'Alex Rivera',
        avatar_url: '',
        role: 'customer',
        bio: 'Digital Creator',
        rating: 5.0,
        projects_completed: 4,
        earnings: 0,
        withdrawable_balance: 0
      };
    }
    const stored = localStorage.getItem('gfxtab_current_user');
    if (!stored) {
      const defaultUser: Profile = {
        id: 'customer-1',
        full_name: 'Alex Rivera',
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTKo0WhvevHNuO8NjYbWhB5aP4TwnRsRpM1z26RmbXqeVsDxBAyMLckT7dBRwktXnVxBeGa8owNxHPT6MY8oeEbHycLZ23HbXprVVEg9CRkFAeOOf45pVjQvKp9Nm5q8ai9W9CPwqDQ5niyyHcv8jHNXYLNYbCHBvMv7kWVC-LMZodEvq0VfaojZn8PSCgU9oLekAsqVqH3bu4e45wLTO0-AuI8vjqErYiaYhdwexEnjJVaf7FT8HSIJBHHnz_R8Z250U-qbahw_s',
        role: 'customer',
        bio: 'Pro Digital Artist & Designer',
        rating: 5.0,
        projects_completed: 12,
        earnings: 0,
        withdrawable_balance: 0
      };
      localStorage.setItem('gfxtab_current_user', JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(stored);
  }

  setCurrentUser(user: Partial<Profile>): Profile {
    const current = this.getCurrentUser();
    const updated = { ...current, ...user } as Profile;
    localStorage.setItem('gfxtab_current_user', JSON.stringify(updated));
    return updated;
  }

  // Categories
  getCategories(): Category[] {
    return this.getStorage('gfxtab_categories', INITIAL_CATEGORIES);
  }

  // Products
  getProducts(): Product[] {
    return this.getStorage('gfxtab_products', INITIAL_PRODUCTS);
  }

  addProduct(product: Omit<Product, 'id' | 'created_at'>): Product {
    const list = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: 'prod-' + (list.length + 1),
      created_at: new Date().toISOString()
    };
    list.unshift(newProduct);
    this.setStorage('gfxtab_products', list);
    return newProduct;
  }

  // Custom Requests
  getCustomRequests(): CustomRequest[] {
    return this.getStorage('gfxtab_custom_requests', [
      {
        id: 'req-1',
        client_id: 'customer-1',
        client_name: 'Alex Rivera',
        project_type: 'Logo Design',
        budget: 1499,
        deadline: '2026-06-15',
        description: 'Need a premium minimalist vector logo representing modern tech-forward creative marketplace.',
        reference_links: ['https://gfxtab.com'],
        status: 'refining',
        admin_notes: 'Designer is refining initial concepts. Delivery expected on time.',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
  }

  addCustomRequest(req: Omit<CustomRequest, 'id' | 'client_id' | 'client_name' | 'created_at' | 'status'>): CustomRequest {
    const list = this.getCustomRequests();
    const user = this.getCurrentUser();
    const newReq: CustomRequest = {
      ...req,
      id: 'req-' + (list.length + 1),
      client_id: user.id,
      client_name: user.full_name,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    list.unshift(newReq);
    this.setStorage('gfxtab_custom_requests', list);
    return newReq;
  }

  updateCustomRequestStatus(id: string, status: CustomRequest['status'], adminNotes?: string): CustomRequest | null {
    const list = this.getCustomRequests();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    if (adminNotes) list[idx].admin_notes = adminNotes;
    this.setStorage('gfxtab_custom_requests', list);
    return list[idx];
  }

  // Messages
  getMessages(): Message[] {
    return this.getStorage('gfxtab_messages', [
      {
        id: 'msg-1',
        sender_id: 'admin',
        receiver_id: 'customer-1',
        custom_request_id: 'req-1',
        content: 'Hi Alex! We received your logo design brief. The design lead is working on the concept boards.',
        is_read: true,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-2',
        sender_id: 'customer-1',
        receiver_id: 'admin',
        custom_request_id: 'req-1',
        content: 'Awesome, thanks! Please ensure it fits a dark UI theme nicely.',
        is_read: true,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
  }

  sendMessage(receiverId: string, content: string, customRequestId?: string, fileUrl?: string): Message {
    const list = this.getMessages();
    const user = this.getCurrentUser();
    const newMsg: Message = {
      id: 'msg-' + (list.length + 1),
      sender_id: user.id,
      receiver_id: receiverId,
      custom_request_id: customRequestId,
      content,
      file_url: fileUrl,
      is_read: false,
      created_at: new Date().toISOString()
    };
    list.push(newMsg);
    this.setStorage('gfxtab_messages', list);
    return newMsg;
  }

  // News Articles
  getNews(): NewsArticle[] {
    return this.getStorage('gfxtab_news', INITIAL_NEWS);
  }

  addNews(article: Omit<NewsArticle, 'id' | 'created_at'>): NewsArticle {
    const list = this.getNews();
    const newArticle: NewsArticle = {
      ...article,
      id: 'news-' + (list.length + 1),
      created_at: new Date().toISOString()
    };
    list.unshift(newArticle);
    this.setStorage('gfxtab_news', list);
    return newArticle;
  }

  // Orders
  getOrders() {
    return this.getStorage('gfxtab_orders', [
      {
        id: 'ord-1',
        customer_id: 'customer-1',
        total_amount: 149,
        payment_status: 'paid',
        payment_id: 'pay_razor_1298402',
        gst_number: '27AAAAA1111A1Z1',
        invoice_url: '#invoice-link',
        products: ['prod-1'],
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
  }

  createOrder(productIds: string[], gst?: string) {
    const list = this.getOrders();
    const products = this.getProducts().filter(p => productIds.includes(p.id));
    const total = products.reduce((acc, curr) => acc + curr.price, 0);
    const user = this.getCurrentUser();
    const newOrder = {
      id: 'ord-' + (list.length + 1),
      customer_id: user.id,
      total_amount: total,
      payment_status: 'paid',
      payment_id: 'pay_mock_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      gst_number: gst || '',
      invoice_url: '#invoice-mock',
      products: productIds,
      created_at: new Date().toISOString()
    };
    list.unshift(newOrder);
    this.setStorage('gfxtab_orders', list);
    return newOrder;
  }
}

export const mockDB = new MockDBService();
