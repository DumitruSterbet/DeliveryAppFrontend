import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";
import { useNotification } from "@/hooks";

export const useFetchCourierSchedule = () => {
  return useQuery({
    queryKey: ["courier", "schedule"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/courier/schedule",
        method: "GET",
      });

      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export const useUpdateCourierSchedule = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (scheduleSlots) => {
      try {
        const response = await apiQuery({
          endpoint: "api/courier/schedule",
          method: "PUT",
          config: {
            data: {
              slots: scheduleSlots,
            },
          },
        });

        return response;
      } catch (error) {
        const statusCode = error?.response?.status;

        if ([404, 405].includes(statusCode)) {
          const response = await apiQuery({
            endpoint: "api/courier/schedule",
            method: "POST",
            config: {
              data: {
                slots: scheduleSlots,
              },
            },
          });

          return response;
        }

        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courier", "schedule"] });
      notify({
        title: "Schedule updated",
        description: "Your working schedule has been saved.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Update failed",
        description: error?.response?.data?.message || error?.message || "Unable to save schedule.",
        variant: "error",
      });
    },
  });
};
