import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";
import { useNotification } from "@/hooks";

export const useFetchInventory = () => {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/inventory",
        method: "GET",
      });

      return response;
    },
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
};

export const useFetchLowStockInventory = () => {
  return useQuery({
    queryKey: ["inventory", "low-stock"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/inventory/low-stock",
        method: "GET",
      });

      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export const useAdjustInventory = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async ({ productId, amount, reason }) => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount === 0) {
        throw new Error("Adjustment amount must be a non-zero number");
      }

      const payload = {
        adjustment: numericAmount,
        quantityChange: numericAmount,
        reason: reason || "Manual adjustment",
      };

      const response = await apiQuery({
        endpoint: `api/inventory/${productId}/adjust`,
        method: "POST",
        config: {
          data: payload,
        },
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      notify({
        title: "Inventory updated",
        description: "Stock adjustment applied successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Update failed",
        description: error?.message || "Could not adjust inventory.",
        variant: "error",
      });
    },
  });
};

export const useUpdateInventoryThreshold = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async ({ productId, threshold }) => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const numericThreshold = Number(threshold);
      if (!Number.isFinite(numericThreshold) || numericThreshold < 0) {
        throw new Error("Threshold must be a non-negative number");
      }

      const response = await apiQuery({
        endpoint: `api/inventory/${productId}/threshold`,
        method: "PUT",
        config: {
          data: {
            threshold: numericThreshold,
          },
        },
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      notify({
        title: "Threshold updated",
        description: "Low stock threshold was saved.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Update failed",
        description: error?.message || "Could not update threshold.",
        variant: "error",
      });
    },
  });
};
