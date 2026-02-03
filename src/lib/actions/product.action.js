import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentUser } from "@/lib/store";
import { useNotification } from "@/hooks";
import { apiQuery } from "@/lib/helpers";

const apiCreateProduct = async ({ name, description, price, imageUrl, storeId, categoryIds }) => {
  // Call the real API endpoint
  const response = await apiQuery({
    endpoint: 'api/products',
    method: 'POST',
    config: {
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        storeId,
        categoryIds: categoryIds || [],
      },
    },
  });
  
  return response;
};

const apiUpdateProduct = async ({ id, name, description, price, imageUrl, storeId, categoryIds }) => {
  // Call the real API endpoint for updating
  const response = await apiQuery({
    endpoint: `api/products/${id}`,
    method: 'PUT',
    config: {
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        storeId,
        categoryIds: categoryIds || [],
      },
    },
  });
  
  return response;
};

const apiDeleteProduct = async (productId) => {
  // Call the real API endpoint for deleting
  const response = await apiQuery({
    endpoint: `api/products/${productId}`,
    method: 'DELETE',
  });
  
  return response;
};

export const useCreateProduct = () => {
  const { currentUser } = useCurrentUser();
  const { userId, user } = currentUser || {};

  const navigate = useNavigate();
  const [notify] = useNotification();

  const queryClient = useQueryClient();

  const { mutate: createProduct, isPending: isCreating } = useMutation({
    mutationFn: async (productData) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      try {
        // Get storeId from user or fetch it
        // For now, assuming userId can be used as storeId
        const storeId = userId;
        
        // TODO: Upload image if imageFile exists, for now use placeholder
        const imageUrl = productData.imageFile 
          ? "https://via.placeholder.com/300" 
          : null;

        // Use categoryIds array from productData
        const categoryIds = productData.categoryIds || [];

        const response = await apiCreateProduct({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          imageUrl,
          storeId,
          categoryIds,
        });
        
        notify({
          title: "Success",
          variant: "success",
          description: "Product created successfully",
        });

        // Refresh the products list
        queryClient.invalidateQueries({ queryKey: ["merchantProducts"] });
        
        return response;
      } catch (error) {
        notify({
          title: "Error",
          variant: "error",
          description: error?.message || "Failed to create product",
        });
        throw error;
      }
    },
  });

  return {
    createProduct,
    isCreating,
  };
};

export const useUpdateProduct = () => {
  const { currentUser } = useCurrentUser();
  const { userId, user } = currentUser || {};

  const navigate = useNavigate();
  const [notify] = useNotification();

  const queryClient = useQueryClient();

  const { mutate: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: async (productData) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      try {
        // Get storeId from user or fetch it
        const storeId = userId;
        
        // TODO: Upload image if imageFile exists, for now use existing or placeholder
        const imageUrl = productData.imageFile 
          ? "https://via.placeholder.com/300" 
          : productData.currentImageUrl || null;

        // Use categoryIds array from productData
        const categoryIds = productData.categoryIds || [];

        const response = await apiUpdateProduct({
          id: productData.id,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          imageUrl,
          storeId,
          categoryIds,
        });
        
        notify({
          title: "Success",
          variant: "success",
          description: "Product updated successfully",
        });

        // Refresh the products list
        queryClient.invalidateQueries({ queryKey: ["merchantProducts"] });
        
        return response;
      } catch (error) {
        notify({
          title: "Error",
          variant: "error",
          description: error?.message || "Failed to update product",
        });
        throw error;
      }
    },
  });

  return {
    updateProduct,
    isUpdating,
  };
};

export const useDeleteProduct = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const [notify] = useNotification();
  const queryClient = useQueryClient();

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: async (productId) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      try {
        const response = await apiDeleteProduct(productId);
        
        notify({
          title: "Success",
          variant: "success",
          description: "Product deleted successfully",
        });

        // Refresh the products list
        queryClient.invalidateQueries({ queryKey: ["merchantProducts"] });
        
        return response;
      } catch (error) {
        notify({
          title: "Error",
          variant: "error",
          description: error?.message || "Failed to delete product",
        });
        throw error;
      }
    },
  });

  return {
    deleteProduct,
    isDeleting,
  };
};

export const useFetchMerchantProducts = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: ["merchantProducts", { userId }],
    queryFn: async () => {
      if (userId) {
        try {
          const response = await apiQuery({
            endpoint: `api/stores/merchant/${userId}/menu`,
          });
          console.log("Merchant products response:", response);
          // Response structure: { id, name, imageUrl, products: [...] }
          // apiQuery already extracts the Data field
          return response;
        } catch (error) {
          console.error("Error fetching merchant products:", error);
          // Return empty structure instead of null to avoid errors
          return { id: null, name: "", imageUrl: "", products: [] };
        }
      } else {
        console.log("No userId available for fetching merchant products");
        return { id: null, name: "", imageUrl: "", products: [] };
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useFetchProductsByStore = ({ storeId }) => {
  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: [`storeProducts_${storeId}`, { storeId }],
    queryFn: async () => {
      try {
        if (storeId) {
          const response = await apiQuery({
            endpoint: `api/stores/${storeId}/menu`,
          });
          return response;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error fetching store products:", error);
        return null;
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};