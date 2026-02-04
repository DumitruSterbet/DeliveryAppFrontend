import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCreateCategory } from "@/lib/actions/editorial.action";
import { useAppModal } from "@/lib/store";
import { Button, FormInput, FormTextarea, ImageUploader, Icon } from "@/components";

// Move schema outside component to prevent recreation on every render
const schema = yup.object().shape({
  name: yup.string().required("Category name is required").min(2, "Name must be at least 2 characters"),
  description: yup.string().required("Description is required"),
  type: yup.string().optional(),
});

// Move default values outside component
const defaultFormValues = {
  name: "",
  description: "",
  type: "",
};

export default function AddCategoryModal() {
  const { close } = useAppModal();
  const { createCategory, isCreating } = useCreateCategory();
  const [imageFile, setImageFile] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
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
    } else {
      setBlobUrl(null);
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
    defaultValues: defaultFormValues,
  });

  const onSubmit = useCallback(async (data) => {
    // Map form data to API structure with lowercase field names
    const categoryData = {
      name: data.name,
      description: data.description,
      type: data.type || null,
      picture: imageFile || null,
    };
    createCategory(categoryData);
    close();
  }, [imageFile, createCategory, close]);

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Category Details Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MdCategory" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-onNeutralBg">Category Details</h3>
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

            <FormInput
              label="Type (Optional)"
              placeholder="e.g., Physical, Digital, Service..."
              error={errors.type?.message}
              {...register("type")}
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
              label="Upload Category Image"
              imageSrc={blobUrl}
              onChange={handleImage}
              ref={imageRef}
              className="w-full"
              imageClassName="aspect-video object-cover"
              placeholder="Choose an image that represents this category"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 pb-2">
          <Button
            type="button"
            label="Cancel"
            variant="outlined"
            onClick={close}
            className="flex-1 !h-9 !text-sm font-semibold"
          />
          <Button
            type="submit"
            label={
              <span className="flex items-center justify-center gap-1.5">
                {isCreating ? (
                  <>
                    <Icon name="AiOutlineLoading3Quarters" size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Icon name="MdCheckCircle" size={18} />
                    Create Category
                  </>
                )}
              </span>
            }
            variant="contained"
            disabled={isCreating}
            className="flex-1 !h-9 !text-sm font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          />
        </div>
      </form>
    </div>
  );
}