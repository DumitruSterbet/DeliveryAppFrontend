import { useMemo } from "react";

import CourierPageTemplate from "./CourierPageTemplate";

export default function Earnings() {
  const summary = useMemo(
    () => ({
      today: 72.5,
      week: 420.75,
      month: 1620.2,
    }),
    []
  );

  return (
    <CourierPageTemplate
      title="Earnings"
      description="See courier earnings summary and payout-related performance totals."
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
          <p className="text-xs uppercase tracking-wider text-secondary">Today</p>
          <p className="mt-2 text-xl font-semibold text-onNeutralBg">${summary.today.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
          <p className="text-xs uppercase tracking-wider text-secondary">This Week</p>
          <p className="mt-2 text-xl font-semibold text-onNeutralBg">${summary.week.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
          <p className="text-xs uppercase tracking-wider text-secondary">This Month</p>
          <p className="mt-2 text-xl font-semibold text-onNeutralBg">${summary.month.toFixed(2)}</p>
        </div>
      </div>
    </CourierPageTemplate>
  );
}
