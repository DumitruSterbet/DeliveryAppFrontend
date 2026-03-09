import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";
import { useNotification } from "@/hooks";

export const useFetchPayoutSummary = () => {
  return useQuery({
    queryKey: ["payouts", "summary"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/payouts/summary",
        method: "GET",
      });

      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export const useFetchPayoutHistory = () => {
  return useQuery({
    queryKey: ["payouts", "history"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/payouts/history",
        method: "GET",
      });

      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export const useRequestPayout = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async ({ amount, note }) => {
      const numericAmount = Number(amount);

      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const response = await apiQuery({
        endpoint: "api/payouts/request",
        method: "POST",
        config: {
          data: {
            amount: numericAmount,
            note: note || "Payout request from merchant dashboard",
          },
        },
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
      notify({
        title: "Payout requested",
        description: "Your payout request was submitted successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Request failed",
        description: error?.message || "Unable to submit payout request.",
        variant: "error",
      });
    },
  });
};
