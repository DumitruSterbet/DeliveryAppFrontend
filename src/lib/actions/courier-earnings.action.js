import { useQuery } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";

export const useFetchCourierEarnings = () => {
  return useQuery({
    queryKey: ["courier", "earnings"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/courier/earnings",
        method: "GET",
      });

      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};
