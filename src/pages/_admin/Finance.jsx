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

export default function Finance() {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  if (!isLoaded) {
    return (
      <section className="admin_finance_page">
        <div className="py-12 text-center text-secondary">Loading finance...</div>
      </section>
    );
  }

  if (!user || user.role !== "Administrator") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <section className="admin_finance_page">
      <Title
        name="Finance & Payouts"
        desc="Monitor settlements, payout health, and payment operations."
        type="large"
      />

      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Revenue" value="--" hint="Gross platform volume" />
          <MetricCard label="Fees" value="--" hint="Platform earnings" />
          <MetricCard label="Pending Payouts" value="--" hint="Awaiting settlement" />
          <MetricCard label="Failed Payouts" value="--" hint="Needs retry/action" />
        </div>

        <div className="rounded-xl border border-divider/30 bg-main/20 p-5">
          <h3 className="text-lg font-semibold text-onNeutralBg">Next Integration</h3>
          <p className="mt-1 text-sm text-secondary">
            Connect admin finance endpoints for payout approvals, retries, and reconciliation.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="outlined"
              className="rounded-lg"
              onClick={() => navigate("/merchant/payouts")}
            >
              Open Merchant Payouts
            </Button>
            <Button
              variant="outlined"
              className="rounded-lg"
              onClick={() => navigate("/admin/analytics")}
            >
              View Financial Analytics
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}