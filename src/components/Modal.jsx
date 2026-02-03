import { Suspense, memo } from "react";
import { useAppModal } from "@/lib/store";
import { classNames } from "@/lib/utils";

import { IconButton } from "./buttons";

function Modal() {
  const { isOpen, close, modalContent } = useAppModal();

  // Don't render anything if modal is not open and has no content
  if (!isOpen && !modalContent) {
    return null;
  }

  return (
    <div
      className={classNames(
        "fixed overflow-auto bg-main h-full w-full left-sidebar z-[1300] nav_width slide_up duration-500",
        isOpen ? "top-0" : "top-[10000px]"
      )}
    >
      <div className="p-8">
        <Suspense fallback={<div className="text-center py-12 text-secondary">Loading...</div>}>
          {modalContent}
        </Suspense>
      </div>
      <IconButton
        name="IoMdClose"
        className="absolute right-4 top-4 bg-primary"
        onClick={close}
      />
    </div>
  );
}

export default memo(Modal);
