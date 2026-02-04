import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useUpdateCategory } from "@/lib/actions/editorial.action";
import { useAppModal } from "@/lib/store";
import { Button, FormInput, FormTextarea, ImageUploader, Icon } from "@/components";

// Move schema outside component to prevent recreation on every render
const schema = yup.object().shape({
  name: yup.string().required("Category name is required").min(2, "Name must be at least 2 characters"),
  description: yup.string().required("Description is required"),
});

export default function EditCategoryModal({ category }) {
  const { close } = useAppModal();
  const { updateCategory, isUpdating } = useUpdateCategory();
  const [imageFile, setImageFile] = useState(null);
  const [blobUrl, setBlobUrl] = useState(category?.cover_big || null);
  const imageRef = useRef(null);

  // Create and cleanup blob URL
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setBlobUrl(url);
      
      // Cleanup function to revoke blob URL
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [imageFile]);

  const handleImage = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.includes("image")) {
        setImageFile(file);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: category?.title || "",
      description: category?.desc || "",
    },
  });

  const onSubmit = useCallback(async (data) => {
    // Pass the category id, image file along with form data
    updateCategory({ 
      id: category.id,
      ...data, 
      imageFile,
      currentImageUrl: category?.cover_big 
    });
    close();
  }, [category.id, imageFile, updateCategory, close, category?.cover_big]);

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Category Details Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MdEdit" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-onNeutralBg">Edit Category</h3>
          </div>
          
          <div className="bg-neutralBg/30 rounded-xl p-4 space-y-3 border border-neutralBg">
            <FormInput
              label="Category Name"
              placeholder="e.g., Electronics, Clothing, Books..."
              error={errors.name?.message}
              {...register("name")}
            />

            <FormTextarea
              label="Description"
              placeholder="Describe what kind of products belong to this category"
              error={errors.description?.message}
              rows={3}
              {...register("description")}
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MdImage" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-onNeutralBg">Category Image</h3>
          </div>
          
          <div className="bg-neutralBg/30 rounded-xl p-4 border border-neutralBg">
            <ImageUploader
              label="Update Category Image"
              imageSrc={blobUrl}
              onChange={handleImage}
              ref={imageRef}
              className="w-full"
              imageClassName="aspect-video object-cover"
              placeholder="Choose an image that represents this category"
            />
            {category?.cover_big && !imageFile && (
              <p className="text-sm text-secondary mt-2">
                Current image will be kept if no new image is selected
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutralBg">
          <Button
            type="button"
            onClick={close}
            variant="secondary"
            className="px-6 py-2"
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-2"
            loading={isUpdating}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Category"}
          </Button>
        </div>
      </form>
    </div>
  );
}