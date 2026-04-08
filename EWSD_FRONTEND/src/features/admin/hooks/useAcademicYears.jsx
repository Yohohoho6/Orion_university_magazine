import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AcademicYearService } from "@/api/services/academic-year-service";
import { toast } from "react-toastify";

export const useAcademicYears = (page = 1) => {
  return useQuery({
    queryKey: ["academic-years", page],
    queryFn: () => AcademicYearService.getAcademicYears(page),
  });
};

export const useCreateAcademicYear = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AcademicYearService.createAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      toast.success("Academic year created successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to create academic year";
      toast.error(message);
    },
  });
};

export const useUpdateAcademicYear = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      AcademicYearService.updateAcademicYear(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      toast.success("Academic year updated successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to update academic year";
      toast.error(message);
    },
  });
};

export const useUpdateAcademicYearStatus = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) =>
      AcademicYearService.updateAcademicYearStatus(id, isActive),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      toast.success(data?.message || "Academic year status updated.");
      onSuccess?.();
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Failed to update academic year status";
      toast.error(message);
    },
  });
};
