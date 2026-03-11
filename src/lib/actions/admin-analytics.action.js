import { useQuery } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";

export const useFetchAdminAnalytics = () => {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/admin/analytics",
        method: "GET",
      });
      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};
