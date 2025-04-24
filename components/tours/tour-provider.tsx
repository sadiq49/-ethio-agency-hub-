"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { TourSuggestion } from "./tour-suggestion";

type TourContextType = {
  startTour: (tourId: string) => void;
  endTour: () => void;
  isActive: boolean;
  currentTour: string | null;
  resetTourHistory: () => void;
};

const TourContext = createContext<TourContextType | undefined>(undefined);

// Define tours
const tours: Record<string, Step[]> = {
  dashboard: [
    {
      target: ".dashboard-overview",
      content: "This is your main dashboard where you can see an overview of all activities.",
      disableBeacon: true,
    },
    {
      target: ".dashboard-stats",
      content: "Here you can see key statistics about workers, documents, and travel arrangements.",
    },
    {
      target: ".dashboard-actions",
      content: "Quick actions allow you to perform common tasks with a single click.",
    },
  ],
  workers: [
    {
      target: ".workers-list",
      content: "This is the list of all workers registered in the system.",
      disableBeacon: true,
    },
    {
      target: ".workers-filter",
      content: "Use these filters to find specific workers based on status, destination, or other criteria.",
    },
    {
      target: ".workers-actions",
      content: "From here you can register new workers or perform bulk actions.",
    },
  ],
  documents: [
    {
      target: ".documents-tabs",
      content: "Switch between different document types using these tabs.",
      disableBeacon: true,
    },
    {
      target: ".documents-upload",
      content: "Upload new documents for workers here.",
    },
    {
      target: ".documents-status",
      content: "Track the status of document processing in real-time.",
    },
  ],
  travel: [
    {
      target: ".travel-calendar",
      content: "View upcoming travel arrangements on this calendar.",
      disableBeacon: true,
    },
    {
      target: ".travel-booking",
      content: "Book new tickets and manage existing bookings here.",
    },
    {
      target: ".today-flying",
      content: "See which workers are departing today for quick reference.",
    },
  ],
  // New tours
  agents: [
    {
      target: ".agents-list",
      content: "This is the list of all foreign agents you work with.",
      disableBeacon: true,
    },
    {
      target: ".agents-filter",
      content: "Filter agents by country, status, or performance metrics.",
    },
    {
      target: ".agents-actions",
      content: "Add new agents or manage existing relationships from here.",
    },
  ],
  hajj: [
    {
      target: ".hajj-calendar",
      content: "View upcoming Hajj and Umrah pilgrimages on this calendar.",
      disableBeacon: true,
    },
    {
      target: ".hajj-groups",
      content: "Manage pilgrim groups and their travel arrangements.",
    },
    {
      target: ".hajj-visa",
      content: "Track special visa applications for religious pilgrimages.",
    },
  ],
  settings: [
    {
      target: ".settings-profile",
      content: "Update your profile information and preferences.",
      disableBeacon: true,
    },
    {
      target: ".settings-notifications",
      content: "Configure how and when you receive notifications.",
    },
    {
      target: ".settings-security",
      content: "Manage security settings like two-factor authentication.",
    },
    {
      target: ".settings-team",
      content: "Manage team members and their access permissions.",
    },
  ],
};

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [currentTour, setCurrentTour] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestedTour, setSuggestedTour] = useState<string | null>(null);
  const pathname = usePathname();

  // Check if user has seen tours before
  useEffect(() => {
    const checkFirstTimeUser = () => {
      if (typeof window === "undefined") return;
      
      const viewedTours = localStorage.getItem("viewed-tours");
      const parsedTours = viewedTours ? JSON.parse(viewedTours) : {};
      
      // If this is a first-time visit to a page with a tour, suggest the tour
      const currentPage = pathname?.split("/")[1] || "dashboard";
      if (tours[currentPage] && !parsedTours[currentPage]) {
        setSuggestedTour(currentPage);
        setShowSuggestion(true);
        
        // Mark this tour as viewed
        parsedTours[currentPage] = true;
        localStorage.setItem("viewed-tours", JSON.stringify(parsedTours));
      }
    };
    
    // Small delay to ensure the page is fully loaded
    const timer = setTimeout(checkFirstTimeUser, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  const startTour = (tourId: string) => {
    if (tours[tourId]) {
      setCurrentTour(tourId);
      setSteps(tours[tourId]);
      setRun(true);
      setShowSuggestion(false);
    }
  };

  const endTour = () => {
    setRun(false);
    setCurrentTour(null);
  };

  const resetTourHistory = () => {
    localStorage.removeItem("viewed-tours");
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      endTour();
    }
  };

  return (
    <TourContext.Provider
      value={{
        startTour,
        endTour,
        isActive: run,
        currentTour,
        resetTourHistory,
      }}
    >
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            primaryColor: "var(--primary)",
            zIndex: 10000,
          },
          tooltip: {
            fontSize: "14px",
            padding: "16px",
          },
          buttonNext: {
            fontSize: "14px",
            padding: "8px 16px",
          },
          buttonBack: {
            fontSize: "14px",
            padding: "8px 16px",
            marginRight: "8px",
          },
          buttonSkip: {
            fontSize: "14px",
            padding: "8px 16px",
          },
        }}
        callback={handleJoyrideCallback}
        disableScrolling
        disableOverlayClose
      />
      
      {showSuggestion && suggestedTour && (
        <TourSuggestion
          tourName={suggestedTour}
          onStart={() => startTour(suggestedTour)}
          onDismiss={() => setShowSuggestion(false)}
        />
      )}
      
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;