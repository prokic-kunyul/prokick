import type { Metadata } from "next";
import { Geist, Geist_Mono, Russo_One } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { ContentProtection } from "@/components/ContentProtection";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import { QuickViewProvider } from "@/components/QuickViewProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const russoOne = Russo_One({
  variable: "--font-russo-one",
  weight: "400",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://pro-kick.vercel.app'), // TODO: Change to actual domain
  title: {
    default: 'PRO-KICK | Toko Jersey Original Terlengkap',
    template: '%s | PRO-KICK'
  },
  description: 'Pusat belanja jersey bola grade ori, sepatu bola, windbreaker, dan aksesoris olahraga premium dengan harga terbaik. Kualitas terjamin dan pengiriman cepat.',
  keywords: ['jersey bola', 'toko jersey', 'sepatu bola', 'jersey grade ori', 'windbreaker', 'pro-kick', 'jersey retro'],
  authors: [{ name: 'Pro-Kick' }],
  publisher: 'Pro-Kick',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://pro-kick.vercel.app',
    title: 'PRO-KICK | Pusat Jersey & Perlengkapan Bola Premium',
    description: 'Temukan koleksi jersey liga top eropa, retro, dan apparel olahraga kualitas terbaik. Garansi kepuasan 100%.',
    siteName: 'PRO-KICK',
    images: [
      {
        url: '/og-image.jpg', // Make sure this exists or fallback
        width: 1200,
        height: 630,
        alt: 'Pro-Kick Collection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRO-KICK | Global Football Store',
    description: 'Authentic quality jerseys and sportswear for champions.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/FAVICON.png', sizes: '32x32', type: 'image/png' },
      { url: '/FAVICON.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/FAVICON.png',
  },
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch settings for global configuration
  // We use a try-catch block to ensure the app doesn't crash if DB is unreachable
  let whatsappNumber = '6282197008330'; // Default fallback
  
  try {
    const { db } = await import('@/lib/db');
    const { settings } = await import('@/db/schema');
    const { eq } = await import('drizzle-orm');
    
    // Use select query instead of query builder to avoid TS issues with global type
    const result = await db.select().from(settings).where(eq(settings.key, 'whatsapp'));
    const whatsappSetting = result[0];
    
    if (whatsappSetting?.value) {
      whatsappNumber = whatsappSetting.value;
    }
  } catch (error) {
    console.error('Failed to load settings in layout:', error);
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${russoOne.variable} antialiased bg-black text-white pb-16 md:pb-0`}
      >
        <ContentProtection />
        <QuickViewProvider>
          {children}
        </QuickViewProvider>
        <Footer />
        <BottomNav />
        <WhatsAppFloatButton phoneNumber={whatsappNumber} />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
