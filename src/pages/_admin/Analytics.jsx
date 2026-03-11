import { useMemo } from "react";
import { Navigate } from "react-router-dom";

import { Button, Icon, Title } from "@/components";
import { useFetchAdminAnalytics } from "@/lib/actions";
import { useCurrentUser } from "@/lib/store";

const MetricCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-divider/30 bg-card p-4">
    <p className="text-xs uppercase tracking-wider text-secondary">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-onNeutralBg">{value}</p>
    <p className="mt-1 text-xs text-secondary">{hint}</p>
  </div>
);

export default function Analytics() {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  const {
    data: analyticsData,
    isLoading,
    isError,
    refetch,
  } = useFetchAdminAnalytics();

  const toNum = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const kpis = useMemo(() => {
    const source = analyticsData || {};
    return {
      totalUsers: toNum(source?.totalUsers),
      totalCustomers: toNum(source?.totalCustomers),
      totalMerchants: toNum(source?.totalMerchants),
      totalCouriers: toNum(source?.totalCouriers),
      totalStores: toNum(source?.totalStores),
      totalProducts: toNum(source?.totalProducts),
      totalOrders: toNum(source?.totalOrders),
    };
  }, [analyticsData]);

  if (!isLoaded) {
    return (
      <section className="admin_analytics_page">
        <div className="py-12 text-center text-secondary">Loading analytics...</div>
      </section>
    );
  }

  if (!user || user.role !== "Administrator") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <section className="admin_analytics_page">
      <Title
        name="Analytics"
        desc="Track platform trends, engagement, and operational performance."
        type="large"
      />

      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Users"
            value={isLoading ? "..." : kpis.totalUsers}
            hint="All registered accounts"
          />
          <MetricCard
            label="Customers"
            value={isLoading ? "..." : kpis.totalCustomers}
            hint="Customer role accounts"
          />
          <MetricCard
            label="Merchants"
            value={isLoading ? "..." : kpis.totalMerchants}
            hint="Merchant role accounts"
          />
          <MetricCard
            label="Couriers"
            value={isLoading ? "..." : kpis.totalCouriers}
            hint="Courier role accounts"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <MetricCard
            label="Stores"
            value={isLoading ? "..." : kpis.totalStores}
            hint="Total onboarded stores"
          />
          <MetricCard
            label="Products"
            value={isLoading ? "..." : kpis.totalProducts}
            hint="Catalog inventory size"
          />
          <MetricCard
            label="Orders"
            value={isLoading ? "..." : kpis.totalOrders}
            hint="All-time orders count"
          />
        </div>

        <div className="rounded-xl border border-divider/30 bg-main/20 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-onNeutralBg">Analytics Feed</h3>
            <Button variant="outlined" className="rounded-lg" onClick={refetch}>
              <div className="flex items-center gap-2">
                <Icon name="IoSync" size={16} />
                <span>Refresh</span>
              </div>
            </Button>
          </div>
          {isError ? (
            <p className="mt-2 text-sm text-red-500">Could not load admin analytics.</p>
          ) : (
            <p className="mt-2 text-sm text-secondary">
              KPI data is loaded from <span className="font-medium">/api/admin/analytics</span>.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}