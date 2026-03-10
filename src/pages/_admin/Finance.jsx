import { useMemo } from "react";
import { Navigate } from "react-router-dom";

import { Button, Icon, Title } from "@/components";
import {
  useApproveAdminPayout,
  useFetchAdminFinancePayouts,
  useFetchAdminFinanceSummary,
  useRejectAdminPayout,
  useRetryAdminPayout,
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

export default function Finance() {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useFetchAdminFinanceSummary();

  const {
    data: payoutsData,
    isLoading: isLoadingPayouts,
    isError: isPayoutsError,
    refetch: refetchPayouts,
  } = useFetchAdminFinancePayouts();

  const { mutate: approvePayout, isPending: isApproving } = useApproveAdminPayout();
  const { mutate: rejectPayout, isPending: isRejecting } = useRejectAdminPayout();
  const { mutate: retryPayout, isPending: isRetrying } = useRetryAdminPayout();

  const asArray = (payload, fallbackKey) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.[fallbackKey])) return payload[fallbackKey];
    if (Array.isArray(payload?.payouts)) return payload.payouts;
    return [];
  };

  const payouts = useMemo(() => asArray(payoutsData, "payouts"), [payoutsData]);

  const summary = useMemo(() => {
    const source = summaryData || {};

    const toNum = (value) => {
      const n = Number(value);
      return Number.isFinite(n) ? n : 0;
    };

    return {
      revenue: toNum(source?.revenue ?? source?.grossRevenue ?? source?.totalRevenue),
      fees: toNum(source?.fees ?? source?.platformFees ?? source?.commission),
      pendingPayouts: toNum(
        source?.pendingPayouts ?? source?.pendingPayoutsCount ?? source?.pendingCount
      ),
      failedPayouts: toNum(
        source?.failedPayouts ?? source?.failedPayoutsCount ?? source?.failedCount
      ),
    };
  }, [summaryData]);

  const normalizeStatus = (value) => String(value || "").toLowerCase();

  const canApprove = (status) => {
    const s = normalizeStatus(status);
    return s === "pending" || s === "requested" || s === "review";
  };

  const canReject = (status) => {
    const s = normalizeStatus(status);
    return s === "pending" || s === "requested" || s === "review";
  };

  const canRetry = (status) => {
    const s = normalizeStatus(status);
    return s === "failed" || s === "error";
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
    refetchPayouts();
  };

  const handleApprove = (payoutId) => approvePayout(payoutId);
  const handleReject = (payoutId) => rejectPayout(payoutId);
  const handleRetry = (payoutId) => retryPayout(payoutId);

  const isMutating = isApproving || isRejecting || isRetrying;

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
          <MetricCard
            label="Revenue"
            value={isLoadingSummary ? "..." : formatPrice(summary.revenue)}
            hint="Gross platform volume"
          />
          <MetricCard
            label="Fees"
            value={isLoadingSummary ? "..." : formatPrice(summary.fees)}
            hint="Platform earnings"
          />
          <MetricCard
            label="Pending Payouts"
            value={isLoadingSummary ? "..." : summary.pendingPayouts}
            hint="Awaiting settlement"
          />
          <MetricCard
            label="Failed Payouts"
            value={isLoadingSummary ? "..." : summary.failedPayouts}
            hint="Needs retry/action"
          />
        </div>

        <div className="rounded-xl border border-divider/30 bg-main/20 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-onNeutralBg">Payout Operations</h3>
            <Button variant="outlined" className="rounded-lg" onClick={handleRefresh}>
              <div className="flex items-center gap-2">
                <Icon name="IoSync" size={16} />
                <span>Refresh</span>
              </div>
            </Button>
          </div>

          {isSummaryError && (
            <p className="mt-2 text-sm text-red-500">Could not load finance summary.</p>
          )}

          {isPayoutsError ? (
            <p className="mt-3 text-sm text-red-500">Could not load payouts list.</p>
          ) : isLoadingPayouts ? (
            <p className="mt-3 text-sm text-secondary">Loading payouts...</p>
          ) : payouts.length === 0 ? (
            <p className="mt-3 text-sm text-secondary">No payout requests found.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {payouts.map((item, index) => {
                const payoutId = item?.id || item?.payoutId || item?._id || `payout-${index}`;
                const amount = Number(item?.amount ?? item?.requestedAmount ?? 0);
                const status = item?.status || "Unknown";
                const merchantName =
                  item?.merchantName || item?.storeName || item?.requestedBy || "Unknown";
                const createdAt = item?.createdAt || item?.requestedAt || item?.date;

                return (
                  <div
                    key={payoutId}
                    className="rounded-lg border border-divider/30 bg-card p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-onNeutralBg">Request #{payoutId}</p>
                        <p className="text-xs text-secondary">Merchant: {merchantName}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-onNeutralBg">{formatPrice(amount)}</p>
                        <p className="text-xs text-secondary">{formatDate(createdAt)}</p>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-secondary">Status: {status}</p>
                      <div className="flex flex-wrap gap-2">
                        {canApprove(status) && (
                          <Button
                            label={isMutating ? "Please wait..." : "Approve"}
                            variant="outlined"
                            className="rounded-lg"
                            onClick={() => handleApprove(payoutId)}
                            disabled={isMutating}
                          />
                        )}
                        {canReject(status) && (
                          <Button
                            label={isMutating ? "Please wait..." : "Reject"}
                            variant="outlined"
                            className="rounded-lg"
                            onClick={() => handleReject(payoutId)}
                            disabled={isMutating}
                          />
                        )}
                        {canRetry(status) && (
                          <Button
                            label={isMutating ? "Please wait..." : "Retry"}
                            variant="outlined"
                            className="rounded-lg"
                            onClick={() => handleRetry(payoutId)}
                            disabled={isMutating}
                          />
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