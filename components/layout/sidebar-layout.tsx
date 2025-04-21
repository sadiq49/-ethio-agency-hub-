"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserNav } from '@/components/layout/user-nav';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { 
  Home, 
  Users, 
  FileText, 
  Plane, 
  Book, 
  BarChart3, 
  Settings, 
  Building, 
  UserCheck,
  Menu,
  GraduationCap
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Worker Management",
    href: "/workers",
    icon: Users,
    subItems: [
      { title: "Registration", href: "/workers/registration" },
      { title: "CV Generator", href: "/workers/cv-generator" },
      { title: "CV Database", href: "/workers/cv-database" },
      { title: "Training", href: "/workers/training" },
      { title: "Status Tracking", href: "/workers/status" },
    ],
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
    subItems: [
      { title: "MOLS Submission", href: "/documents/mols" },
      { title: "Visa Management", href: "/documents/visa" },
      { title: "Missing Report", href: "/documents/missing-report" },
      { title: "Cross-Match", href: "/documents/cross-match" },
    ],
  },
  {
    title: "Travel",
    href: "/travel",
    icon: Plane,
    subItems: [
      { title: "Ticket Arrangement", href: "/travel/tickets" },
      { title: "Departure Preparation", href: "/travel/departure" },
      { title: "Today Flying", href: "/travel/today-flying" },
    ],
  },
  {
    title: "Hajj & Umrah",
    href: "/hajj-umrah",
    icon: Book,
  },
  {
    title: "Institutions",
    href: "/institutions",
    icon: Building,
  },
  {
    title: "Agents",
    href: "/agents",
    icon: UserCheck,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openSubItems, setOpenSubItems] = useState<string[]>([]);

  const toggleSubItems = (title: string) => {
    if (openSubItems.includes(title)) {
      setOpenSubItems(openSubItems.filter(item => item !== title));
    } else {
      setOpenSubItems([...openSubItems, title]);
    }
  };

  const isSubItemActive = (href: string) => {
    return pathname === href;
  };

  const isNavItemActive = (item: any) => {
    if (pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some((subItem: any) => pathname === subItem.href);
    }
    return false;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 pr-0">
                <MobileNav 
                  items={navItems} 
                  pathname={pathname} 
                  openSubItems={openSubItems}
                  toggleSubItems={toggleSubItems}
                  isSubItemActive={isSubItemActive}
                  isNavItemActive={isNavItemActive}
                  setIsOpen={setIsOpen}
                />
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl inline-block">
                Ethio Agency Hub
              </span>
            </Link>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-lg hidden md:block">
            Agency Management System
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden md:flex w-72 flex-col border-r bg-background">
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-2 p-4">
              {navItems.map((item, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <Button
                    asChild={!item.subItems}
                    variant={isNavItemActive(item) ? "secondary" : "ghost"}
                    className={cn(
                      "justify-start",
                      item.subItems && "cursor-pointer",
                      isNavItemActive(item) && "font-medium"
                    )}
                    onClick={() => item.subItems && toggleSubItems(item.title)}
                  >
                    {item.subItems ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </div>
                        <div className={`transform transition-transform ${openSubItems.includes(item.title) ? 'rotate-90' : ''}`}>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.75 9L7.5 6L3.75 3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <Link href={item.href} className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Link>
                    )}
                  </Button>
                  {item.subItems && openSubItems.includes(item.title) && (
                    <div className="ml-6 flex flex-col gap-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <Button
                          key={subIndex}
                          asChild
                          variant={isSubItemActive(subItem.href) ? "secondary" : "ghost"}
                          className="justify-start h-9"
                        >
                          <Link href={subItem.href}>
                            {subItem.title}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

interface MobileNavProps {
  items: any[];
  pathname: string;
  openSubItems: string[];
  toggleSubItems: (title: string) => void;
  isSubItemActive: (href: string) => boolean;
  isNavItemActive: (item: any) => boolean;
  setIsOpen: (open: boolean) => void;
}

function MobileNav({ 
  items, 
  pathname, 
  openSubItems, 
  toggleSubItems, 
  isSubItemActive, 
  isNavItemActive,
  setIsOpen 
}: MobileNavProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-4">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col gap-1">
            <Button
              asChild={!item.subItems}
              variant={isNavItemActive(item) ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                item.subItems && "cursor-pointer",
                isNavItemActive(item) && "font-medium"
              )}
              onClick={() => {
                if (item.subItems) {
                  toggleSubItems(item.title);
                } else {
                  setIsOpen(false);
                }
              }}
            >
              {item.subItems ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </div>
                  <div className={`transform transition-transform ${openSubItems.includes(item.title) ? 'rotate-90' : ''}`}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.75 9L7.5 6L3.75 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <Link href={item.href} className="flex items-center" onClick={() => setIsOpen(false)}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              )}
            </Button>
            {item.subItems && openSubItems.includes(item.title) && (
              <div className="ml-6 flex flex-col gap-1">
                {item.subItems.map((subItem: any, subIndex: number) => (
                  <Button
                    key={subIndex}
                    asChild
                    variant={isSubItemActive(subItem.href) ? "secondary" : "ghost"}
                    className="justify-start h-9"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={subItem.href}>
                      {subItem.title}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}