import { apiCommand } from "@/lib/helpers";

export const apiCreateProduct = async (productData) => {
  try {
    const response = await apiCommand({
      endpoint: "api/products",
      method: "POST",
      data: productData,
    });
    
    return response;
  } catch (error) {
    console.error("Error in apiCreateProduct:", error);
    throw error;
  }
};

export const apiUpdateProduct = async (productData) => {
  try {
    const response = await apiCommand({
      endpoint: `api/products/${productData.id}`,
      method: "PUT",
      data: productData,
    });
    
    return response;
  } catch (error) {
    console.error("Error in apiUpdateProduct:", error);
    throw error;
  }
};

export const apiDeleteProduct = async (productId) => {
  try {
    const response = await apiCommand({
      endpoint: `api/products/${productId}`,
      method: "DELETE",
    });
    
    return response;
  } catch (error) {
    console.error("Error in apiDeleteProduct:", error);
    throw error;
  }
};