import type { Metadata, Viewport } from 'next';
import { DM_Sans, Space_Mono, Press_Start_2P } from 'next/font/google';
import '@/styles/globals.css';
import { AppProviders } from '@/contexts/providers';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { headers } from 'next/headers';
import Web3Provider from '@/contexts/web3-provider';
import { TopBanner } from '@/components/layout/TopBanner';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'PraxisGrove',
  description: '基于AI技术的创新在线教育平台，提供个性化学习体验和3D知识宇宙',
  keywords: ['在线教育', 'AI学习', '3D知识图谱', '个性化教育'],
  authors: [{ name: 'PraxisGrove Team' }],
  icons: {
    icon: [
      { url: '/logo/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/favicon.ico', sizes: 'any' },
    ],
    apple: '/logo/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/logo/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/logo/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/logo/site.webmanifest',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Sans:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${dmSans.variable} ${spaceMono.variable} ${pressStart2P.variable}`}
      >
        <TopBanner />
        <Web3Provider cookies={cookies}>
          <AppProviders>
            <div id="root">{children}</div>
          </AppProviders>
        </Web3Provider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
