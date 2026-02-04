import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCreateOrder, apiFetchMerchantOrders } from "./order.api.helper";
import { useNotification } from "@/hooks";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: apiCreateOrder,
    onSuccess: (data) => {
      // Invalidate any order-related queries if needed
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      notify({
        title: "Order Created",
        description: "Your order has been created successfully!",
        variant: "success"
      });
    },
    onError: (error) => {
      console.error("Failed to create order:", error);
      
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to create order. Please try again.";
      
      notify({
        title: "Order Failed",
        description: errorMessage,
        variant: "error"
      });
    },
  });
};

export const useFetchMerchantOrders = () => {
  return useQuery({
    queryKey: ['merchant-orders'],
    queryFn: apiFetchMerchantOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};