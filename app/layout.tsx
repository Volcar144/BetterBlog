import React from 'react';
import { Metadata } from 'next';
// Temporarily disabled Google Fonts for build - they work in production
// import { Inter as FontSans, Lato, Nunito } from 'next/font/google';
import { cn } from '@/lib/utils';
import { VideoDialogProvider } from '@/components/ui/VideoDialogContext';
import VideoDialog from '@/components/ui/VideoDialog';

import '@/styles.css';
import { TailwindIndicator } from '@/components/ui/breakpoint-indicator';

// Temporarily using system fonts for build
// const fontSans = FontSans({
//   subsets: ['latin'],
//   variable: '--font-sans',
//   fallback: ['system-ui', 'arial'],
//   display: 'swap',
// });

// const nunito = Nunito({
//   subsets: ['latin'],
//   variable: '--font-nunito',
//   fallback: ['system-ui', 'arial'],
//   display: 'swap',
// });

// const lato = Lato({
//   subsets: ['latin'],
//   variable: '--font-lato',
//   weight: '400',
//   fallback: ['system-ui', 'arial'],
//   display: 'swap',
// });

export const metadata: Metadata = {
  title: 'AMT blog',
  description: "Archie's Blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <VideoDialogProvider>
          {children}
          <VideoDialog />
        </VideoDialogProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
