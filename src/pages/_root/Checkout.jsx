import { useNavigate } from "react-router-dom";

import { Button, Title } from "@/components";
import { useCurrentUser, useShoppingCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function Checkout() {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { user } = currentUser || {};
  const { openCart, getItemCount, getTotalPrice } = useShoppingCart();

  return (
    <section className="checkout_page space-y-6">
      <Title
        name="Checkout"
        desc="Confirm your cart items and place your order securely."
        type="large"
      />

      <div className="rounded-xl border border-divider/30 bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-secondary">Signed in as</span>
          <span className="text-onNeutralBg font-medium">{user?.email || "Guest"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-secondary">Items</span>
          <span className="text-onNeutralBg font-medium">{getItemCount()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-secondary">Total</span>
          <span className="text-primary font-semibold">{formatPrice(getTotalPrice())}</span>
        </div>
      </div>

      <div className="rounded-xl border border-divider/30 bg-main/20 p-6 space-y-3">
        <p className="text-secondary">
          Order placement is handled through your Shopping Cart modal in this app.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button label="Open Cart & Place Order" variant="contained" onClick={openCart} />
          {!user ? (
            <Button label="Login" variant="outlined" onClick={() => navigate("/login")} />
          ) : (
            <Button label="View My Orders" variant="outlined" onClick={() => navigate("/my-orders")} />
          )}
        </div>
      </div>
    </section>
  );
}
