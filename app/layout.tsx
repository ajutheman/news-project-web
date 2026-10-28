import type { Metadata } from 'next';
import './globals.css';
import { HydrationFix } from '@/components/HydrationFix';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { newsStore } from '@/lib/data/store';

export const metadata: Metadata = {
  title: 'ദ പ്രോഫിറ്റ് - മലയാളം ബിസിനസ് & വാർത്താ പോർട്ടൽ | The Profit Malayalam News',
  description: 'കേരളത്തിലെ ഏറ്റവും പുതിയ ബിസിനസ്, നിക്ഷേപ, ഓഹരി വിപണി, സാങ്കേതിക, സംസ്ഥാന സമകാലിക വാർത്തകൾ. Gold rate today, Sensex, Nifty updates.',
  keywords: ['മലയാളം വാർത്ത', 'കേരളം', 'സ്വർണവില', 'ബിസിനസ്', 'നിക്ഷേപം', 'ഓഹരി വിപണി', 'Kerala News', 'Gold rate Kerala'],
  authors: [{ name: 'The Profit Desk' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'ദ പ്രോഫിറ്റ് - The Profit Malayalam News Portal',
    description: 'സമഗ്രമായ മലയാളം വാർത്തകളും നിക്ഷേപ വിശകലനങ്ങളും.',
    type: 'website',
    locale: 'ml_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = newsStore.getFlatCategories();
  const rates = newsStore.getDailyRates();
  const gold22kGram = rates.find(r => r.metal === 'gold_22k' && r.unit === 'gram')?.amount_inr || 7350;
  const gold22kPavan = rates.find(r => r.metal === 'gold_22k' && r.unit === 'pavan')?.amount_inr || 58800;

  return (
    <html lang="ml" translate="no" className="notranslate" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-text antialiased font-ui selection:bg-accent/20 selection:text-accent">
        <HydrationFix />
        <ThemeProvider>
          <AuthProvider>
            <Navbar
              categories={categories}
              goldRate={{ gram: gold22kGram, pavan: gold22kPavan }}
            />
            <main className="flex-1 max-w-content w-full mx-auto px-4 py-6">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
