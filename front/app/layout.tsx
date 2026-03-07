import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'First Shop',
  description: 'Votre boutique e-commerce de confiance - First Shop',
};

import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { CartProvider } from '@/lib/context/CartContext';
import { AuthProvider } from '@/components/AuthProvider';

import { FloatingChatWidget } from '@/components/chat/FloatingChatWidget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              {children}
              <FloatingChatWidget />
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
