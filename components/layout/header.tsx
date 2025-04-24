"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "../theme/theme-toggle";
import { AccessibilityMenu } from "../accessibility/accessibility-menu";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";
import { useTour } from "../tours/tour-provider";

export function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { startTour } = useTour();
  
  const navItems = [
    { name: "Dashboard", href: "/", tourId: "dashboard" },
    { name: "Workers", href: "/workers", tourId: "workers" },
    { name: "Documents", href: "/documents", tourId: "documents" },
    { name: "Travel", href: "/travel", tourId: "travel" },
    { name: "Agents", href: "/agents", tourId: "agents" },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="text-sm font-medium transition-colors hover:text-primary"
          onClick={() => startTour(item.tourId)}
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Ethio Agency Hub</span>
          </Link>
          
          {!isMobile && (
            <nav className="mx-6 flex items-center space-x-4">
              <NavLinks />
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AccessibilityMenu />
          
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-8">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}