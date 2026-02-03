import { memo } from "react";
import { Button, Icon } from "@/components";
import { classNames } from "@/lib/utils";

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "contained",
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-[2001] p-4">
        <div
          className="bg-main rounded-2xl shadow-2xl border border-divider max-w-md w-full animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-divider">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="PiWarningCircleBold" size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-onNeutralBg flex-1">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-neutralBg/50 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <Icon name="IoMdClose" size={20} className="text-secondary" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 py-6">
            <p className="text-sm text-secondary leading-relaxed">{message}</p>
          </div>
          
          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <Button
              type="button"
              label={cancelText}
              variant="outlined"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 !h-10 !text-sm font-semibold"
            />
            <Button
              type="button"
              label={
                isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="AiOutlineLoading3Quarters" size={16} className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  confirmText
                )
              }
              variant={confirmVariant}
              onClick={onConfirm}
              disabled={isLoading}
              className={classNames(
                "flex-1 !h-10 !text-sm font-semibold",
                confirmVariant === "contained" && "!bg-red-500 hover:!bg-red-600"
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ConfirmDialog);
