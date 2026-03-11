import { useMemo } from "react";

import { useFetchCourierEarnings } from "@/lib/actions";

import CourierPageTemplate from "./CourierPageTemplate";

const getNumber = (...candidates) => {
  const found = candidates.find((value) => Number.isFinite(Number(value)));
  return Number(found || 0);
};

export default function Earnings() {
  const { data, isPending, isError, error } = useFetchCourierEarnings();

  const summary = useMemo(() => {
    const source = data?.summary || data;

    return {
      today: getNumber(source?.today, source?.todayEarnings, source?.daily, source?.dailyEarnings),
      thisWeek: getNumber(source?.thisWeek, source?.week, source?.weekly, source?.weeklyEarnings),
      thisMonth: getNumber(source?.thisMonth, source?.month, source?.monthly, source?.monthlyEarnings),
      allTime: getNumber(source?.allTime, source?.lifetime, source?.totalEarnings),
      deliveriesToday: getNumber(source?.deliveriesToday, source?.todayDeliveries),
      deliveriesThisWeek: getNumber(source?.deliveriesThisWeek, source?.weeklyDeliveries),
      deliveriesThisMonth: getNumber(source?.deliveriesThisMonth, source?.monthlyDeliveries),
      deliveriesAllTime: getNumber(source?.deliveriesAllTime, source?.totalDeliveries),
    };
  }, [data]);

  return (
    <CourierPageTemplate
      title="Earnings"
      description="See courier earnings summary and payout-related performance totals."
    >
      <div className="space-y-4">
        {isPending ? (
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4 text-sm text-secondary">Loading earnings...</div>
        ) : null}

        {isError ? (
          <div className="rounded-xl border border-red-400/30 bg-main/20 p-4 text-sm text-red-400">
            {error?.response?.data?.message || error?.message || "Unable to load earnings."}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
            <p className="text-xs uppercase tracking-wider text-secondary">Today</p>
            <p className="mt-2 text-xl font-semibold text-onNeutralBg">${summary.today.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
            <p className="text-xs uppercase tracking-wider text-secondary">This Week</p>
            <p className="mt-2 text-xl font-semibold text-onNeutralBg">${summary.thisWeek.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
            <p className="text-xs uppercase tracking-wider text-secondary">This Month</p>
            <p className="mt-2 text-xl font-semibold text-onNeutralBg">${summary.thisMonth.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
            <p className="text-xs uppercase tracking-wider text-secondary">All Time</p>
            <p className="mt-2 text-xl font-semibold text-onNeutralBg">${summary.allTime.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
            <p className="text-xs uppercase tracking-wider text-secondary">Deliveries Today</p>
            <p className="mt-2 text-xl font-semibold text-onNeutralBg">{summary.deliveriesToday}</p>
          </div>
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
            <p className="text-xs uppercase tracking-wider text-secondary">Deliveries This Week</p>
            <p className="mt-2 text-xl font-semibold text-onNeutralBg">{summary.deliveriesThisWeek}</p>
          </div>
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
            <p className="text-xs uppercase tracking-wider text-secondary">Deliveries This Month</p>
            <p className="mt-2 text-xl font-semibold text-onNeutralBg">{summary.deliveriesThisMonth}</p>
          </div>
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
            <p className="text-xs uppercase tracking-wider text-secondary">Deliveries All Time</p>
            <p className="mt-2 text-xl font-semibold text-onNeutralBg">{summary.deliveriesAllTime}</p>
          </div>
        </div>
      </div>
    </CourierPageTemplate>
  );
}
