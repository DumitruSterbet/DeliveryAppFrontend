import { useShoppingCart, useCurrentUser } from "@/lib/store";
import { Icon, IconButton, Button } from "@/components";
import { formatPrice, classNames } from "@/lib/utils";

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useShoppingCart();

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.productId, newQuantity);
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-divider">
      <div className="w-16 h-16 rounded overflow-hidden bg-neutralBg flex-shrink-0">
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
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-onNeutralBg truncate">{item.name}</h3>
        <p className="text-primary font-semibold">{formatPrice(item.price)}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <IconButton
          name="BiMinus"
          className="w-8 h-8 rounded hover:bg-divider"
          iconClassName="text-onNeutralBg"
          onClick={() => handleQuantityChange(item.quantity - 1)}
        />
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <IconButton
          name="BiPlus"
          className="w-8 h-8 rounded hover:bg-divider"
          iconClassName="text-onNeutralBg"
          onClick={() => handleQuantityChange(item.quantity + 1)}
        />
      </div>
      
      <IconButton
        name="RiDeleteBin5Line"
        className="w-8 h-8 rounded hover:bg-divider"
        iconClassName="text-red-500"
        onClick={() => removeItem(item.productId)}
      />
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
  
  const totalPrice = getTotalPrice();
  const itemCount = getItemCount();

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    console.log("Proceeding to checkout with items:", items);
    // For now, just close the cart
    closeCart();
  };

  const handleContinueShopping = () => {
    closeCart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={closeCart}
      />
      
      {/* Cart Modal */}
      <div className="relative bg-main rounded-2xl shadow-2xl border border-divider max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-divider">
          <div className="flex items-center gap-2">
            <Icon name="BsCart3" size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-onNeutralBg">Shopping Cart</h2>
            <span className="text-secondary">({itemCount} items)</span>
          </div>
          <IconButton
            name="MdClose"
            className="w-8 h-8 rounded hover:bg-divider"
            iconClassName="text-onNeutralBg"
            onClick={closeCart}
          />
        </div>
        
        {/* Cart Content */}
        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon name="BsCart3" size={48} className="text-secondary mb-4" />
              <h3 className="text-lg font-semibold text-onNeutralBg mb-2">Your cart is empty</h3>
              <p className="text-secondary mb-6">Add some products to get started!</p>
              <Button
                label="Continue Shopping"
                variant="contained"
                onClick={handleContinueShopping}
                className="px-6 py-2"
              />
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="overflow-y-auto max-h-96">
                {items.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>
              
              {/* Cart Summary */}
              <div className="border-t border-divider p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-onNeutralBg">Total:</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                </div>
                
                {!user && (
                  <div className="bg-neutralBg/50 rounded-lg p-3 text-center">
                    <p className="text-secondary text-sm">Please log in to proceed with checkout</p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button
                    label="Clear Cart"
                    variant="outlined"
                    onClick={clearCart}
                    className="flex-1 py-2"
                  />
                  <Button
                    label={user ? "Proceed to Checkout" : "Login to Continue"}
                    variant="contained"
                    onClick={handleCheckout}
                    disabled={!user}
                    className="flex-2 py-2 bg-gradient-to-r from-primary to-primary/80"
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