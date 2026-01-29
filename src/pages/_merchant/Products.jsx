import { useMemo } from "react";
import { Navigate } from "react-router-dom";

import { useCurrentUser } from "@/lib/store";
import { IconButton, Sections } from "@/components";

export default function Products() {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  // TODO: Replace with actual API call when backend is ready
  // const { data: products, isPending, isSuccess } = useFetchMerchantProducts();
  
  // Mock data for now
  const mockProducts = [
    {
      id: 1,
      title: "Premium Wireless Headphones",
      price: 129.99,
      image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      description: "High-quality wireless headphones with noise cancellation",
      stock: 25,
      created_at: "2026-01-15",
      category: "Electronics",
    },
    {
      id: 2,
      title: "Ergonomic Office Chair",
      price: 249.99,
      image_url: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=300&h=300&fit=crop",
      description: "Comfortable office chair with lumbar support",
      stock: 12,
      created_at: "2026-01-20",
      category: "Furniture",
    },
    {
      id: 3,
      title: "Smart Watch Pro",
      price: 299.99,
      image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      description: "Advanced fitness tracking and notifications",
      stock: 8,
      created_at: "2026-01-22",
      category: "Electronics",
    },
    {
      id: 4,
      title: "Mechanical Keyboard RGB",
      price: 89.99,
      image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop",
      description: "Customizable RGB mechanical keyboard",
      stock: 30,
      created_at: "2026-01-18",
      category: "Electronics",
    },
    {
      id: 5,
      title: "Leather Laptop Bag",
      price: 79.99,
      image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      description: "Premium leather bag for 15-inch laptops",
      stock: 15,
      created_at: "2026-01-10",
      category: "Accessories",
    },
    {
      id: 6,
      title: "4K Webcam",
      price: 149.99,
      image_url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=300&h=300&fit=crop",
      description: "Crystal clear 4K video for streaming and meetings",
      stock: 18,
      created_at: "2026-01-25",
      category: "Electronics",
    },
    {
      id: 7,
      title: "Wireless Mouse",
      price: 39.99,
      image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
      description: "Ergonomic wireless mouse with precision tracking",
      stock: 45,
      created_at: "2026-01-12",
      category: "Electronics",
    },
    {
      id: 8,
      title: "Portable SSD 1TB",
      price: 119.99,
      image_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=300&fit=crop",
      description: "Fast and reliable portable storage solution",
      stock: 20,
      created_at: "2026-01-28",
      category: "Electronics",
    },
    {
      id: 9,
      title: "Standing Desk Converter",
      price: 199.99,
      image_url: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=300&h=300&fit=crop",
      description: "Adjustable height desk converter for better posture",
      stock: 10,
      created_at: "2026-01-08",
      category: "Furniture",
    },
    {
      id: 10,
      title: "USB-C Hub 7-in-1",
      price: 49.99,
      image_url: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop",
      description: "Expand your laptop connectivity with 7 ports",
      stock: 35,
      created_at: "2026-01-05",
      category: "Accessories",
    },
    {
      id: 11,
      title: "Wireless Charger Pad",
      price: 29.99,
      image_url: "https://images.unsplash.com/photo-1591290619762-d118d7a12a8d?w=300&h=300&fit=crop",
      description: "Fast wireless charging for Qi-enabled devices",
      stock: 50,
      created_at: "2026-01-14",
      category: "Accessories",
    },
    {
      id: 12,
      title: "Noise Cancelling Earbuds",
      price: 159.99,
      image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
      description: "Premium sound quality with active noise cancellation",
      stock: 22,
      created_at: "2026-01-26",
      category: "Electronics",
    },
  ];

  const products = useMemo(() => {
    // Format products similar to how playlists are formatted
    if (mockProducts && mockProducts.length) {
      return mockProducts.map((product) => {
        const { image_url, created_at, description, stock } = product;
        return {
          ...product,
          cover_big: image_url,
          type: "product",
          release_date: created_at,
          desc: description,
          track_total: stock, // Using track_total field to display stock
        };
      });
    }
    return null;
  }, []);

  const handleCreateProduct = () => {
    // TODO: Implement create product logic
    console.log("Create new product");
  };

  return (
    <section className="products_page">
      {isLoaded && (
        <>
          {!user || user.role !== "Merchant" ? (
            <Navigate to="/" replace={true} />
          ) : (
            <Sections.MediaSectionMinified
              data={products}
              title="My Products"
              subTitle="Manage your product inventory and listings."
              titleType="large"
              type="product"
              gridNumber={3}
              imageDims={28}
              isMyPlaylist={false}
              CreatePlaylistComp={() => (
                <li className="col-span-1">
                  <div className="h-full add_product">
                    <div className="flex-col w-full h-full gap-2 p-4 border border-dashed rounded border-secondary flex_justify_center text-onNeutralBg">
                      <IconButton
                        name="MdAdd"
                        className="w-12 h-12 rounded-full shadow-lg bg-primary flex_justify_center"
                        iconClassName="!text-white"
                        size="30"
                        onClick={handleCreateProduct}
                      />
                      <p className="text-sm font-semibold tracking-wider">
                        Add Product
                      </p>
                    </div>
                  </div>
                </li>
              )}
              isLoading={false}
              isSuccess={true}
              noDataText="No products yet. Add your first product to get started!"
            />
          )}
        </>
      )}
    </section>
  );
}
