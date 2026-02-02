import { useState, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCreateProduct } from "@/lib/actions/product.action";
import { useAppModal } from "@/lib/store";
import { fileBlob } from "@/lib/utils";
import { Button, FormInput, FormTextarea, ImageUploader } from "@/components";

const schema = yup.object().shape({
  name: yup.string().required("Product name is required").min(3, "Name must be at least 3 characters"),
  description: yup.string().required("Description is required"),
  price: yup.number().required("Price is required").positive("Price must be positive").typeError("Price must be a number"),
  category: yup.string().optional(),
});

export default function AddProductModal() {
  const { close } = useAppModal();
  const { createProduct, isCreating } = useCreateProduct();
  const [imageFile, setImageFile] = useState(null);
  const imageRef = useRef(null);

  const blob = useMemo(() => {
    return fileBlob(imageFile ? [imageFile] : null);
  }, [imageFile]);

  const handleImage = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.includes("image")) {
        setImageFile(file);
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
    },
  });

  const onSubmit = async (data) => {
    // Pass the image file along with form data
    createProduct({ ...data, imageFile });
    close();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="mb-6 text-2xl font-bold text-onNeutralBg">Add New Product</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="Product Name"
          placeholder="Enter product name"
          error={errors.name?.message}
          {...register("name")}
        />

        <FormTextarea
          label="Description"
          placeholder="Enter product description"
          error={errors.description?.message}
          rows={4}
          {...register("description")}
        />

        <FormInput
          label="Price"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.price?.message}
          {...register("price")}
        />

        <FormInput
          label="Category"
          placeholder="e.g., Electronics, Furniture (optional)"
          error={errors.category?.message}
          {...register("category")}
        />

        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-onNeutralBg">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
            ref={imageRef}
          />
          <ImageUploader
            blobUrl={blob.blobUrl}
            imageRef={imageRef}
            containerDims="h-48 w-full"
            borderType="rounded"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            label="Cancel"
            variant="outlined"
            onClick={close}
            className="flex-1"
          />
          <Button
            type="submit"
            label={isCreating ? "Creating..." : "Create Product"}
            variant="contained"
            disabled={isCreating}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}
