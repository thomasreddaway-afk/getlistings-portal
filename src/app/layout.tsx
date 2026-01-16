import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/lib/auth/client';
import { Providers } from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Get Listings Portal',
  description: 'AI-powered seller predictions for real estate agents',
  keywords: ['real estate', 'seller predictions', 'listings', 'AI'],
  authors: [{ name: 'Get Listings' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>
          <AuthProvider>
            {children}
            {/* Recaptcha container for phone auth */}
            <div id="recaptcha-container" />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
