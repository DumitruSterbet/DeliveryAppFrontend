import { useShoppingCart, useCurrentUser } from "@/lib/store";
import { Icon, IconButton, Button } from "@/components";
import { formatPrice, classNames } from "@/lib/utils";
import { useCreateOrder } from "@/lib/actions";

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useShoppingCart();

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.productId, newQuantity);
  };

  return (
    <div className="flex items-start gap-4 p-6 border-b border-divider hover:bg-card/50 transition-colors">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutralBg flex-shrink-0 shadow-md">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="BsMusicNoteBeamed" size={20} className="text-secondary" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0 space-y-2">
        <h3 className="font-semibold text-base text-onNeutralBg truncate">{item.name}</h3>
        <p className="text-primary font-semibold text-sm">{formatPrice(item.price)}</p>
        {item.description && (
          <p className="text-secondary text-xs line-clamp-1">{item.description}</p>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 bg-card rounded-lg p-2">
          <IconButton
            name="BiMinus"
            className="w-8 h-8 rounded-lg hover:bg-primary hover:text-white transition-all"
            iconClassName="text-onNeutralBg"
            onClick={() => handleQuantityChange(item.quantity - 1)}
          />
          <span className="w-10 text-center font-semibold text-sm px-2">{item.quantity}</span>
          <IconButton
            name="BiPlus"
            className="w-8 h-8 rounded-lg hover:bg-primary hover:text-white transition-all"
            iconClassName="text-onNeutralBg"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          />
        </div>
        
        <IconButton
          name="RiDeleteBin5Line"
          className="w-8 h-8 rounded-lg hover:bg-red-500 hover:text-white transition-all"
          iconClassName="text-red-500"
          onClick={() => removeItem(item.productId)}
        />
      </div>
    </div>
  );
};

export default function ShoppingCartModal() {
  const { currentUser } = useCurrentUser();
  const { user } = currentUser || {};
  const { 
    isOpen, 
    closeCart, 
    items, 
    clearCart, 
    getTotalPrice, 
    getItemCount 
  } = useShoppingCart();
  
  const createOrderMutation = useCreateOrder();
  const totalPrice = getTotalPrice();
  const itemCount = getItemCount();

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login or show login modal
      console.log("User must be logged in to checkout");
      return;
    }

    try {
      // Call the API to create the order
      await createOrderMutation.mutateAsync({ items });
      
      // Clear the cart after successful order creation
      clearCart();
      
      // Close the cart modal
      closeCart();
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Checkout failed:", error);
    }
  };

  const handleContinueShopping = () => {
    closeCart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />
      
      {/* Cart Modal */}
      <div className="relative bg-gradient-to-br from-main to-card rounded-2xl shadow-2xl border border-divider/20 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-divider/30 bg-card/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="BsCart3" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-onNeutralBg">Shopping Cart</h2>
              <p className="text-secondary text-xs">{itemCount} items</p>
            </div>
          </div>
          <IconButton
            name="MdClose"
            className="w-10 h-10 rounded-lg hover:bg-divider/50 transition-all"
            iconClassName="text-onNeutralBg"
            onClick={closeCart}
          />
        </div>
        
        {/* Cart Content */}
        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Icon name="BsCart3" size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-onNeutralBg mb-3">Your cart is empty</h3>
              <p className="text-secondary mb-6 text-center text-sm">Add products to get started!</p>
              <Button
                label="Continue Shopping"
                variant="contained"
                onClick={handleContinueShopping}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/80"
              />
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 200px)' }}>
                {items.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>
              
              {/* Cart Summary */}
              <div className="border-t border-divider/30 p-6 space-y-5 bg-gradient-to-r from-card/50 to-neutralBg/20">
                <div className="flex justify-between items-center p-4 bg-card/50 rounded-lg">
                  <span className="text-base font-semibold text-onNeutralBg">Total:</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                </div>
                
                {!user && (
                  <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-4 text-center">
                    <Icon name="BiInfoCircle" size={18} className="text-orange-500 mx-auto mb-2" />
                    <p className="text-orange-600 text-sm font-medium">Please log in to checkout</p>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <Button
                    label="Clear Cart"
                    variant="outlined"
                    onClick={clearCart}
                    className="flex-1 py-3 text-sm rounded-lg border-2 hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 transition-all"
                  />
                  <Button
                    label={user ? (createOrderMutation.isPending ? "Processing..." : "Checkout") : "Login"}
                    variant="contained"
                    onClick={handleCheckout}
                    disabled={!user || createOrderMutation.isPending}
                    className="flex-2 py-3 text-sm rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 transition-all"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}