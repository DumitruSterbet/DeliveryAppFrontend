import { useQuery } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";

export const useFetchAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/admin/dashboard",
        method: "GET",
      });
      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};
