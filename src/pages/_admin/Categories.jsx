import { useMemo, lazy, useCallback, useState } from "react";
import { json, Navigate } from "react-router-dom";

import { useCurrentUser, useAppModal } from "@/lib/store";
import { useFetchCategories, useDeleteCategory } from "@/lib/actions/editorial.action";
import { IconButton, Sections, ConfirmDialog } from "@/components";

// Lazy load the modals to reduce initial bundle size
const AddCategoryModal = lazy(() => import("@/components/modals/AddCategoryModal"));
const EditCategoryModal = lazy(() => import("@/components/modals/EditCategoryModal"));

export default function Categories() {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};
  const { open: openModal, getModalContent } = useAppModal();
  const { deleteCategory, isDeleting } = useDeleteCategory();
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, category: null });


  // Fetch categories from backend
  const { data: categories = [], isPending, isSuccess } = useFetchCategories();

  const processedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    
    return categories.map((category) => {
      const { id, name, description, imageUrl, createdAt } = category;
      console.log("Processing category:", category);
      return {
        id,
        title: name,
        cover_big: imageUrl,
        type: "category",
        release_date: createdAt,
        desc: description,
        track_total: null, // Not applicable for categories
      };
    });
  }, [categories]);

  const handleCreateCategory = useCallback(() => {
    openModal();
    getModalContent(<AddCategoryModal />);
  }, [openModal, getModalContent]);

  const handleEditCategory = useCallback((category) => {
    openModal();
    getModalContent(<EditCategoryModal category={category} />);
  }, [openModal, getModalContent]);

  const handleDeleteCategory = useCallback((category) => {
    setConfirmDialog({ isOpen: true, category });
  }, []);

  const confirmDelete = useCallback(() => {
    if (confirmDialog.category) {
      deleteCategory(confirmDialog.category.id);
      setConfirmDialog({ isOpen: false, category: null });
    }
  }, [confirmDialog.category, deleteCategory]);

  const cancelDelete = useCallback(() => {
    setConfirmDialog({ isOpen: false, category: null });
  }, []);

  // Debug logging
  console.log("Categories page - isLoaded:", isLoaded, "user:", user, "role:", user?.role);

  // Show loading while user data is being fetched
  if (!isLoaded) {
    return (
      <section className="categories_page">
        <div className="text-center py-12">
          <p className="text-secondary">Loading...</p>
        </div>
      </section>
    );
  }

  // Redirect if not an admin
  if (!user || user.role !== "Administrator") {
    console.log("Redirecting - user:", user, "role:", user?.role);
    return <Navigate to="/" replace={true} />;
  }

  return (
    <section className="categories_page">
      <div className="flex flex-col gap-y-8">
        {processedCategories.length > 0 ? (
          <Sections.MediaSectionMinified
            key="all-categories"
            data={processedCategories}
            title="Categories Management"
            subTitle={`${processedCategories.length} ${processedCategories.length === 1 ? 'category' : 'categories'}`}
            titleType="large"
            type="category"
            gridNumber={3}
            imageDims={28}
            isMyPlaylist={false}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            CreatePlaylistComp={() => (
              <li className="col-span-1">
                <div className="h-full add_category">
                  <div className="flex-col w-full h-full gap-2 p-4 border border-dashed rounded border-secondary flex_justify_center text-onNeutralBg">
                    <IconButton
                      name="MdAdd"
                      className="w-12 h-12 rounded-full shadow-lg bg-primary flex_justify_center"
                      iconClassName="!text-white"
                      size="30"
                      onClick={handleCreateCategory}
                    />
                    <p className="text-sm font-semibold tracking-wider">
                      Add Category
                    </p>
                  </div>
                </div>
              </li>
            )}
            isLoading={isPending}
            isSuccess={isSuccess}
            noDataText="No categories found."
          />
        ) : (
          <div className="flex flex-col items-center gap-6 py-12">
            {isPending ? (
              <p className="text-secondary">Loading categories...</p>
            ) : (
              <>
                <p className="text-secondary">No categories yet. Add your first category to get started!</p>
                <button
                  onClick={handleCreateCategory}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
                >
                  <IconButton
                    name="MdAdd"
                    className="!w-auto !h-auto"
                    iconClassName="!text-white"
                    size="20"
                  />
                  <span className="font-semibold">Add Category</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${confirmDialog.category?.title || ''}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </section>
  );
}