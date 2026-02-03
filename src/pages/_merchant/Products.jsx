import { useMemo, lazy, useCallback } from "react";
import { Navigate } from "react-router-dom";

import { useCurrentUser, useAppModal } from "@/lib/store";
import { useFetchMerchantProducts } from "@/lib/actions";
import { useFetchCategories } from "@/lib/actions/editorial.action";
import { IconButton, Sections } from "@/components";

// Lazy load the modals to reduce initial bundle size
const AddProductModal = lazy(() => import("@/components/modals/AddProductModal"));
const EditProductModal = lazy(() => import("@/components/modals/EditProductModal"));

export default function Products() {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};
  const { open: openModal, getModalContent } = useAppModal();

  // Fetch products from backend
  const { data: apiResponse, isPending, isSuccess } = useFetchMerchantProducts();
  
  // Fetch categories to map IDs to names
  const { data: categories = [] } = useFetchCategories();
  
  // Create a lookup map for category names
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach(cat => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  const products = useMemo(() => {
    // Extract products array from the response
    // Response structure: { id, name, imageUrl, products: [...] }
    const productsArray = apiResponse?.products;
    
    if (productsArray && Array.isArray(productsArray) && productsArray.length > 0) {
      return productsArray.map((product) => {
        const { imageUrl, createdAt, description, name, price, id, categoryIds } = product;
        
        // Map category IDs to names
        const categoryNames = categoryIds && categoryIds.length > 0
          ? categoryIds.map(catId => categoryMap[catId] || 'Unknown').filter(Boolean)
          : [];
        
        // Use first category name or "Uncategorized"
        const category = categoryNames.length > 0 ? categoryNames[0] : "Uncategorized";
        
        return {
          id,
          title: name,
          price,
          cover_big: imageUrl,
          type: "product",
          release_date: createdAt,
          desc: description,
          track_total: null, // No stock field in new response
          category,
          categoryIds, // Keep array for future use
          categoryNames, // Store all category names
        };
      });
    }
    return [];
  }, [apiResponse, categoryMap]);

  // Group products by category - products with multiple categories appear in each group
  const productsByCategory = useMemo(() => {
    if (!products || products.length === 0) return {};
    
    return products.reduce((acc, product) => {
      // Get all category names for this product
      const categories = product.categoryNames && product.categoryNames.length > 0 
        ? product.categoryNames 
        : ["Uncategorized"];
      
      // Add product to each of its categories
      categories.forEach(category => {
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
      });
      
      return acc;
    }, {});
  }, [products]);

  const handleCreateProduct = useCallback(() => {
    openModal();
    getModalContent(<AddProductModal />);
  }, [openModal, getModalContent]);

  const handleEditProduct = useCallback((product) => {
    openModal();
    getModalContent(<EditProductModal product={product} />);
  }, [openModal, getModalContent]);

  // Debug logging
  console.log("Products page - isLoaded:", isLoaded, "user:", user, "role:", user?.role);

  // Show loading while user data is being fetched
  if (!isLoaded) {
    return (
      <section className="products_page">
        <div className="text-center py-12">
          <p className="text-secondary">Loading...</p>
        </div>
      </section>
    );
  }

  // Redirect if not a merchant
  if (!user || user.role !== "Merchant") {
    console.log("Redirecting - user:", user, "role:", user?.role);
    return <Navigate to="/" replace={true} />;
  }

  return (
    <section className="products_page">
      <div className="flex flex-col gap-y-8">
        {Object.keys(productsByCategory).length > 0 ? (
          Object.entries(productsByCategory)
            .sort(([categoryA], [categoryB]) => {
              // Put "Uncategorized" first
              if (categoryA === "Uncategorized") return -1;
              if (categoryB === "Uncategorized") return 1;
              // Then sort alphabetically
              return categoryA.localeCompare(categoryB);
            })
            .map(([category, categoryProducts]) => (
            <Sections.MediaSectionMinified
              key={category}
              data={categoryProducts}
              title={category}
              subTitle={`${categoryProducts.length} ${categoryProducts.length === 1 ? 'product' : 'products'}`}
              titleType="large"
              type="product"
              gridNumber={3}
              imageDims={28}
              isMyPlaylist={false}
              onEdit={handleEditProduct}
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
              isLoading={isPending}
              isSuccess={isSuccess}
              noDataText="No products in this category."
            />
          ))
        ) : (
          <div className="flex flex-col items-center gap-6 py-12">
            {isPending ? (
              <p className="text-secondary">Loading products...</p>
            ) : (
              <>
                <p className="text-secondary">No products yet. Add your first product to get started!</p>
                <button
                  onClick={handleCreateProduct}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
                >
                  <IconButton
                    name="MdAdd"
                    className="!w-auto !h-auto"
                    iconClassName="!text-white"
                    size="20"
                  />
                  <span className="font-semibold">Add Product</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
