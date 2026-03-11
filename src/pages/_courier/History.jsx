import { useMemo } from "react";

import { useFetchCourierHistory } from "@/lib/actions";

import CourierPageTemplate from "./CourierPageTemplate";

const getNumber = (...candidates) => {
  const found = candidates.find((value) => Number.isFinite(Number(value)));
  return Number(found || 0);
};

export default function History() {
  const { data, isPending, isError, error } = useFetchCourierHistory();

  const completed = useMemo(() => {
    const list = data?.history || data?.items || data?.data || data || [];

    if (!Array.isArray(list)) {
      return [];
    }

    return list.map((item, index) => {
      const dateValue = item?.date || item?.completedAt || item?.createdAt;

      return {
        id: item?.deliveryId || item?.id || item?.orderId || `delivery-${index}`,
        orderId: item?.orderId || "-",
        orderNumber: item?.orderNumber || "-",
        status: item?.status || "Delivered",
        storeName: item?.storeName || item?.merchantName || "-",
        orderTotal: getNumber(item?.orderTotal, item?.total),
        earnings: getNumber(item?.earnings, item?.amount),
        date: dateValue ? new Date(dateValue).toLocaleDateString() : "-",
      };
    });
  }, [data]);

  return (
    <CourierPageTemplate
      title="History"
      description="Review completed deliveries and recent courier activity."
    >
      <div className="space-y-3">
        {isPending ? (
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4 text-sm text-secondary">Loading history...</div>
        ) : null}

        {isError ? (
          <div className="rounded-xl border border-red-400/30 bg-main/20 p-4 text-sm text-red-400">
            {error?.response?.data?.message || error?.message || "Unable to load history."}
          </div>
        ) : null}

        {!isPending && !isError && completed.length === 0 ? (
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4 text-sm text-secondary">
            No completed deliveries yet.
          </div>
        ) : null}

        {completed.map((item) => (
          <div key={item.id} className="rounded-lg border border-divider/30 bg-main/20 p-3 text-sm">
            <p className="font-medium text-onNeutralBg">Delivery {item.id}</p>
            <p className="text-secondary">Order: #{item.orderNumber} ({item.orderId})</p>
            <p className="text-secondary">Store: {item.storeName}</p>
            <p className="text-secondary">Status: {item.status}</p>
            <p className="text-secondary">Order Total: ${item.orderTotal.toFixed(2)}</p>
            <p className="text-secondary">Earnings: ${item.earnings.toFixed(2)}</p>
            <p className="text-secondary">Date: {item.date}</p>
          </div>
        ))}
      </div>
    </CourierPageTemplate>
  );
}
