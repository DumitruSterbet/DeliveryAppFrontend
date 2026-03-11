import { useParams } from "react-router-dom";

import { Button } from "@/components";
import { useFetchCourierDeliveryDetails } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";

import CourierPageTemplate from "./CourierPageTemplate";

const getNumber = (...candidates) => {
  const found = candidates.find((value) => Number.isFinite(Number(value)));
  return Number(found || 0);
};

export default function DeliveryDetails() {
  const { id } = useParams();

  const { data, isPending, isError, error, refetch } = useFetchCourierDeliveryDetails({
    deliveryId: id,
    enabled: Boolean(id),
  });

  const detail = data?.delivery || data?.data || data || {};

  const deliveryId = detail?.deliveryId || id || "-";
  const orderId = detail?.orderId || "-";
  const orderNumber = detail?.orderNumber || "-";
  const deliveryStatus = detail?.deliveryStatus || detail?.status || "-";
  const orderStatus = detail?.orderStatus || "-";
  const customerName = detail?.customerName || "-";
  const customerAddress = detail?.customerAddress || "-";
  const storeName = detail?.storeName || "-";
  const storeAddress = detail?.storeAddress || "-";
  const totalAmount = getNumber(detail?.totalAmount, detail?.orderTotal);
  const itemCount = getNumber(detail?.itemCount);
  const createdAt = detail?.createdAt ? new Date(detail.createdAt).toLocaleString() : "-";

  return (
    <CourierPageTemplate
      title="Delivery Details"
      description="View customer location, delivery notes, and status workflow."
    >
      <div className="space-y-4 text-sm">
        {isPending ? (
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4 text-secondary">Loading delivery details...</div>
        ) : null}

        {isError ? (
          <div className="rounded-xl border border-red-400/30 bg-main/20 p-4 text-red-400">
            <p>{error?.response?.data?.message || error?.message || "Unable to load delivery details."}</p>
            <Button label="Retry" variant="outlined" className="mt-3" onClick={() => refetch()} />
          </div>
        ) : null}

        {!isPending && !isError ? (
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4 space-y-2">
            <p className="font-medium text-onNeutralBg">Delivery ID: {deliveryId}</p>
            <p className="text-secondary">Order: #{orderNumber} ({orderId})</p>
            <p className="text-secondary">Delivery Status: {deliveryStatus}</p>
            <p className="text-secondary">Order Status: {orderStatus}</p>
            <p className="text-secondary">Customer: {customerName}</p>
            <p className="text-secondary">Customer Address: {customerAddress}</p>
            <p className="text-secondary">Store: {storeName}</p>
            <p className="text-secondary">Store Address: {storeAddress}</p>
            <p className="text-secondary">Items: {itemCount}</p>
            <p className="text-secondary">Total: {formatPrice(totalAmount)}</p>
            <p className="text-secondary">Created: {createdAt}</p>
          </div>
        ) : null}
      </div>
    </CourierPageTemplate>
  );
}
