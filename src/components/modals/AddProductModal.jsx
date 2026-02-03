import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCreateProduct } from "@/lib/actions/product.action";
import { useFetchCategories } from "@/lib/actions/editorial.action";
import { useAppModal } from "@/lib/store";
import { Button, FormInput, FormTextarea, ImageUploader, Icon, MultiSelect } from "@/components";

// Move schema outside component to prevent recreation on every render
const schema = yup.object().shape({
  name: yup.string().required("Product name is required").min(3, "Name must be at least 3 characters"),
  description: yup.string().required("Description is required"),
  price: yup.number().required("Price is required").positive("Price must be positive").typeError("Price must be a number"),
});

// Move default values outside component
const defaultFormValues = {
  name: "",
  description: "",
  price: "",
};

export default function AddProductModal() {
  const { close } = useAppModal();
  const { createProduct, isCreating } = useCreateProduct();
  const { data: categories = [], isPending: categoriesLoading } = useFetchCategories();
  const [imageFile, setImageFile] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
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
    // Pass the image file and selected category IDs along with form data
    createProduct({ ...data, imageFile, categoryIds: selectedCategoryIds });
    close();
  }, [imageFile, selectedCategoryIds, createProduct, close]);

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Details Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MdInfo" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-onNeutralBg">Product Details</h3>
          </div>
          
          <div className="bg-neutralBg/30 rounded-xl p-4 space-y-3 border border-neutralBg">
            <FormInput
              label="Product Name"
              placeholder="e.g., Wireless Headphones, Coffee Table..."
              error={errors.name?.message}
              {...register("name")}
            />

            <FormTextarea
              label="Description"
              placeholder="Describe your product in detail - features, materials, dimensions, etc."
              error={errors.description?.message}
              rows={4}
              {...register("description")}
            />
          </div>
        </div>

        {/* Pricing & Category Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MdLocalOffer" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-onNeutralBg">Pricing & Category</h3>
          </div>
          
          <div className="bg-neutralBg/30 rounded-xl p-4 space-y-3 border border-neutralBg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FormInput
                  label="Price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  error={errors.price?.message}
                  {...register("price")}
                />
                <span className="absolute left-3 bottom-3 text-secondary text-sm font-semibold">$</span>
              </div>

              <MultiSelect
                label="Categories"
                options={categories.map(cat => ({ id: cat.id, name: cat.name }))}
                value={selectedCategoryIds}
                onChange={setSelectedCategoryIds}
                placeholder="Select categories..."
                disabled={categoriesLoading}
              />
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MdImage" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-onNeutralBg">Product Image</h3>
          </div>
          
          <div className="bg-neutralBg/30 rounded-xl p-4 border border-neutralBg">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
              ref={imageRef}
            />
            <ImageUploader
              blobUrl={blobUrl}
              imageRef={imageRef}
              containerDims="h-64 w-full"
              borderType="rounded-lg"
            />
            <p className="text-xs text-secondary mt-3 text-center">
              Recommended: Square image, at least 800x800px, PNG or JPG format
            </p>
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
                    Create Product
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
