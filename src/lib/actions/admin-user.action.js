import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQuery } from "@/lib/helpers";
import { useNotification } from "@/hooks";

export const useFetchAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: "api/admin/users",
        method: "GET",
      });
      return response;
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiQuery({
        endpoint: "api/admin/users",
        method: "POST",
        config: {
          data: payload,
        },
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      notify({
        title: "User created",
        description: "New user account was created successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Create failed",
        description: error?.message || "Could not create user.",
        variant: "error",
      });
    },
  });
};

export const useFetchAdminUserDetails = ({ userId, enabled = true }) => {
  return useQuery({
    queryKey: ["admin-user", userId],
    queryFn: async () => {
      const response = await apiQuery({
        endpoint: `api/admin/users/${userId}`,
        method: "GET",
      });
      return response;
    },
    enabled: Boolean(userId) && enabled,
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (userId) => {
      if (!userId) {
        throw new Error("User id is required");
      }

      const response = await apiQuery({
        endpoint: `api/admin/users/${userId}`,
        method: "DELETE",
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      notify({
        title: "User deleted",
        description: "User account was deleted.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Delete failed",
        description: error?.message || "Could not delete user.",
        variant: "error",
      });
    },
  });
};

export const useUpdateAdminUserRole = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async ({ userId, role }) => {
      if (!userId) {
        throw new Error("User id is required");
      }

      if (!role) {
        throw new Error("Role is required");
      }

      const response = await apiQuery({
        endpoint: `api/admin/users/${userId}/role`,
        method: "PATCH",
        config: {
          data: { role },
        },
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user"] });
      notify({
        title: "Role updated",
        description: "User role was changed successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Update failed",
        description: error?.message || "Could not update role.",
        variant: "error",
      });
    },
  });
};

export const useToggleAdminUserLock = () => {
  const queryClient = useQueryClient();
  const [notify] = useNotification();

  return useMutation({
    mutationFn: async (userId) => {
      if (!userId) {
        throw new Error("User id is required");
      }

      const response = await apiQuery({
        endpoint: `api/admin/users/${userId}/toggle-lock`,
        method: "PATCH",
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user"] });
      notify({
        title: "Account status changed",
        description: "User lock status was updated.",
        variant: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Toggle failed",
        description: error?.message || "Could not update lock status.",
        variant: "error",
      });
    },
  });
};