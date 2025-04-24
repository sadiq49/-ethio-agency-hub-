'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type AccessibilityContextType = {
  fontSize: 'normal' | 'large' | 'x-large';
  highContrast: boolean;
  reducedMotion: boolean;
  setFontSize: (size: 'normal' | 'large' | 'x-large') => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'x-large'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Apply classes to body based on settings
  useEffect(() => {
    document.body.classList.toggle('text-large', fontSize === 'large');
    document.body.classList.toggle('text-x-large', fontSize === 'x-large');
    document.body.classList.toggle('high-contrast', highContrast);
    document.body.classList.toggle('reduced-motion', reducedMotion);

    return () => {
      document.body.classList.remove('text-large', 'text-x-large', 'high-contrast', 'reduced-motion');
    };
  }, [fontSize, highContrast, reducedMotion]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        highContrast,
        reducedMotion,
        setFontSize,
        setHighContrast,
        setReducedMotion,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}