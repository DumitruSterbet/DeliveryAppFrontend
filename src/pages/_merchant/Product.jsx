import { Navigate, useParams } from "react-router-dom";

import { useCurrentUser } from "@/lib/store";
import { Sections } from "@/components";

export default function Product() {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};
  const { id } = useParams();

  // TODO: Replace with actual API call when backend is ready
  // const { data: product, isPending, isSuccess } = useFetchProductById({ id });

  // Mock product data
  const mockProduct = {
    id: id,
    title: "Product Name",
    price: 29.99,
    cover_big: "https://via.placeholder.com/300",
    description: "Detailed product description goes here...",
    stock: 10,
    type: "product",
    category: "Electronics",
    variants: [
      { id: 1, name: "Variant 1", price: 29.99, stock: 5 },
      { id: 2, name: "Variant 2", price: 34.99, stock: 5 },
    ],
  };

  // Mock variants formatted as "tracks"
  const mockVariants = mockProduct.variants.map((variant, index) => ({
    id: variant.id,
    title: variant.name,
    price: variant.price,
    stock: variant.stock,
    duration: null, // Not applicable for products
    rank: index + 1,
  }));

  if (!id) {
    return <Navigate to="/merchant/products" replace />;
  }

  return (
    <section className="product_section">
      {isLoaded && (!user || user.role !== "Merchant") ? (
        <Navigate to="/" replace={true} />
      ) : (
        <>
          <Sections.BannerSection
            details={mockProduct}
            tracks={mockVariants}
            isLoading={false}
            isSuccess={true}
            showPattern
          />

          <div className="relative mt-8">
            <Sections.TrackSection
              data={mockVariants}
              details={{
                id: mockProduct?.id,
                type: "product",
              }}
              disableRowList={["duration", "dateCreated"]}
              skeletonItemNumber={10}
              isLoading={false}
              isSuccess={true}
            />
          </div>
        </>
      )}
    </section>
  );
}
