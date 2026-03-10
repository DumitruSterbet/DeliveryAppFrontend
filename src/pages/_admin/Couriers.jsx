import { Navigate, useNavigate } from "react-router-dom";

import { Button, Title } from "@/components";
import { useCurrentUser } from "@/lib/store";

const MetricCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-divider/30 bg-card p-4">
    <p className="text-xs uppercase tracking-wider text-secondary">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-onNeutralBg">{value}</p>
    <p className="mt-1 text-xs text-secondary">{hint}</p>
  </div>
);

export default function Couriers() {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  if (!isLoaded) {
    return (
      <section className="admin_couriers_page">
        <div className="py-12 text-center text-secondary">Loading couriers...</div>
      </section>
    );
  }

  if (!user || user.role !== "Administrator") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <section className="admin_couriers_page">
      <Title
        name="Couriers"
        desc="Oversee courier verification, availability, and delivery quality."
        type="large"
      />

      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total" value="--" hint="All courier accounts" />
          <MetricCard label="Online" value="--" hint="Active right now" />
          <MetricCard label="Pending" value="--" hint="Awaiting approval" />
          <MetricCard label="Flagged" value="--" hint="Needs manual review" />
        </div>

        <div className="rounded-xl border border-divider/30 bg-main/20 p-5">
          <h3 className="text-lg font-semibold text-onNeutralBg">Next Integration</h3>
          <p className="mt-1 text-sm text-secondary">
            Add admin courier endpoints for assignment controls, audits, and account actions.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="outlined"
              className="rounded-lg"
              onClick={() => navigate("/courier/deliveries")}
            >
              Open Courier Deliveries
            </Button>
            <Button
              variant="outlined"
              className="rounded-lg"
              onClick={() => navigate("/admin/orders")}
            >
              Review Orders Queue
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}