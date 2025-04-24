"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      
      // Initial check
      setMatches(media.matches);
      
      // Add listener for changes
      const listener = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
      };
      
      // Modern browsers
      media.addEventListener("change", listener);
      
      return () => {
        media.removeEventListener("change", listener);
      };
    }
    
    return undefined;
  }, [query]);
  
  return matches;
}