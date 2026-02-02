import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentUser } from "@/lib/store";
import { useNotification } from "@/hooks";
import { apiQuery } from "@/lib/helpers";

// TODO: Replace these with actual API calls when backend is ready
const apiCreateProduct = async ({ name, description, price, stock, imageFile, category }) => {
  // Mock API call
  // In production, you would upload the image first and get the URL
  // const imageUrl = imageFile ? await uploadImage(imageFile) : null;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id: Date.now(),
          name,
          description,
          price,
          stock,
          imageUrl: imageFile ? URL.createObjectURL(imageFile) : "https://via.placeholder.com/300",
          category,
        }
      });
    }, 1000);
  });
};

export const useCreateProduct = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const navigate = useNavigate();
  const [notify] = useNotification();

  const queryClient = useQueryClient();

  const { mutate: createProduct, isPending: isCreating } = useMutation({
    mutationFn: async (productData) => {
      if (userId) {
        try {
          const response = await apiCreateProduct(productData);
          
          notify({
            title: "Success",
            variant: "success",
            description: "Product created successfully",
          });

          // Navigate to the product detail page
          navigate(`/merchant/products/${response.data.id}`);
          
          return response;
        } catch (error) {
          notify({
            title: "Error",
            variant: "error",
            description: error?.response?.data?.message || "Failed to create product",
          });
          throw error;
        }
      } else {
        throw new Error("User not authenticated");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchantProducts"] });
    },
  });

  return {
    createProduct,
    isCreating,
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