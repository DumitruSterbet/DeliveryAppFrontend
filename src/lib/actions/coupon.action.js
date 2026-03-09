import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";
import { useNotification } from "@/hooks";

export const useFetchCoupons = () => {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/coupons",
        method: "GET",
      });
      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiQuery({
        endpoint: "api/coupons",
        method: "POST",
        config: {
          data: payload,
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      notify({
        title: "Coupon created",
        description: "New coupon was added successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Create failed",
        description: error?.message || "Could not create coupon.",
        variant: "error",
      });
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async ({ couponId, payload }) => {
      if (!couponId) {
        throw new Error("Coupon id is required");
      }

      const response = await apiQuery({
        endpoint: `api/coupons/${couponId}`,
        method: "PUT",
        config: {
          data: payload,
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      notify({
        title: "Coupon updated",
        description: "Coupon changes were saved.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Update failed",
        description: error?.message || "Could not update coupon.",
        variant: "error",
      });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (couponId) => {
      if (!couponId) {
        throw new Error("Coupon id is required");
      }

      const response = await apiQuery({
        endpoint: `api/coupons/${couponId}`,
        method: "DELETE",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      notify({
        title: "Coupon deleted",
        description: "Coupon was removed.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Delete failed",
        description: error?.message || "Could not delete coupon.",
        variant: "error",
      });
    },
  });
};

export const useToggleCoupon = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (couponId) => {
      if (!couponId) {
        throw new Error("Coupon id is required");
      }

      const response = await apiQuery({
        endpoint: `api/coupons/${couponId}/toggle`,
        method: "PATCH",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      notify({
        title: "Coupon status updated",
        description: "Coupon active state changed.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Toggle failed",
        description: error?.message || "Could not change coupon status.",
        variant: "error",
      });
    },
  });
};
