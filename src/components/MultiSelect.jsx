import { memo, useState, useRef, useEffect } from "react";
import { Icon } from "@/components";
import { classNames } from "@/lib/utils";

function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  error,
  placeholder = "Select options...",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (optionId) => {
    if (disabled) return;
    
    const newValue = value.includes(optionId)
      ? value.filter((id) => id !== optionId)
      : [...value, optionId];
    
    onChange(newValue);
  };

  const handleRemove = (optionId, e) => {
    e.stopPropagation();
    onChange(value.filter((id) => id !== optionId));
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.id));

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="block mb-1.5 text-xs font-medium text-onNeutralBg">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div
          className={classNames(
            "w-full min-h-[36px] px-3 py-2 text-sm rounded outline-none bg-sidebar text-onNeutralBg border border-divider cursor-pointer transition-colors",
            isOpen && "border-primary",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap gap-1.5 items-center">
            {selectedOptions.length === 0 ? (
              <span className="text-secondary text-sm">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/20 text-primary rounded text-xs font-medium"
                >
                  {option.name}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemove(option.id, e)}
                      className="hover:text-primary/70 transition-colors"
                    >
                      <Icon name="IoMdClose" size={14} />
                    </button>
                  )}
                </span>
              ))
            )}
          </div>
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon
              name={isOpen ? "MdKeyboardArrowUp" : "TiArrowSortedDown"}
              size={18}
              className="text-secondary"
            />
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-sidebar border border-divider rounded shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-secondary text-center">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = value.includes(option.id);
                return (
                  <div
                    key={option.id}
                    className={classNames(
                      "px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2",
                      isSelected
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-onNeutralBg hover:bg-neutralBg/50"
                    )}
                    onClick={() => handleToggle(option.id)}
                  >
                    <div
                      className={classNames(
                        "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-divider"
                      )}
                    >
                      {isSelected && (
                        <Icon name="BsCheckLg" size={10} className="text-white" />
                      )}
                    </div>
                    <span className="flex-1">{option.name}</span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default memo(MultiSelect);
