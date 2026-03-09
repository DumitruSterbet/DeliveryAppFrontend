import { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Button, Icon } from "@/components";
import { useCurrentUser } from "@/lib/store";
import {
  useFetchMerchantProducts,
  useFetchMerchantOrders,
  useFetchNearestCouriers,
} from "@/lib/actions";
import { useNotificationsStore } from "@/lib/stores/notifications.store";
import { formatPrice } from "@/lib/utils";

const normalizeCollection = (payload, fallbackKey) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.[fallbackKey])) return payload[fallbackKey];
  return [];
};

const getOrderTotal = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  return items.reduce((total, item) => {
    const price = Number(item?.price) || 0;
    const quantity = Number(item?.quantity) || 0;
    return total + price * quantity;
  }, 0);
};

const SummaryCard = ({ title, value, icon, hint }) => (
  <div className="rounded-xl border border-divider/30 bg-card p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-secondary">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-onNeutralBg">{value}</p>
        {hint ? <p className="mt-1 text-xs text-secondary">{hint}</p> : null}
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon name={icon} size={18} className="text-primary" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  const notificationStore = useNotificationsStore();
  const unreadCount = notificationStore?.unreadCount || 0;

  const { data: merchantProductsData, isPending: isLoadingProducts } =
    useFetchMerchantProducts();
  const {
    data: merchantOrdersData,
    isLoading: isLoadingOrders,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useFetchMerchantOrders();
  const {
    data: nearestCouriersData,
    isLoading: isLoadingCouriers,
    isError: isCouriersError,
    refetch: refetchCouriers,
  } = useFetchNearestCouriers({ enabled: Boolean(user) });

  const products = useMemo(
    () => normalizeCollection(merchantProductsData, "products"),
    [merchantProductsData]
  );

  const orders = useMemo(
    () => normalizeCollection(merchantOrdersData, "orders"),
    [merchantOrdersData]
  );

  const couriers = useMemo(
    () => normalizeCollection(nearestCouriersData, "couriers"),
    [nearestCouriersData]
  );

  const metrics = useMemo(() => {
    const pendingOrders = orders.filter(
      (order) => (order?.status || "").toLowerCase() === "pending"
    ).length;

    const completedOrders = orders.filter((order) => {
      const status = (order?.status || "").toLowerCase();
      return status === "delivered" || status === "completed";
    }).length;

    const estimatedRevenue = orders.reduce(
      (total, order) => total + getOrderTotal(order),
      0
    );

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      availableCouriers: couriers.length,
      estimatedRevenue,
    };
  }, [products, orders, couriers]);

  if (!isLoaded) {
    return (
      <section className="merchant_dashboard_page">
        <div className="py-12 text-center text-secondary">Loading dashboard...</div>
      </section>
    );
  }

  if (!user || user.role !== "Merchant") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <section className="merchant_dashboard_page space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-onNeutralBg">Merchant Dashboard</h2>
          <p className="text-secondary">Overview of your store performance and operations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            className="rounded-lg border-divider/50"
            onClick={() => {
              refetchOrders();
              refetchCouriers();
            }}
          >
            <div className="flex items-center gap-2">
              <Icon name="BiRefresh" size={16} />
              <span>Refresh</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Products"
          value={isLoadingProducts ? "..." : metrics.totalProducts}
          icon="RiListIndefinite"
          hint="Total products in your catalog"
        />
        <SummaryCard
          title="Orders"
          value={isLoadingOrders ? "..." : metrics.totalOrders}
          icon="BsReceipt"
          hint={`${metrics.pendingOrders} pending • ${metrics.completedOrders} completed`}
        />
        <SummaryCard
          title="Estimated Revenue"
          value={isLoadingOrders ? "..." : formatPrice(metrics.estimatedRevenue)}
          icon="BsBasket"
          hint="Calculated from current order items"
        />
        <SummaryCard
          title="Couriers Available"
          value={isLoadingCouriers ? "..." : metrics.availableCouriers}
          icon="MdLocalShipping"
          hint={isCouriersError ? "Could not refresh couriers right now" : "Nearest active couriers"}
        />
        <SummaryCard
          title="Notifications"
          value={unreadCount}
          icon="IoMdNotificationsOutline"
          hint="Unread account notifications"
        />
        <SummaryCard
          title="Pending Orders"
          value={isLoadingOrders ? "..." : metrics.pendingOrders}
          icon="FaSearchengin"
          hint={isOrdersError ? "Order service currently unavailable" : "Orders waiting for action"}
        />
      </div>

      <div className="rounded-xl border border-divider/30 bg-card p-5">
        <h3 className="text-lg font-semibold text-onNeutralBg">Quick Actions</h3>
        <p className="mt-1 text-sm text-secondary">
          Go directly to the most used merchant pages.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="contained"
            className="rounded-lg"
            onClick={() => navigate("/merchant/products")}
          >
            <div className="flex items-center gap-2">
              <Icon name="RiListIndefinite" size={16} />
              <span>Manage Products</span>
            </div>
          </Button>

          <Button
            variant="outlined"
            className="rounded-lg border-divider/50"
            onClick={() => navigate("/merchant/orders")}
          >
            <div className="flex items-center gap-2">
              <Icon name="BsReceipt" size={16} />
              <span>View Orders</span>
            </div>
          </Button>

          <Button
            variant="outlined"
            className="rounded-lg border-divider/50"
            onClick={() => navigate("/shop")}
          >
            <div className="flex items-center gap-2">
              <Icon name="MdLocalShipping" size={16} />
              <span>Couriers Availability</span>
            </div>
          </Button>

          <Button
            variant="outlined"
            className="rounded-lg border-divider/50"
            onClick={() => navigate("/notifications")}
          >
            <div className="flex items-center gap-2">
              <Icon name="IoMdNotificationsOutline" size={16} />
              <span>Notifications</span>
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
}
