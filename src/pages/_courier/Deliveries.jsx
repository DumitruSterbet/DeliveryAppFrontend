import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components";
import { formatPrice } from "@/lib/utils";
import { useFetchCourierDeliveries } from "@/lib/actions";

import CourierPageTemplate from "./CourierPageTemplate";

const getNumber = (...candidates) => {
  const found = candidates.find((value) => Number.isFinite(Number(value)));
  return Number(found || 0);
};

export default function Deliveries() {
  const navigate = useNavigate();
  const { data, isPending, isError, error, refetch } = useFetchCourierDeliveries();

  const deliveries = useMemo(() => {
    const list = data?.deliveries || data?.items || data?.data || data || [];

    if (!Array.isArray(list)) {
      return [];
    }

    return list.map((item, index) => ({
      deliveryId: item?.deliveryId || item?.id || `delivery-${index}`,
      orderId: item?.orderId || "-",
      orderNumber: item?.orderNumber || "-",
      deliveryStatus: item?.deliveryStatus || item?.status || "Assigned",
      orderStatus: item?.orderStatus || "-",
      customerName: item?.customerName || "-",
      customerAddress: item?.customerAddress || "-",
      storeName: item?.storeName || "-",
      storeAddress: item?.storeAddress || "-",
      totalAmount: getNumber(item?.totalAmount, item?.orderTotal),
      itemCount: getNumber(item?.itemCount),
    }));
  }, [data]);

  return (
    <CourierPageTemplate
      title="Deliveries"
      description="Manage assigned deliveries and open each delivery detail."
    >
      <div className="space-y-3">
        {isPending ? (
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4 text-sm text-secondary">Loading deliveries...</div>
        ) : null}

        {isError ? (
          <div className="rounded-xl border border-red-400/30 bg-main/20 p-4 text-sm text-red-400">
            <p>{error?.response?.data?.message || error?.message || "Unable to load deliveries."}</p>
            <button className="mt-2 text-xs underline" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        ) : null}

        {!isPending && !isError && deliveries.length === 0 ? (
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4 text-sm text-secondary">
            No active deliveries available.
          </div>
        ) : null}

        {deliveries.map((delivery) => (
          <div key={delivery.deliveryId} className="rounded-xl border border-divider/30 bg-main/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-onNeutralBg">Order #{delivery.orderNumber}</p>
                <p className="text-sm text-secondary">Delivery: {delivery.deliveryId}</p>
                <p className="text-sm text-secondary">{delivery.customerName} • {delivery.customerAddress}</p>
                <p className="text-xs text-secondary">Store: {delivery.storeName} • {delivery.storeAddress}</p>
                <p className="text-xs text-secondary">
                  Delivery: {delivery.deliveryStatus} • Order: {delivery.orderStatus}
                </p>
                <p className="text-xs text-secondary">
                  {delivery.itemCount} items • {formatPrice(delivery.totalAmount)}
                </p>
              </div>
              <Button
                label="Open"
                variant="outlined"
                onClick={() => navigate(`/courier/deliveries/${delivery.deliveryId}`)}
              />
            </div>
          </div>
        ))}
      </div>
    </CourierPageTemplate>
  );
}
