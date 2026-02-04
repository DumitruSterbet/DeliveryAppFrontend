import { useState, useMemo } from "react";
import { useFetchAllTopProducts, useFetchCategories } from "@/lib/actions";
import { Sections, Icon, Button } from "@/components";
import { classNames } from "@/lib/utils";

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const {
    data: allTopProducts,
    isPending: isAllTopProductsDataPending,
    isSuccess: isAllTopProductsDataSuccess,
  } = useFetchAllTopProducts();

  const { data: categories = [] } = useFetchCategories();

  const { topProducts } = allTopProducts || {};

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all" || !topProducts?.data) {
      return topProducts?.data || [];
    }
    
    const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name;
    
    return topProducts.data.filter(product => {
      return product.categoryNames && product.categoryNames.includes(selectedCategoryName);
    });
  }, [topProducts, selectedCategory, categories]);

  return (
    <section className="shop_page">
      <div className="flex flex-col gap-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-onNeutralBg mb-4">Shop Products</h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Discover amazing products from our marketplace. Find exactly what you're looking for 
            from our curated collection of quality items.
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="MdCategory" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-onNeutralBg">Filter by Category</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              label="All Products"
              variant={selectedCategory === "all" ? "contained" : "outlined"}
              className={classNames(
                "px-4 py-2 text-sm",
                selectedCategory === "all" && "bg-primary text-white"
              )}
              onClick={() => setSelectedCategory("all")}
            />
            {categories.map((category) => (
              <Button
                key={category.id}
                label={category.name}
                variant={selectedCategory === category.id ? "contained" : "outlined"}
                className={classNames(
                  "px-4 py-2 text-sm",
                  selectedCategory === category.id && "bg-primary text-white"
                )}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <Sections.MediaSection
          data={filteredProducts}
          title={
            selectedCategory === "all" 
              ? "All Products" 
              : `${categories.find(cat => cat.id === selectedCategory)?.name || ''} Products`
          }
          subTitle={`${filteredProducts?.length || 0} products available`}
          titleType="large"
          type="product"
          gridNumber={4}
          cardItemNumber={filteredProducts?.length}
          isLoading={isAllTopProductsDataPending}
          isSuccess={isAllTopProductsDataSuccess}
          noDataText="No products found in this category."
        />

        {/* Empty State */}
        {isAllTopProductsDataSuccess && (!filteredProducts || filteredProducts.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16">
            <Icon name="BsCart3" size={64} className="text-secondary mb-6" />
            <h3 className="text-2xl font-semibold text-onNeutralBg mb-3">No Products Found</h3>
            <p className="text-secondary text-center max-w-md">
              {selectedCategory === "all" 
                ? "There are no products available at the moment. Check back later!"
                : "No products found in this category. Try selecting a different category."
              }
            </p>
            {selectedCategory !== "all" && (
              <Button
                label="View All Products"
                variant="contained"
                className="mt-6 px-6 py-3"
                onClick={() => setSelectedCategory("all")}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}