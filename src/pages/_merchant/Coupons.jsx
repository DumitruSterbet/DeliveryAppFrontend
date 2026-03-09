import { useMemo, useState } from "react";

import { Button } from "@/components";
import {
  useFetchCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
  useToggleCoupon,
} from "@/lib/actions";

import MerchantPageTemplate from "./MerchantPageTemplate";

const defaultForm = {
  code: "",
  discountType: "Percent",
  discountValue: "",
  minOrderAmount: "",
  startsAt: "",
  endsAt: "",
};

const asArray = (payload, fallbackKey) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.[fallbackKey])) return payload[fallbackKey];
  return [];
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

const normalizeCoupon = (coupon) => ({
  id: coupon?.id || coupon?.couponId || coupon?.code,
  code: coupon?.code || "-",
  discountType: coupon?.discountType || coupon?.type || "Percent",
  discountValue: Number(coupon?.discountValue ?? coupon?.value ?? 0),
  minOrderAmount: Number(coupon?.minOrderAmount ?? coupon?.minPurchaseAmount ?? 0),
  startsAt: coupon?.startsAt || coupon?.startDate || coupon?.validFrom || null,
  endsAt: coupon?.endsAt || coupon?.endDate || coupon?.validTo || null,
  isActive: Boolean(coupon?.isActive ?? coupon?.active ?? true),
});

