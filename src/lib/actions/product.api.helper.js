import { apiQuery } from "@/lib/helpers";

export const apiCreateProduct = async ({ name, description, price, imageUrl, storeId, categoryIds }) => {
  try {
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
  } catch (error) {
    console.error("Error in apiCreateProduct:", error);
    throw error;
  }
};

export const apiUpdateProduct = async ({ id, name, description, price, imageUrl, storeId, categoryIds }) => {
  try {
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
  } catch (error) {
    console.error("Error in apiUpdateProduct:", error);
    throw error;
  }
};

export const apiDeleteProduct = async (productId) => {
  try {
    const response = await apiQuery({
      endpoint: `api/products/${productId}`,
      method: 'DELETE',
    });
    
    return response;
  } catch (error) {
    console.error("Error in apiDeleteProduct:", error);
    throw error;
  }
};