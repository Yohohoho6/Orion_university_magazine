import { axiosInstance } from "@/api/axios-instance";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { useCallback } from "react";

export const useTrackPageView = (pageName) => {
  const hasTracked = useRef(false);
  
  const mutation = useMutation({
    mutationFn: async () => {
      // Prevent multiple tracking in the same session
      if (hasTracked.current) {
        console.log(`Already tracked ${pageName}, skipping`);
        return null;
      }
      
      // Mark as tracked immediately to prevent double calls
      hasTracked.current = true;
      console.log(`Tracking page view for ${pageName}`);
      
      try {
        const response = await axiosInstance.post("/track-view", { page_name: pageName });
        return response;
      } catch (error) {
        // If error, allow retry
        hasTracked.current = false;
        throw error;
      }
    },
    onError: (error) => {
      console.error(`Failed to track page view for ${pageName}:`, error.response?.data || error.message);
    },
  });

  // Use useCallback to provide stable mutate function
  const trackPage = useCallback(() => {
    mutation.mutate();
  }, [mutation]);

  return { mutate: trackPage, ...mutation };
};