export default function Coupons() {
  const [createForm, setCreateForm] = useState(defaultForm);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [editForm, setEditForm] = useState(defaultForm);

  const {
    data: couponsData,
    isLoading: isLoadingCoupons,
    isError: isCouponsError,
    refetch: refetchCoupons,
  } = useFetchCoupons();

  const { mutate: createCoupon, isPending: isCreatingCoupon } = useCreateCoupon();
  const { mutate: updateCoupon, isPending: isUpdatingCoupon } = useUpdateCoupon();
  const { mutate: deleteCoupon, isPending: isDeletingCoupon } = useDeleteCoupon();
  const { mutate: toggleCoupon, isPending: isTogglingCoupon } = useToggleCoupon();

  const coupons = useMemo(
    () => asArray(couponsData, "coupons").map(normalizeCoupon),
    [couponsData]
  );

  const buildPayload = (form) => ({
    code: form.code?.trim(),
    discountType: form.discountType,
    discountValue: Number(form.discountValue || 0),
    minOrderAmount: Number(form.minOrderAmount || 0),
    startsAt: form.startsAt || null,
    endsAt: form.endsAt || null,
  });

  const onCreate = () => {
    createCoupon(buildPayload(createForm), {
      onSuccess: () => {
        setCreateForm(defaultForm);
      },
    });
  };

  const onStartEdit = (coupon) => {
    setEditingCouponId(coupon.id);
    setEditForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderAmount: String(coupon.minOrderAmount),
      startsAt: coupon.startsAt ? String(coupon.startsAt).slice(0, 10) : "",
      endsAt: coupon.endsAt ? String(coupon.endsAt).slice(0, 10) : "",
    });
  };

  const onSaveEdit = () => {
    updateCoupon({
      couponId: editingCouponId,
      payload: buildPayload(editForm),
    });
    setEditingCouponId(null);
  };

  return (
    <MerchantPageTemplate
      title="Coupons"
      description="Create, update, and manage active discount coupons."
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
          <h3 className="text-lg font-semibold text-onNeutralBg">Create Coupon</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              type="text"
              value={createForm.code}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, code: event.target.value }))
              }
              placeholder="Coupon code"
              className="rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
            />

            <select
              value={createForm.discountType}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, discountType: event.target.value }))
              }
              className="rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
            >
              <option value="Percent">Percent</option>
              <option value="Fixed">Fixed</option>
            </select>

            <input
              type="number"
              min="0"
              step="0.01"
              value={createForm.discountValue}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, discountValue: event.target.value }))
              }
              placeholder="Discount value"
              className="rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
            />

            <input
              type="number"
              min="0"
              step="0.01"
              value={createForm.minOrderAmount}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, minOrderAmount: event.target.value }))
              }
              placeholder="Min order amount"
              className="rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
            />

            <input
              type="date"
              value={createForm.startsAt}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, startsAt: event.target.value }))
              }
              className="rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
            />

            <input
              type="date"
              value={createForm.endsAt}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, endsAt: event.target.value }))
              }
              className="rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
            />
          </div>

          <div className="mt-3">
            <Button
              label={isCreatingCoupon ? "Creating..." : "Create Coupon"}
              variant="contained"
              className="rounded-lg"
              onClick={onCreate}
              disabled={isCreatingCoupon}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-secondary">
            {isLoadingCoupons ? "Loading coupons..." : `${coupons.length} coupons found`}
          </p>
          <Button
            label="Refresh"
            variant="outlined"
            className="rounded-lg border-divider/50"
            onClick={refetchCoupons}
          />
        </div>

        {isCouponsError ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500">
            Failed to load coupons.
          </div>
        ) : coupons.length === 0 && !isLoadingCoupons ? (
          <div className="rounded-xl border border-divider/30 bg-main/20 p-6 text-center text-secondary">
            No coupons yet.
          </div>
        ) : (
          <div className="space-y-3">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="rounded-xl border border-divider/30 bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-onNeutralBg">{coupon.code}</h4>
                    <p className="text-xs text-secondary">
                      {coupon.discountType} • {coupon.discountValue}
                    </p>
                    <p className="text-xs text-secondary">
                      Min: {coupon.minOrderAmount} • {formatDate(coupon.startsAt)} - {formatDate(coupon.endsAt)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      coupon.isActive
                        ? "border border-green-500/30 bg-green-500/10 text-green-500"
                        : "border border-red-500/30 bg-red-500/10 text-red-500"
                    }`}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    label="Edit"
                    variant="outlined"
                    className="rounded-lg border-divider/50"
                    onClick={() => onStartEdit(coupon)}
                  />
                  <Button
                    label={isTogglingCoupon ? "Toggling..." : coupon.isActive ? "Deactivate" : "Activate"}
                    variant="outlined"
                    className="rounded-lg border-divider/50"
                    onClick={() => toggleCoupon(coupon.id)}
                    disabled={isTogglingCoupon}
                  />
                  <Button
                    label={isDeletingCoupon ? "Deleting..." : "Delete"}
                    variant="outlined"
                    className="rounded-lg border-red-500 text-red-500"
                    onClick={() => deleteCoupon(coupon.id)}
                    disabled={isDeletingCoupon}
                  />
                </div>

                {editingCouponId === coupon.id ? (
                  <div className="mt-3 grid grid-cols-1 gap-2 rounded-lg border border-divider/30 bg-main/20 p-3 md:grid-cols-3">
                    <input
                      type="text"
                      value={editForm.code}
                      onChange={(event) =>
                        setEditForm((prev) => ({ ...prev, code: event.target.value }))
                      }
                      placeholder="Coupon code"
                      className="rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
                    />

                    <select
                      value={editForm.discountType}
                      onChange={(event) =>
                        setEditForm((prev) => ({ ...prev, discountType: event.target.value }))
                      }
                      className="rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
                    >
                      <option value="Percent">Percent</option>
                      <option value="Fixed">Fixed</option>
                    </select>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.discountValue}
                      onChange={(event) =>
                        setEditForm((prev) => ({ ...prev, discountValue: event.target.value }))
                      }
                      placeholder="Discount value"
                      className="rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.minOrderAmount}
                      onChange={(event) =>
                        setEditForm((prev) => ({ ...prev, minOrderAmount: event.target.value }))
                      }
                      placeholder="Min order"
                      className="rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
                    />

                    <input
                      type="date"
                      value={editForm.startsAt}
                      onChange={(event) =>
                        setEditForm((prev) => ({ ...prev, startsAt: event.target.value }))
                      }
                      className="rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
                    />

                    <input
                      type="date"
                      value={editForm.endsAt}
                      onChange={(event) =>
                        setEditForm((prev) => ({ ...prev, endsAt: event.target.value }))
                      }
                      className="rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
                    />

                    <div className="md:col-span-3 flex gap-2">
                      <Button
                        label={isUpdatingCoupon ? "Saving..." : "Save Changes"}
                        variant="contained"
                        className="rounded-lg"
                        onClick={onSaveEdit}
                        disabled={isUpdatingCoupon}
                      />
                      <Button
                        label="Cancel"
                        variant="outlined"
                        className="rounded-lg border-divider/50"
                        onClick={() => setEditingCouponId(null)}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </MerchantPageTemplate>
  );
}
