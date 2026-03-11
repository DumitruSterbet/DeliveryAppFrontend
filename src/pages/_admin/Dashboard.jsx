import { useMemo } from "react";
import { Navigate } from "react-router-dom";

import { Button, Icon, Title } from "@/components";
import { useFetchAdminDashboard } from "@/lib/actions";
import { useCurrentUser } from "@/lib/store";

const MetricCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-divider/30 bg-card p-4">
    <p className="text-xs uppercase tracking-wider text-secondary">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-onNeutralBg">{value}</p>
    <p className="mt-1 text-xs text-secondary">{hint}</p>
  </div>
);

const HealthBadge = ({ label, status }) => {
  const normalizedStatus = String(status || "unknown").toLowerCase();

  const statusClassName =
    normalizedStatus === "healthy"
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : normalizedStatus === "warning"
        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        : normalizedStatus === "critical"
          ? "bg-red-500/10 text-red-500 border-red-500/20"
          : "bg-divider/20 text-secondary border-divider/40";

  return (
    <div className="rounded-xl border border-divider/30 bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-secondary">{label}</p>
      <span className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClassName}`}>
        {status || "Unknown"}
      </span>
    </div>
  );
};

export default function Dashboard() {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  const {
    data: dashboardData,
    isLoading,
    isError,
    refetch,
  } = useFetchAdminDashboard();

  const toNum = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const metrics = useMemo(() => {
    const source = dashboardData || {};
    const kpis = source?.kpis || source;

    return {
      totalUsers: toNum(kpis?.totalUsers),
      totalOrders: toNum(kpis?.totalOrders),
      totalStores: toNum(kpis?.totalStores),
      totalProducts: toNum(kpis?.totalProducts),
      totalMerchants: toNum(kpis?.totalMerchants),
      totalCouriers: toNum(kpis?.totalCouriers),
    };
  }, [dashboardData]);

  const dashboardMeta = useMemo(() => {
    const source = dashboardData || {};
    const platformHealth = source?.platformHealth || {};

    return {
      adminName: source?.adminName || "Administrator",
      adminEmail: source?.adminEmail || "",
      platformHealth: {
        ordersStatus: platformHealth?.ordersStatus || "Unknown",
        payoutsStatus: platformHealth?.payoutsStatus || "Unknown",
        inventoryStatus: platformHealth?.inventoryStatus || "Unknown",
        couriersStatus: platformHealth?.couriersStatus || "Unknown",
        ordersRequiringAction: toNum(platformHealth?.ordersRequiringAction),
        payoutsRequiringAction: toNum(platformHealth?.payoutsRequiringAction),
        inventoryRequiringAction: toNum(platformHealth?.inventoryRequiringAction),
        couriersOnDuty: toNum(platformHealth?.couriersOnDuty),
      },
    };
  }, [dashboardData]);

  if (!isLoaded) {
    return (
      <section className="admin_dashboard_page">
        <div className="py-12 text-center text-secondary">Loading dashboard...</div>
      </section>
    );
  }

  if (!user || user.role !== "Administrator") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <section className="admin_dashboard_page">
      <Title
        name="Admin Dashboard"
        desc="Monitor platform health and navigate core administration tools."
        type="large"
      />

      <div className="mt-6 space-y-5">
        <div className="rounded-xl border border-divider/30 bg-main/20 p-5 text-onNeutralBg">
          <h3 className="text-lg font-semibold">Welcome, {dashboardMeta.adminName}</h3>
          <p className="mt-1 text-sm text-secondary">{dashboardMeta.adminEmail}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Users"
            value={isLoading ? "..." : metrics.totalUsers}
            hint="Registered platform users"
          />
          <MetricCard
            label="Orders"
            value={isLoading ? "..." : metrics.totalOrders}
            hint="All orders on platform"
          />
          <MetricCard
            label="Stores"
            value={isLoading ? "..." : metrics.totalStores}
            hint="Total active stores"
          />
          <MetricCard
            label="Products"
            value={isLoading ? "..." : metrics.totalProducts}
            hint="Catalog products"
          />
          <MetricCard
            label="Merchants"
            value={isLoading ? "..." : metrics.totalMerchants}
            hint="Merchant accounts"
          />
          <MetricCard
            label="Couriers"
            value={isLoading ? "..." : metrics.totalCouriers}
            hint="Courier accounts"
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-onNeutralBg">Platform Health</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <HealthBadge label="Orders" status={dashboardMeta.platformHealth.ordersStatus} />
            <HealthBadge label="Payouts" status={dashboardMeta.platformHealth.payoutsStatus} />
            <HealthBadge label="Inventory" status={dashboardMeta.platformHealth.inventoryStatus} />
            <HealthBadge label="Couriers" status={dashboardMeta.platformHealth.couriersStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Orders Requiring Action"
            value={isLoading ? "..." : dashboardMeta.platformHealth.ordersRequiringAction}
            hint="Needs admin intervention"
          />
          <MetricCard
            label="Payouts Requiring Action"
            value={isLoading ? "..." : dashboardMeta.platformHealth.payoutsRequiringAction}
            hint="Finance queue attention"
          />
          <MetricCard
            label="Inventory Requiring Action"
            value={isLoading ? "..." : dashboardMeta.platformHealth.inventoryRequiringAction}
            hint="Critical stock issues"
          />
          <MetricCard
            label="Couriers On Duty"
            value={isLoading ? "..." : dashboardMeta.platformHealth.couriersOnDuty}
            hint="Currently available couriers"
          />
        </div>

        <div className="rounded-xl border border-divider/30 bg-main/20 p-5 text-onNeutralBg">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Dashboard Feed</h3>
            <Button variant="outlined" className="rounded-lg" onClick={refetch}>
              <div className="flex items-center gap-2">
                <Icon name="IoSync" size={16} />
                <span>Refresh</span>
              </div>
            </Button>
          </div>
          {isError ? (
            <p className="mt-2 text-sm text-red-500">Could not load admin dashboard data.</p>
          ) : (
            <p className="mt-2 text-sm text-secondary">
              Overview is loaded from <span className="font-medium">/api/admin/dashboard</span>.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}