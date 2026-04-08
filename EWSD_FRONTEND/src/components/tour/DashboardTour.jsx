import { useEffect } from "react";
import { useJoyride } from "react-joyride";
import { useAuth } from "@/context/AuthContext";
import { UserService } from "@/api/services/user-service";
import { useQueryClient } from "@tanstack/react-query";

const TOUR_STORAGE_KEY = "is_new_user";
const BRAND_COLOR = "#4F46E5";

const CustomBeacon = () => (
  <span
    style={{
      display: "inline-block",
      width: "14px",
      height: "14px",
      borderRadius: "50%",
      background: "var(--beacon-color)",
      boxShadow: `0 0 0 4px color-mix(in srgb, var(--beacon-color) 20%, transparent), 0 0 0 8px color-mix(in srgb, var(--beacon-color) 10%, transparent)`,
    }}
  />
);

const getTourSteps = (roleName) => {
  const steps = [
    {
      target: '[data-tour="sidebar-nav"]',
      content: "Use the sidebar to navigate between different sections of the dashboard.",
      disableBeacon: true,
      placement: "right",
    },
    {
      target: '[data-tour="theme-toggle"]',
      content: "Toggle between light and dark mode to suit your preference.",
      placement: "left",
    },
    {
      target: '[data-tour="profile-menu"]',
      content: "Click your avatar to view your profile or sign out.",
      placement: "left",
    },
  ];

  if (roleName === "student" || roleName === "marketing_coordinator") {
    steps.splice(2, 0, {
      target: '[data-tour="notification-button"]',
      content: "View your notifications and stay updated on your submissions.",
      placement: "left",
    });
  }

  return steps;
};

export function DashboardTour() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const roleName = user?.role?.name;
  const isNewUser = localStorage.getItem(TOUR_STORAGE_KEY) === "true";
  const allowedRoles = ["student", "guest"];
  const shouldShowTour = isNewUser && allowedRoles.includes(roleName);

  const allSteps = getTourSteps(roleName);

  // Filter to only show steps with visible targets
  const renderableSteps = allSteps.filter((step) => {
    if (!step?.target) return false;
    return Boolean(document.querySelector(step.target));
  });

  const { controls, Tour, on } = useJoyride({
    steps: renderableSteps,
    continuous: true,
    showProgress: true,
    showSkipButton: true,
    disableScrolling: true,
    beaconComponent: CustomBeacon,
    styles: {
      options: {
        primaryColor: BRAND_COLOR,
        zIndex: 10000,
      },
      tooltip: {
        borderRadius: "12px",
      },
      buttonNext: {
        borderRadius: "8px",
      },
      buttonBack: {
        borderRadius: "8px",
      },
      buttonSkip: {
        borderRadius: "8px",
      },
    },
    locale: {
      back: "Back",
      next: "Next",
      skip: "Skip",
      last: "Finish",
    },
  });

  // Handle tour end event
  useEffect(() => {
    return on("tour:end", async () => {
    //   console.log("[DashboardTour] Tour ended, marking as complete");
      
      // Stop the tour immediately
      controls.stop();
      
      // Update localStorage
      localStorage.setItem(TOUR_STORAGE_KEY, "false");

      // Call backend to persist
      try {
        await UserService.completeTour();
        // console.log("[DashboardTour] Tour marked as complete on backend");
        // Invalidate query only after successful API call
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      } catch (error) {
        console.error("[DashboardTour] Failed to mark tour complete on backend:", error?.response?.data);
      }
    });
  }, [on, controls, queryClient]);

  // Start tour when conditions are met
  useEffect(() => {
    if (!shouldShowTour) {
    //   console.log("[DashboardTour] Tour conditions not met - stopping");
      controls.stop();
      return;
    }

    if (renderableSteps.length === 0) {
    //   console.log("[DashboardTour] No renderable steps found - waiting");
      return;
    }

    // console.log("[DashboardTour] Starting tour");
    const timer = setTimeout(() => {
      controls.start();
    }, 800);

    return () => clearTimeout(timer);
  }, [shouldShowTour, renderableSteps.length, controls]);

  if (!shouldShowTour || renderableSteps.length === 0) {
    return null;
  }

  return Tour;
}