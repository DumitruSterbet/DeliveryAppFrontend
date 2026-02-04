import { useState, useEffect } from "react";
import { PatternBg, Title, Button, FormInput, Icon, Modal, ConfirmDialog } from "@/components";
import { useFetchCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/lib/actions/editorial.action";
import { useAppModal } from "@/lib/store";
import { useNotification } from "@/hooks";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  
  const [notify] = useNotification();
  const { data: categories, isLoading, error } = useFetchCategories();
  const { createCategory, isCreating } = useCreateCategory();
  const { updateCategory, isUpdating } = useUpdateCategory();
  const { deleteCategory, isDeleting } = useDeleteCategory();

  const filteredCategories = categories?.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await createCategory(categoryForm);
      setCategoryForm({ name: "", description: "" });
      setShowAddModal(false);
      notify({
        title: "Success",
        variant: "success",
        description: "Category created successfully"
      });
    } catch (error) {
      notify({
        title: "Error",
        variant: "error",
        description: "Failed to create category"
      });
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    try {
      await updateCategory({ id: editingCategory.id, ...categoryForm });
      setCategoryForm({ name: "", description: "" });
      setEditingCategory(null);
      notify({
        title: "Success",
        variant: "success",
        description: "Category updated successfully"
      });
    } catch (error) {
      notify({
        title: "Error",
        variant: "error",
        description: "Failed to update category"
      });
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
      notify({
        title: "Success",
        variant: "success",
        description: "Category deleted successfully"
      });
    } catch (error) {
      notify({
        title: "Error",
        variant: "error",
        description: "Failed to delete category"
      });
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description || "" });
  };

  const closeEditModal = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", description: "" });
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setCategoryForm({ name: "", description: "" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <PatternBg />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Title>Category Management</Title>
          <Button
            onClick={openAddModal}
            className="flex items-center gap-2"
          >
            <Icon name="IoMdAdd" size={18} />
            Add Category
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-bg-secondary/80 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <FormInput
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="bg-bg-secondary/80 backdrop-blur-sm rounded-xl p-6">
          {error ? (
            <div className="text-center py-8">
              <p className="text-text-secondary">Failed to load categories</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="PiCategoryDuotone" size={48} className="mx-auto mb-4 text-text-secondary" />
              <p className="text-text-secondary">No categories found</p>
              {searchTerm && (
                <p className="text-text-secondary text-sm mt-2">
                  Try adjusting your search terms
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-bg-primary rounded-lg p-6 border border-border-primary hover:border-accent-primary/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-text-secondary text-sm">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary">
                      ID: {category.id}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-2 rounded-md bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                        title="Edit Category"
                      >
                        <Icon name="BiEdit" size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingCategory(category)}
                        className="p-2 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                        title="Delete Category"
                      >
                        <Icon name="BiTrash" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-bg-secondary rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-text-primary mb-6">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <FormInput
              placeholder="Category Name"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <FormInput
              placeholder="Description (optional)"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outlined"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isCreating}
              >
                Add Category
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal isOpen={!!editingCategory} onClose={closeEditModal}>
        <div className="bg-bg-secondary rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-text-primary mb-6">Edit Category</h2>
          <form onSubmit={handleEditCategory} className="space-y-4">
            <FormInput
              placeholder="Category Name"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <FormInput
              placeholder="Description (optional)"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outlined"
                onClick={closeEditModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isUpdating}
              >
                Update Category
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
        isLoading={isDeleting}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default Categories;