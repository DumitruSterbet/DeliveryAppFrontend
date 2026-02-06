import { useState } from "react";
import { Icon, Button } from "@/components";
import { formatPrice } from "@/lib/utils";
import { useFetchMerchantOrders } from "@/lib/actions"; // Using same hook as merchant but it will return customer orders

const OrderItem = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'confirmed':
      case 'processing':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'shipped':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'delivered':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cancelled':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getTotalAmount = (items) => {
    return items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  };

  return (
    <div className="bg-card rounded-xl border border-divider/30 p-6 hover:border-primary/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="BsBasket" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-onNeutralBg">Order #{order.orderNumber || order.id || 'N/A'}</h3>
            <p className="text-secondary text-sm">
              {order.createdAt ? formatDate(order.createdAt) : 'Date not available'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
            {order.status || 'Processing'}
          </span>
          <span className="text-lg font-bold text-primary">
            {formatPrice(getTotalAmount(order.items))}
          </span>
          <Button
            variant="outlined"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-10 h-10 rounded-lg border-divider/50 hover:border-primary/50 transition-all ${isExpanded ? 'bg-primary/10' : ''}`}
          >
            <Icon 
              name={isExpanded ? "BiChevronUp" : "BiChevronDown"} 
              size={18} 
              className={isExpanded ? "text-primary" : "text-secondary"} 
            />
          </Button>
        </div>
      </div>

      {order.merchantInfo && (
        <div className="mb-4 p-4 bg-neutralBg/30 rounded-lg">
          <h4 className="font-medium text-onNeutralBg mb-2">Store Information</h4>
          <div className="text-sm text-secondary">
            <p>{order.merchantInfo.storeName || order.merchantInfo.name}</p>
            {order.merchantInfo.email && <p>{order.merchantInfo.email}</p>}
            {order.merchantInfo.phone && <p>{order.merchantInfo.phone}</p>}
          </div>
        </div>
      )}

      {isExpanded && order.items && (
        <div className="border-t border-divider/30 pt-4">
          <h4 className="font-medium text-onNeutralBg mb-3">Order Items</h4>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutralBg/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-card">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="BsMusicNoteBeamed" size={16} className="text-secondary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h5 className="font-medium text-onNeutralBg text-sm">{item.name || item.productName || 'Product'}</h5>
                    <p className="text-xs text-secondary">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-onNeutralBg">{formatPrice(item.price || 0)}</p>
                  <p className="text-xs text-secondary">
                    Total: {formatPrice((item.price || 0) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {order.deliveryInfo && (
            <div className="mt-4 p-4 bg-neutralBg/30 rounded-lg">
              <h4 className="font-medium text-onNeutralBg mb-2">Delivery Information</h4>
              <div className="text-sm text-secondary space-y-1">
                {order.deliveryInfo.address && <p>{order.deliveryInfo.address}</p>}
                {order.deliveryInfo.trackingNumber && (
                  <p>Tracking: <span className="font-medium">{order.deliveryInfo.trackingNumber}</span></p>
                )}
                {order.deliveryInfo.estimatedDelivery && (
                  <p>Est. Delivery: {formatDate(order.deliveryInfo.estimatedDelivery)}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function MyOrders() {
  const { data: ordersData, isLoading, isError, refetch } = useFetchMerchantOrders(); // Same hook, different user context
  const orders = ordersData?.data || ordersData || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-secondary">Loading your orders...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <Icon name="BiError" size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-onNeutralBg mb-2">Failed to load orders</h3>
        <p className="text-secondary mb-4 text-center">
          There was an error loading your orders. Please try again.
        </p>
        <Button
          label="Retry"
          variant="contained"
          onClick={refetch}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-onNeutralBg">My Orders</h2>
          <p className="text-secondary">Track your purchase history and order status</p>
        </div>
        <Button
          variant="outlined"
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-divider/50 hover:border-primary/50"
        >
          <Icon name="BiRefresh" size={16} />
          <span>Refresh</span>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Icon name="BsBasket" size={28} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-onNeutralBg mb-3">No orders yet</h3>
          <p className="text-secondary mb-6 text-center">
            Start shopping to see your orders here. Browse our collection of music and products!
          </p>
          <Button
            label="Start Shopping"
            variant="contained"
            onClick={() => window.location.href = '/shop'}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/80"
          />
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            <div className="text-sm text-secondary">
              {orders.length} order{orders.length !== 1 ? 's' : ''} found
            </div>
          </div>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderItem key={order.id || Math.random()} order={order} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}