import { useQuery } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";

export const useFetchCourierDeliveries = () => {
  return useQuery({
    queryKey: ["courier", "deliveries"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/courier/deliveries",
        method: "GET",
      });

      return response;
    },
    staleTime: 30 * 1000,
    retry: 2,
  });
};

export const useFetchCourierDeliveryDetails = ({ deliveryId, enabled = true }) => {
  return useQuery({
    queryKey: ["courier", "deliveries", deliveryId],
    enabled: enabled && Boolean(deliveryId),
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: `api/courier/deliveries/${deliveryId}`,
        method: "GET",
      });

      return response;
    },
    staleTime: 30 * 1000,
    retry: 2,
  });
};
