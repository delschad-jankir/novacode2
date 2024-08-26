import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';
import { RowDataProvider } from '@/context/rowDataContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Novacode',
  description: 'AI Onboarding for Software Developers'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-hidden `}
        suppressHydrationWarning={true}
      >
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>
          <RowDataProvider> {/* Wrap the children with RowDataProvider */}
            <Toaster />
            {children}
          </RowDataProvider>
        </Providers>
      </body>
    </html>
  );
}