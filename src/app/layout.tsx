import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { AuthProvider } from '@/lib/auth/client';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Get Listings Portal',
  description: 'AI-powered seller predictions for real estate agents',
  keywords: ['real estate', 'seller predictions', 'listings', 'AI'],
  authors: [{ name: 'Get Listings' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#c8102e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans antialiased">
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
