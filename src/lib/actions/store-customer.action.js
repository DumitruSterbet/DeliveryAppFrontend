import { useQuery } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";

export const useFetchStoreCustomers = () => {
  return useQuery({
    queryKey: ["store-customers"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/store-customers",
        method: "GET",
      });

      return response;
    },
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
};

export const useFetchStoreCustomerDetails = ({ customerId, enabled = true }) => {
  return useQuery({
    queryKey: ["store-customers", customerId],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: `api/store-customers/${customerId}`,
        method: "GET",
      });

      return response;
    },
    enabled: Boolean(customerId) && enabled,
    staleTime: 60 * 1000,
    retry: 2,
  });
};
