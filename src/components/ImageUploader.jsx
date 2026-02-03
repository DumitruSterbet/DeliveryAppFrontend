/* eslint-disable no-unused-vars */
import { memo } from "react";
import { classNames } from "@/lib/utils";

import { Icon } from "@/components";

function ImageUploader({
  blobUrl,
  imageRef,
  containerDims = "h-32 w-full",
  borderType = "rounded",
}) {
  return (
    <div
      className={classNames(
        "flex flex-col gap-2 relative group transition-all duration-300",
        containerDims,
        borderType
      )}
    >
      <div
        className={classNames(
          "flex justify-center items-center h-full w-full border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden",
          blobUrl 
            ? "border-primary/50 bg-neutralBg/50" 
            : "border-gray-600 bg-neutralBg/30 hover:border-primary/50 hover:bg-neutralBg/50",
          borderType
        )}
        onClick={() => imageRef?.current?.click()}
      >
        {blobUrl ? (
          <div className="relative w-full h-full group">
            <img
              src={blobUrl}
              alt="Product preview"
              className={classNames(
                "h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105",
                borderType
              )}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                <Icon
                  name="IoSync"
                  size={32}
                  className="text-white"
                />
                <span className="text-white text-sm font-semibold">Change Image</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-8 transition-all duration-300 group-hover:scale-105">
            <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
              <Icon
                name="AiOutlineCloudUpload"
                size={40}
                className="text-primary"
              />
            </div>
            <div className="text-center space-y-1">
              <div className="text-base font-semibold text-onNeutralBg">
                Upload Product Image
              </div>
              <div className="text-xs text-secondary">
                Click to browse or drag and drop
              </div>
              <div className="text-xs text-secondary/70">
                PNG, JPG up to 10MB
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ImageUploader);
