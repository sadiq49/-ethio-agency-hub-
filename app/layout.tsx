import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/accessibility.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AccessibilityProvider } from "@/components/accessibility/accessibility-provider";
import { TourProvider } from "@/components/tours/tour-provider";
import { QueryProvider } from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProviders } from '@/components/providers/app-providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Project Bolt',
  description: 'Streamlined document management for travel agencies',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <TooltipProvider>
            <QueryProvider>
              <ThemeProvider defaultTheme="system" storageKey="ethio-agency-hub-theme">
                <AccessibilityProvider>
                  <TourProvider>
                    {children}
                  </TourProvider>
                </AccessibilityProvider>
              </ThemeProvider>
            </QueryProvider>
          </TooltipProvider>
        </AppProviders>
      </body>
    </html>
  );
}