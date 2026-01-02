import type { Metadata } from 'next';
import { Inter, Patrick_Hand } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  title: 'My Personal Space',
  description: 'A personal thinking and learning space.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${patrickHand.variable} ${inter.variable}`}>
        <NextAuthProvider>
          <div className="container">
            <Navbar />
            <main style={{ flex: 1, width: '100%' }}>{children}</main>
            <Footer />
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
