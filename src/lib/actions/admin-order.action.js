import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";
import { useNotification } from "@/hooks";

export const useFetchAdminOrdersSummary = () => {
  return useQuery({
    queryKey: ["admin-orders", "summary"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/admin/orders/summary",
        method: "GET",
      });
      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export const useFetchAdminOrders = () => {
  return useQuery({
    queryKey: ["admin-orders", "list"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/admin/orders",
        method: "GET",
      });
      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export const useEscalateAdminOrder = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (orderId) => {
      if (!orderId) {
        throw new Error("Order id is required");
      }

      const response = await apiQuery({
        endpoint: `api/admin/orders/${orderId}/escalate`,
        method: "POST",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      notify({
        title: "Order escalated",
        description: "Order was escalated successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Escalation failed",
        description: error?.message || "Could not escalate order.",
        variant: "error",
      });
    },
  });
};

export const useResolveAdminOrder = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (orderId) => {
      if (!orderId) {
        throw new Error("Order id is required");
      }

      const response = await apiQuery({
        endpoint: `api/admin/orders/${orderId}/resolve`,
        method: "POST",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      notify({
        title: "Order resolved",
        description: "Order was resolved successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Resolve failed",
        description: error?.message || "Could not resolve order.",
        variant: "error",
      });
    },
  });
};

export const useCancelAdminOrder = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (orderId) => {
      if (!orderId) {
        throw new Error("Order id is required");
      }

      const response = await apiQuery({
        endpoint: `api/admin/orders/${orderId}/cancel`,
        method: "POST",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      notify({
        title: "Order cancelled",
        description: "Order was cancelled successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Cancel failed",
        description: error?.message || "Could not cancel order.",
        variant: "error",
      });
    },
  });
};

export const useReassignAdminOrder = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async ({ orderId, payload }) => {
      if (!orderId) {
        throw new Error("Order id is required");
      }

      const response = await apiQuery({
        endpoint: `api/admin/orders/${orderId}/reassign`,
        method: "POST",
        config: {
          data: payload || {},
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      notify({
        title: "Order reassigned",
        description: "Order was reassigned successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Reassign failed",
        description: error?.message || "Could not reassign order.",
        variant: "error",
      });
    },
  });
};
