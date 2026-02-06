import { useShoppingCart } from "@/lib/store";
import { Icon } from "@/components";
import { classNames } from "@/lib/utils";

export default function CartIcon({ className }) {
  const { getItemCount, openCart } = useShoppingCart();
  const itemCount = getItemCount();

  return (
    <button
      onClick={openCart}
      className={classNames(
        "relative p-2 rounded-full hover:bg-card transition-colors",
        className
      )}
    >
      <Icon
        name="BsCart3"
        className="w-6 h-6 text-onNeutralBg"
        size="20"
      />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold min-w-[20px]">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}