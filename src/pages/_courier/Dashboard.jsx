import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components";

import CourierPageTemplate from "./CourierPageTemplate";

const StatCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
    <p className="text-xs uppercase tracking-wider text-secondary">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-onNeutralBg">{value}</p>
    <p className="mt-1 text-xs text-secondary">{hint}</p>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = useMemo(
    () => ({
      activeDeliveries: 3,
      completedToday: 8,
      onlineHours: 5.5,
      todaysEarnings: 72.5,
    }),
    []
  );

  return (
    <CourierPageTemplate
      title="Courier Dashboard"
      description="Track active deliveries, daily progress, and quick courier actions."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Active" value={stats.activeDeliveries} hint="Deliveries in progress" />
          <StatCard label="Completed" value={stats.completedToday} hint="Completed today" />
          <StatCard label="Online Hours" value={stats.onlineHours} hint="Current shift hours" />
          <StatCard label="Earnings" value={`$${stats.todaysEarnings.toFixed(2)}`} hint="Estimated today" />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button label="Open Deliveries" variant="contained" onClick={() => navigate("/courier/deliveries")} />
          <Button label="Update Availability" variant="outlined" onClick={() => navigate("/courier/availability")} />
          <Button label="View Earnings" variant="outlined" onClick={() => navigate("/courier/earnings")} />
        </div>
      </div>
    </CourierPageTemplate>
  );
}
