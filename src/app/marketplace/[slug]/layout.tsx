import { mockDB } from '@/lib/supabase';

export async function generateStaticParams() {
  const products = mockDB.getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
