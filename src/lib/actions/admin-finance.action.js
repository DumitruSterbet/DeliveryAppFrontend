import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";
import { useNotification } from "@/hooks";

export const useFetchAdminFinanceSummary = () => {
  return useQuery({
    queryKey: ["admin-finance", "summary"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/admin/finance/summary",
        method: "GET",
      });
      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export const useFetchAdminFinancePayouts = () => {
  return useQuery({
    queryKey: ["admin-finance", "payouts"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/admin/finance/payouts",
        method: "GET",
      });
      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export const useApproveAdminPayout = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (payoutId) => {
      if (!payoutId) {
        throw new Error("Payout id is required");
      }

      const response = await apiQuery({
        endpoint: `api/admin/finance/payouts/${payoutId}/approve`,
        method: "POST",
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-finance"] });
      notify({
        title: "Payout approved",
        description: "Payout request approved successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Approve failed",
        description: error?.message || "Could not approve payout.",
        variant: "error",
      });
    },
  });
};

export const useRejectAdminPayout = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (payoutId) => {
      if (!payoutId) {
        throw new Error("Payout id is required");
      }

      const response = await apiQuery({
        endpoint: `api/admin/finance/payouts/${payoutId}/reject`,
        method: "POST",
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-finance"] });
      notify({
        title: "Payout rejected",
        description: "Payout request rejected successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Reject failed",
        description: error?.message || "Could not reject payout.",
        variant: "error",
      });
    },
  });
};

export const useRetryAdminPayout = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (payoutId) => {
      if (!payoutId) {
        throw new Error("Payout id is required");
      }

      const response = await apiQuery({
        endpoint: `api/admin/finance/payouts/${payoutId}/retry`,
        method: "POST",
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-finance"] });
      notify({
        title: "Retry triggered",
        description: "Payout retry was submitted successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Retry failed",
        description: error?.message || "Could not retry payout.",
        variant: "error",
      });
    },
  });
};
