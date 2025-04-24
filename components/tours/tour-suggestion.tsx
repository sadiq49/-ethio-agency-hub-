"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { HelpCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TourSuggestionProps {
  tourName: string;
  onStart: () => void;
  onDismiss: () => void;
}

export function TourSuggestion({
  tourName,
  onStart,
  onDismiss,
}: TourSuggestionProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation to complete
  };

  const formatTourName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm bg-card border rounded-lg shadow-lg p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">New to this page?</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Would you like a quick tour of the {formatTourName(tourName)} page to
            learn about its features?
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleDismiss}>
              Skip
            </Button>
            <Button size="sm" onClick={onStart}>
              Start Tour
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}