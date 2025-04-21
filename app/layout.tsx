import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import SidebarLayout from '@/components/layout/sidebar-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ethio Agency Hub - Agency Management System',
  description: 'A comprehensive digital platform for Ethiopian employment agencies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SidebarLayout>
            {children}
          </SidebarLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}