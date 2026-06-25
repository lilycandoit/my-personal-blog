import type { Metadata } from 'next';
import { Inter, Patrick_Hand } from 'next/font/google';
import './globals.css';
import NextAuthProvider from './providers';

const patrickHand = Patrick_Hand({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-body',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://me-blog-au.vercel.app'),
  title: "Duong's",
  description: 'One step at a time.',
  openGraph: {
    title: "Duong's",
    description: 'One step at a time.',
    url: 'https://liduong.com',
    siteName: "Duong's",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Duong's",
    description: 'One step at a time.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${patrickHand.variable} ${inter.variable}`}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}

