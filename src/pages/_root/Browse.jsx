import { useEffect, useState } from "react";

import { classNames } from "@/lib/utils";
import { useAppUtil } from "@/lib/store";
import { useFetchCategories } from "@/lib/actions";
import { Overlay, Icon, Button } from "@/components";

import Category from "./Category";

export default function Page() {
  const [getCategory, setCategory] = useState();

  const { getToggleCategories, toggleCategories } = useAppUtil();

  const { data: categories } = useFetchCategories();

  useEffect(() => {
    if (categories) setCategory(categories?.[0]?.id);
  }, [categories]);

  return (
    <div className="browse_page">
      <div className="flex flex-col gap-y-8">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-onNeutralBg mb-2">Browse by Category</h1>
          <p className="text-secondary text-sm max-w-xl mx-auto">
            Explore different categories and discover new content.
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="RiListIndefinite" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-onNeutralBg">Select Category</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories &&
              categories?.map((category) => (
                <Button
                  key={category.id}
                  label={category.name}
                  variant={getCategory === category.id ? "contained" : "outlined"}
                  className={classNames(
                    "px-4 py-2 text-sm",
                    getCategory === category.id && "bg-primary text-white"
                  )}
                  onClick={() => setCategory(category.id)}
                />
              ))}
          </div>
        </div>

        {/* Category Content */}
        <Category id={getCategory} />
      </div>
    </div>
  );
}
