"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type AccessibilityOptions = {
  fontSize: "normal" | "large" | "x-large";
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
};

type AccessibilityContextType = {
  options: AccessibilityOptions;
  updateOptions: (options: Partial<AccessibilityOptions>) => void;
};

const defaultOptions: AccessibilityOptions = {
  fontSize: "normal",
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined
);

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [options, setOptions] = useState<AccessibilityOptions>(defaultOptions);

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const savedOptions = localStorage.getItem("accessibility-options");
    if (savedOptions) {
      try {
        setOptions(JSON.parse(savedOptions));
      } catch (error) {
        console.error("Failed to parse accessibility options:", error);
      }
    }
    
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    
    if (prefersReducedMotion) {
      setOptions((prev) => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  // Apply accessibility options to document
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const root = document.documentElement;
    
    // Font size
    root.classList.remove("text-normal", "text-large", "text-x-large");
    root.classList.add(`text-${options.fontSize}`);
    
    // High contrast
    if (options.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    
    // Reduced motion
    if (options.reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }
    
    // Screen reader optimizations
    if (options.screenReader) {
      root.classList.add("screen-reader-optimized");
    } else {
      root.classList.remove("screen-reader-optimized");
    }
    
    // Save preferences
    localStorage.setItem("accessibility-options", JSON.stringify(options));
  }, [options]);

  const updateOptions = (newOptions: Partial<AccessibilityOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }));
  };

  return (
    <AccessibilityContext.Provider value={{ options, updateOptions }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
}