import { useEffect, useState } from 'react';

// Interface for accessibility preferences
export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

// Default preferences
const defaultPreferences: AccessibilityPreferences = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReader: false,
};

// Hook to manage accessibility preferences
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem('accessibility-preferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
      
      // Check for system preferences
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setPreferences(prev => ({ ...prev, reducedMotion: true }));
      }
      
      if (window.matchMedia('(prefers-contrast: more)').matches) {
        setPreferences(prev => ({ ...prev, highContrast: true }));
      }
    } catch (error) {
      console.error('Failed to load accessibility preferences:', error);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
      
      // Apply preferences to document
      document.documentElement.classList.toggle('high-contrast', preferences.highContrast);
      document.documentElement.classList.toggle('large-text', preferences.largeText);
      document.documentElement.classList.toggle('reduced-motion', preferences.reducedMotion);
      document.documentElement.classList.toggle('screen-reader', preferences.screenReader);
      
      // Set meta tags for accessibility
      if (preferences.reducedMotion) {
        document.head.querySelector('meta[name="prefers-reduced-motion"]')?.remove();
        const meta = document.createElement('meta');
        meta.name = 'prefers-reduced-motion';
        meta.content = 'reduce';
        document.head.appendChild(meta);
      }
    } catch (error) {
      console.error('Failed to save accessibility preferences:', error);
    }
  }, [preferences]);

  // Update a single preference
  const updatePreference = (key: keyof AccessibilityPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return {
    preferences,
    updatePreference,
    resetToDefaults: () => setPreferences(defaultPreferences),
  };
}

// Accessibility audit function
export function runAccessibilityAudit(element: HTMLElement): string[] {
  const issues: string[] = [];
  
  // Check for images without alt text
  const imagesWithoutAlt = element.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    issues.push(`Found ${imagesWithoutAlt.length} images without alt text`);
  }
  
  // Check for buttons without accessible names
  const buttonsWithoutName = element.querySelectorAll('button:not([aria-label]):not(:has(*))');
  if (buttonsWithoutName.length > 0) {
    issues.push(`Found ${buttonsWithoutName.length} buttons without accessible names`);
  }
  
  // Check for proper heading hierarchy
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  for (const heading of headings) {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > previousLevel + 1) {
      issues.push(`Heading hierarchy skipped from h${previousLevel} to h${level}`);
    }
    previousLevel = level;
  }
  
  // Check for sufficient color contrast (simplified)
  const lowContrastElements = element.querySelectorAll('[style*="color"]');
  // In a real implementation, you would analyze the contrast ratio
  
  // Check for keyboard accessibility
  const interactiveElements = element.querySelectorAll('a, button, input, select, textarea');
  for (const el of interactiveElements) {
    if (el.getAttribute('tabindex') === '-1' && !el.hasAttribute('aria-hidden')) {
      issues.push(`Interactive element with tabindex="-1" but not aria-hidden`);
    }
  }
  
  return issues;
}