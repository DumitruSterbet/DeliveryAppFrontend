import { apiQuery } from "@/lib/helpers";

export const apiCreateOrder = async ({ items }) => {
  try {
    const response = await apiQuery({
      endpoint: 'api/orders',
      method: 'POST',
      config: {
        data: {
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        },
      },
    });
    
    return response;
  } catch (error) {
    console.error("Error in apiCreateOrder:", error);
    throw error;
  }
};