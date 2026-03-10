import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

import { Button, Icon, Title } from "@/components";
import {
  useCancelAdminOrder,
  useEscalateAdminOrder,
  useFetchAdminOrders,
  useFetchAdminOrdersSummary,
  useReassignAdminOrder,
  useResolveAdminOrder,
} from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import { useCurrentUser } from "@/lib/store";

const MetricCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-divider/30 bg-card p-4">
    <p className="text-xs uppercase tracking-wider text-secondary">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-onNeutralBg">{value}</p>
    <p className="mt-1 text-xs text-secondary">{hint}</p>
  </div>
);

export default function Orders() {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  const [reassignValues, setReassignValues] = useState({});

  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useFetchAdminOrdersSummary();

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useFetchAdminOrders();

  const { mutate: escalateOrder, isPending: isEscalating } = useEscalateAdminOrder();
  const { mutate: resolveOrder, isPending: isResolving } = useResolveAdminOrder();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelAdminOrder();
  const { mutate: reassignOrder, isPending: isReassigning } = useReassignAdminOrder();

  const toNum = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const summary = useMemo(() => {
    const source = summaryData || {};

    return {
      total: toNum(source?.totalOrders ?? source?.total),
      pending: toNum(source?.pendingOrders ?? source?.pending),
      inTransit: toNum(source?.inTransitOrders ?? source?.inTransit),
      escalated: toNum(source?.escalatedOrders ?? source?.escalated),
    };
  }, [summaryData]);

  const asArray = (payload, fallbackKey) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.[fallbackKey])) return payload[fallbackKey];
    if (Array.isArray(payload?.orders)) return payload.orders;
    return [];
  };

  const orders = useMemo(() => asArray(ordersData, "orders"), [ordersData]);

  const normalizeStatus = (value) => String(value || "").toLowerCase();

  const canEscalate = (status) => {
    const s = normalizeStatus(status);
    return s !== "cancelled" && s !== "resolved" && s !== "escalated";
  };

  const canResolve = (status) => {
    const s = normalizeStatus(status);
    return s === "escalated" || s === "pending";
  };

  const canCancel = (status) => {
    const s = normalizeStatus(status);
    return s !== "cancelled" && s !== "delivered";
  };

  const canReassign = (status) => {
    const s = normalizeStatus(status);
    return s !== "cancelled" && s !== "delivered";
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRefresh = () => {
    refetchSummary();
    refetchOrders();
  };

  const handleReassign = (orderId) => {
    const courierId = (reassignValues?.[orderId] || "").trim();
    const payload = courierId ? { courierId } : {};

    reassignOrder({ orderId, payload });
  };

  const isMutating = isEscalating || isResolving || isCancelling || isReassigning;

  if (!isLoaded) {
    return (
      <section className="admin_orders_page">
        <div className="py-12 text-center text-secondary">Loading orders...</div>
      </section>
    );
  }

  if (!user || user.role !== "Administrator") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <section className="admin_orders_page">
      <Title
        name="Orders Control"
        desc="Track delivery flow, investigate stuck orders, and manage escalations."
        type="large"
      />

      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total"
            value={isLoadingSummary ? "..." : summary.total}
            hint="All platform orders"
          />
          <MetricCard
            label="Pending"
            value={isLoadingSummary ? "..." : summary.pending}
            hint="Awaiting acceptance"
          />
          <MetricCard
            label="In Transit"
            value={isLoadingSummary ? "..." : summary.inTransit}
            hint="Out for delivery"
          />
          <MetricCard
            label="Escalated"
            value={isLoadingSummary ? "..." : summary.escalated}
            hint="Requires admin action"
          />
        </div>

        <div className="rounded-xl border border-divider/30 bg-main/20 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-onNeutralBg">Orders Queue</h3>
            <Button variant="outlined" className="rounded-lg" onClick={handleRefresh}>
              <div className="flex items-center gap-2">
                <Icon name="IoSync" size={16} />
                <span>Refresh</span>
              </div>
            </Button>
          </div>

          {isSummaryError ? (
            <p className="mt-2 text-sm text-red-500">Could not load summary.</p>
          ) : null}

          {isOrdersError ? (
            <p className="mt-3 text-sm text-red-500">Could not load orders list.</p>
          ) : isLoadingOrders ? (
            <p className="mt-3 text-sm text-secondary">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="mt-3 text-sm text-secondary">No orders found.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {orders.map((item, index) => {
                const orderId = item?.id || item?.orderId || item?._id || `order-${index}`;
                const status = item?.status || "Unknown";
                const customer = item?.customerName || item?.customerEmail || "Unknown";
                const amount = toNum(item?.amount ?? item?.totalAmount ?? item?.total ?? 0);
                const createdAt = item?.createdAt || item?.date;

                return (
                  <div
                    key={orderId}
                    className="rounded-lg border border-divider/30 bg-card p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-onNeutralBg">Order #{orderId}</p>
                        <p className="text-xs text-secondary">Customer: {customer}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-onNeutralBg">{formatPrice(amount)}</p>
                        <p className="text-xs text-secondary">{formatDate(createdAt)}</p>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-secondary">Status: {status}</p>

                      <div className="flex flex-wrap gap-2">
                        {canEscalate(status) && (
                          <Button
                            label={isMutating ? "Please wait..." : "Escalate"}
                            variant="outlined"
                            className="rounded-lg"
                            onClick={() => escalateOrder(orderId)}
                            disabled={isMutating}
                          />
                        )}

                        {canResolve(status) && (
                          <Button
                            label={isMutating ? "Please wait..." : "Resolve"}
                            variant="outlined"
                            className="rounded-lg"
                            onClick={() => resolveOrder(orderId)}
                            disabled={isMutating}
                          />
                        )}

                        {canCancel(status) && (
                          <Button
                            label={isMutating ? "Please wait..." : "Cancel"}
                            variant="outlined"
                            className="rounded-lg"
                            onClick={() => cancelOrder(orderId)}
                            disabled={isMutating}
                          />
                        )}

                        {canReassign(status) && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={reassignValues?.[orderId] || ""}
                              onChange={(event) =>
                                setReassignValues((prev) => ({
                                  ...prev,
                                  [orderId]: event.target.value,
                                }))
                              }
                              placeholder="Courier ID"
                              className="w-28 rounded-lg border border-divider/40 bg-main/20 px-2 py-1 text-xs text-onNeutralBg outline-none"
                            />
                            <Button
                              label={isMutating ? "Please wait..." : "Reassign"}
                              variant="outlined"
                              className="rounded-lg"
                              onClick={() => handleReassign(orderId)}
                              disabled={isMutating}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}