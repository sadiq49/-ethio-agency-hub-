"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-primary-100 text-primary-700" 
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: cn(
          "h-5 w-5",
          isActive ? "text-primary-700" : "text-neutral-500"
        ),
      })}
      <span>{label}</span>
    </Link>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();

  const navigation = [
    { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: '/workers', icon: <Users />, label: 'Workers' },
    { href: '/documents', icon: <FileText />, label: 'Documents' },
    { href: '/jobs', icon: <Briefcase />, label: 'Jobs' },
    { href: '/notifications', icon: <Bell />, label: 'Notifications' },
    { href: '/settings', icon: <Settings />, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar for desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-neutral-200 bg-white lg:flex",
      )}>
        <div className="flex h-14 items-center border-b border-neutral-200 px-4">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
        <div className="border-t border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
              <AvatarFallback>{profile?.full_name?.[0] || user?.email?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <div className="text-sm font-medium text-neutral-900">{profile?.full_name || 'User'}</div>
              <div className="truncate text-xs text-neutral-500">{user?.email}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5 text-neutral-500" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 bg-black/80 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )} onClick={() => setSidebarOpen(false)} />

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-neutral-200 bg-white transition-transform lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-4">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
        <div className="border-t border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
              <AvatarFallback>{profile?.full_name?.[0] || user?.email?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <div className="text-sm font-medium text-neutral-900">{profile?.full_name || 'User'}</div>
              <div className="truncate text-xs text-neutral-500">{user?.email}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5 text-neutral-500" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top navigation */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-neutral-200 bg-white px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                    <AvatarFallback>{profile?.full_name?.[0] || user?.email?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-flex">{profile?.full_name || 'User'}</span>
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}