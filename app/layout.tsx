import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Grapeyear | Visual Climate Intelligence',
  description: 'Vintage intelligence driven by objective climate data.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#0a0a0a] text-white antialiased font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

