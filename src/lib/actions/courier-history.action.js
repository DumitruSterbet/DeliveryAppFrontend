import { useQuery } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";

export const useFetchCourierHistory = () => {
  return useQuery({
    queryKey: ["courier", "history"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/courier/history",
        method: "GET",
      });

      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};
