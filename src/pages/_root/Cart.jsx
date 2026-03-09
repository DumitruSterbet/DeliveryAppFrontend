import { useNavigate } from "react-router-dom";

import { Button, Title } from "@/components";
import { useShoppingCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function Cart() {
  const navigate = useNavigate();
  const { items, openCart, getItemCount, getTotalPrice } = useShoppingCart();

  const itemCount = getItemCount();
  const totalPrice = getTotalPrice();

  return (
    <section className="cart_page space-y-6">
      <Title
        name="Cart"
        desc="Review your selected products and continue to checkout."
        type="large"
      />

      <div className="rounded-xl border border-divider/30 bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-secondary">Items in cart</span>
          <span className="font-semibold text-onNeutralBg">{itemCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-secondary">Total amount</span>
          <span className="font-semibold text-primary">{formatPrice(totalPrice)}</span>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button label="Open Cart Details" variant="contained" onClick={openCart} />
          <Button label="Continue Shopping" variant="outlined" onClick={() => navigate("/discover")} />
          <Button label="Go to Checkout" variant="outlined" onClick={() => navigate("/checkout")} />
        </div>
      </div>

      <div className="rounded-xl border border-divider/30 bg-main/20 p-6">
        {items.length === 0 ? (
          <p className="text-secondary">Your cart is empty. Add products from Discover or Browse.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center justify-between text-sm">
                <span className="text-onNeutralBg">{item.name}</span>
                <span className="text-secondary">Qty: {item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
