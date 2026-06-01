import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GFXTAB | India's Premium Creative Marketplace & Service Hub",
  description: "Buy Photoshop templates, vector graphics, mockups, LUTs, and hire expert designers. Indian prices, Razorpay & UPI support, GST-ready invoices.",
  metadataBase: new URL("https://gfxtab.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GFXTAB | India's Premium Creative Marketplace",
    description: "Buy Photoshop templates, mockups, vector logos, and request custom design works. Instant downloads, GST-ready invoicing.",
    url: "https://gfxtab.com",
    siteName: "GFXTAB",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GFXTAB Marketplace",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GFXTAB | Premium Creative Asset Hub",
    description: "Buy graphic templates and hire professional designers. UPI and Razorpay checkout support.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#08090F] antialiased">
        {children}
      </body>
    </html>
  );
}
