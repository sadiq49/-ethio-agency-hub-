"use client";

import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

export function ResponsiveContainer({
  children,
  className,
  mobileClassName,
  tabletClassName,
  desktopClassName,
}: ResponsiveContainerProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  return (
    <div
      className={cn(
        className,
        isMobile && mobileClassName,
        isTablet && tabletClassName,
        isDesktop && desktopClassName
      )}
    >
      {children}
    </div>
  );
}