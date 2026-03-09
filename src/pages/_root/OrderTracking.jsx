import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { Title } from "@/components";
import { useFetchMerchantOrders } from "@/lib/actions";

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { data, isLoading, isError } = useFetchMerchantOrders();
  const orders = data?.data || data || [];

  const targetOrder = useMemo(() => {
    if (!orderId) return null;
    return orders.find(
      (order) => String(order?.id) === String(orderId) || String(order?.orderNumber) === String(orderId)
    );
  }, [orders, orderId]);

  return (
    <section className="order_tracking_page space-y-6">
      <Title
        name="Order Tracking"
        desc="Track delivery progress and shipping information for your order."
        type="large"
      />

      <div className="rounded-xl border border-divider/30 bg-card p-6">
        {!orderId ? (
          <p className="text-secondary">Select an order first. Open this page with query like: /order-tracking?orderId=123</p>
        ) : isLoading ? (
          <p className="text-secondary">Loading tracking details...</p>
        ) : isError ? (
          <p className="text-red-500">Could not load order tracking right now.</p>
        ) : !targetOrder ? (
          <p className="text-secondary">Order not found for ID: {orderId}</p>
        ) : (
          <div className="space-y-3 text-sm">
            <p className="text-onNeutralBg font-medium">Order #{targetOrder.orderNumber || targetOrder.id}</p>
            <p className="text-secondary">Status: {targetOrder.status || "Processing"}</p>
            <p className="text-secondary">
              Tracking Number: {targetOrder?.deliveryInfo?.trackingNumber || "Not assigned yet"}
            </p>
            <p className="text-secondary">Address: {targetOrder?.deliveryInfo?.address || "Not available"}</p>
          </div>
        )}
      </div>
    </section>
  );
}
