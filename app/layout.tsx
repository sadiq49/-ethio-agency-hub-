import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/accessibility.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AccessibilityProvider } from "@/components/accessibility/accessibility-provider";
import { TourProvider } from "@/components/tours/tour-provider";
import { QueryProvider } from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ethio Agency Hub",
  description: "Agency Management System for Ethiopian Employment Agencies",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  );
}