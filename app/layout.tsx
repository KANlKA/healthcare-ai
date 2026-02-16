// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CAREPATH-AI | Healthcare Journey Explainer',
  description: 'Educational tool for understanding care journeys with AI-powered explanations',
  keywords: 'healthcare, care journey, patient education, AI explanations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <DisclaimerBanner />
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}