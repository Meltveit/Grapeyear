import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Grapeyear | Visual Climate Intelligence',
  description: 'Vintage intelligence driven by objective climate data.',
  keywords: ['wine', 'vintage', 'climate', 'data', 'bordeaux', 'napa', 'tuscany', 'harvest'],
  openGraph: {
    title: 'Grapeyear | Visual Climate Intelligence',
    description: 'Explore wine vintages through the lens of climate data. Objective scores for collectors and investors.',
    url: 'https://www.grapeyear.com',
    siteName: 'Grapeyear',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Grapeyear - The Digital Terroir',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grapeyear | Visual Climate Intelligence',
    description: 'Explore wine vintages through the lens of climate data.',
    images: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200'],
  },
  metadataBase: new URL('https://www.grapeyear.com'),
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Grapeyear',
    url: 'https://www.grapeyear.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.grapeyear.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Preconnect to external origins for better performance */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="bg-[#0a0a0a] text-white antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

