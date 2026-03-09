import { useMemo, useState } from "react";

import { Button, Icon } from "@/components";
import {
  useFetchPayoutSummary,
  useFetchPayoutHistory,
  useRequestPayout,
} from "@/lib/actions";
import { formatPrice } from "@/lib/utils";

import MerchantPageTemplate from "./MerchantPageTemplate";

const asArray = (payload, fallbackKey) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.[fallbackKey])) return payload[fallbackKey];
  return [];
};

const asNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
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

const SummaryCard = ({ label, value, hint, icon }) => (
  <div className="rounded-xl border border-divider/30 bg-card p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wider text-secondary">{label}</p>
        <p className="mt-2 text-xl font-semibold text-onNeutralBg">{value}</p>
        {hint ? <p className="mt-1 text-xs text-secondary">{hint}</p> : null}
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
        <Icon name={icon} size={16} className="text-primary" />
      </div>
    </div>
  </div>
);

export default function Payouts() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useFetchPayoutSummary();

  const {
    data: historyData,
    isLoading: isLoadingHistory,
    isError: isHistoryError,
    refetch: refetchHistory,
  } = useFetchPayoutHistory();

  const { mutate: requestPayout, isPending: isRequestingPayout } = useRequestPayout();

  const history = useMemo(() => asArray(historyData, "history"), [historyData]);

  const summary = useMemo(() => {
    const source = summaryData || {};

    return {
      availableBalance: asNumber(
        source?.availableBalance ?? source?.available ?? source?.balance
      ),
      pendingAmount: asNumber(source?.pendingAmount ?? source?.pending),
      totalPaidOut: asNumber(source?.totalPaidOut ?? source?.paidOut ?? source?.totalPaid),
      requestsCount: asNumber(
        source?.requestsCount ?? source?.requestCount ?? source?.totalRequests
      ),
    };
  }, [summaryData]);

  const handleRefresh = () => {
    refetchSummary();
    refetchHistory();
  };

  const handleRequestPayout = () => {
    requestPayout(
      {
        amount,
        note,
      },
      {
        onSuccess: () => {
          setAmount("");
          setNote("");
        },
      }
    );
  };

  return (
    <MerchantPageTemplate
      title="Payouts"
      description="View payout summary, payout history, and request new payouts."
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-secondary">
            {isLoadingSummary ? "Loading payout summary..." : "Payout overview"}
          </p>
          <Button
            label="Refresh"
            variant="outlined"
            className="rounded-lg border-divider/50"
            onClick={handleRefresh}
          />
        </div>

        {isSummaryError ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500">
            Failed to load payout summary.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Available"
              value={isLoadingSummary ? "..." : formatPrice(summary.availableBalance)}
              hint="Amount ready for payout"
              icon="BsBasket"
            />
            <SummaryCard
              label="Pending"
              value={isLoadingSummary ? "..." : formatPrice(summary.pendingAmount)}
              hint="In-progress requests"
              icon="BiTimeFive"
            />
            <SummaryCard
              label="Paid Out"
              value={isLoadingSummary ? "..." : formatPrice(summary.totalPaidOut)}
              hint="Total settled payouts"
              icon="BiCheckCircle"
            />
            <SummaryCard
              label="Requests"
              value={isLoadingSummary ? "..." : summary.requestsCount}
              hint="All payout requests"
              icon="BsReceipt"
            />
          </div>
        )}

        <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
          <h3 className="text-lg font-semibold text-onNeutralBg">Request Payout</h3>
          <p className="mt-1 text-sm text-secondary">
            Submit a payout request to transfer available balance.
          </p>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-secondary">
                Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs uppercase tracking-wider text-secondary">
                Note (optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Short note for this request"
                className="w-full rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
              />
            </div>
          </div>

          <div className="mt-3">
            <Button
              label={isRequestingPayout ? "Submitting..." : "Submit Request"}
              variant="contained"
              className="rounded-lg"
              onClick={handleRequestPayout}
              disabled={isRequestingPayout}
            />
          </div>
        </div>

        <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
          <h3 className="text-lg font-semibold text-onNeutralBg">Payout History</h3>

          {isHistoryError ? (
            <p className="mt-2 text-sm text-red-500">Failed to load payout history.</p>
          ) : isLoadingHistory ? (
            <p className="mt-2 text-sm text-secondary">Loading payout history...</p>
          ) : history.length === 0 ? (
            <p className="mt-2 text-sm text-secondary">No payout requests yet.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {history.map((item, index) => {
                const payoutId = item?.id || item?.requestId || `payout-${index}`;
                const payoutAmount = asNumber(item?.amount ?? item?.requestedAmount ?? 0);
                const payoutStatus = item?.status || "Unknown";
                const payoutDate = item?.requestedAt || item?.createdAt || item?.date;

                return (
                  <div
                    key={payoutId}
                    className="rounded-lg border border-divider/30 bg-card p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-onNeutralBg">Request #{payoutId}</p>
                      <span className="text-xs text-secondary">{payoutStatus}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-secondary">{formatDate(payoutDate)}</span>
                      <span className="font-medium text-onNeutralBg">{formatPrice(payoutAmount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MerchantPageTemplate>
  );
}
