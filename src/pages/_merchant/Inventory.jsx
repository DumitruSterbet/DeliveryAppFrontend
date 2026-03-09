import { useMemo, useState } from "react";

import { Button, Icon } from "@/components";
import {
  useFetchInventory,
  useFetchLowStockInventory,
  useAdjustInventory,
  useUpdateInventoryThreshold,
} from "@/lib/actions";

import MerchantPageTemplate from "./MerchantPageTemplate";

const asArray = (payload, fallbackKey) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.[fallbackKey])) return payload[fallbackKey];
  return [];
};

const getItemName = (item) =>
  item?.productName || item?.name || item?.title || `Product ${item?.productId || "N/A"}`;

const getStock = (item) => Number(item?.stock ?? item?.quantity ?? item?.currentStock ?? 0);

const getThreshold = (item) =>
  Number(item?.threshold ?? item?.lowStockThreshold ?? item?.reorderLevel ?? 0);

export default function Inventory() {
  const [adjustValues, setAdjustValues] = useState({});
  const [thresholdValues, setThresholdValues] = useState({});

  const {
    data: inventoryData,
    isLoading: isLoadingInventory,
    isError: isInventoryError,
    refetch: refetchInventory,
  } = useFetchInventory();

  const {
    data: lowStockData,
    isLoading: isLoadingLowStock,
    isError: isLowStockError,
    refetch: refetchLowStock,
  } = useFetchLowStockInventory();

  const { mutate: adjustInventory, isPending: isAdjusting } = useAdjustInventory();
  const { mutate: updateThreshold, isPending: isUpdatingThreshold } =
    useUpdateInventoryThreshold();

  const inventoryItems = useMemo(() => asArray(inventoryData, "items"), [inventoryData]);
  const lowStockItems = useMemo(() => asArray(lowStockData, "items"), [lowStockData]);

  const handleRefresh = () => {
    refetchInventory();
    refetchLowStock();
  };

  const handleAdjust = (productId) => {
    const amount = adjustValues[productId];
    adjustInventory(
      {
        productId,
        amount,
        reason: "Merchant dashboard adjustment",
      },
      {
        onSuccess: () => {
          setAdjustValues((prev) => ({ ...prev, [productId]: "" }));
        },
      }
    );
  };

  const handleThresholdUpdate = (productId) => {
    const threshold = thresholdValues[productId];
    updateThreshold(
      {
        productId,
        threshold,
      },
      {
        onSuccess: () => {
          setThresholdValues((prev) => ({ ...prev, [productId]: "" }));
        },
      }
    );
  };

  return (
    <MerchantPageTemplate
      title="Inventory"
      description="Track stock levels, low-stock alerts, and update product inventory controls."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-secondary">
            {isLoadingInventory ? "Loading inventory..." : `${inventoryItems.length} products found`}
          </div>
          <Button
            variant="outlined"
            className="rounded-lg border-divider/50"
            onClick={handleRefresh}
          >
            <div className="flex items-center gap-2">
              <Icon name="BiRefresh" size={16} />
              <span>Refresh</span>
            </div>
          </Button>
        </div>

        <div className="rounded-xl border border-divider/30 bg-main/30 p-4">
          <h3 className="text-lg font-semibold text-onNeutralBg">Low Stock Alerts</h3>
          {isLoadingLowStock ? (
            <p className="mt-2 text-sm text-secondary">Loading low stock items...</p>
          ) : isLowStockError ? (
            <p className="mt-2 text-sm text-red-500">Could not fetch low stock items.</p>
          ) : lowStockItems.length === 0 ? (
            <p className="mt-2 text-sm text-secondary">No low stock products right now.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {lowStockItems.map((item) => {
                const productId = item?.productId || item?.id;
                return (
                  <span
                    key={productId}
                    className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-500"
                  >
                    <Icon name="BiError" size={14} />
                    {getItemName(item)} (stock: {getStock(item)})
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {isInventoryError ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500">
            Failed to load inventory list. Please refresh and try again.
          </div>
        ) : (
          <div className="space-y-3">
            {inventoryItems.map((item) => {
              const productId = item?.productId || item?.id;
              const stock = getStock(item);
              const threshold = getThreshold(item);

              return (
                <div
                  key={productId}
                  className="rounded-xl border border-divider/30 bg-card p-4"
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-onNeutralBg">{getItemName(item)}</h4>
                      <p className="text-xs text-secondary">Product ID: {productId}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-onNeutralBg">Stock: {stock}</span>
                      <span className="text-secondary">Threshold: {threshold}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div className="rounded-lg border border-divider/30 p-3">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-secondary">
                        Adjust Stock
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="number"
                          value={adjustValues[productId] ?? ""}
                          onChange={(event) =>
                            setAdjustValues((prev) => ({
                              ...prev,
                              [productId]: event.target.value,
                            }))
                          }
                          placeholder="e.g. 10 or -5"
                          className="w-40 rounded-lg border border-divider/40 bg-main px-3 py-2 text-sm text-onNeutralBg outline-none"
                        />
                        <Button
                          variant="contained"
                          className="rounded-lg"
                          onClick={() => handleAdjust(productId)}
                          disabled={isAdjusting}
                        >
                          <span>{isAdjusting ? "Updating..." : "Apply"}</span>
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-divider/30 p-3">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-secondary">
                        Update Threshold
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={thresholdValues[productId] ?? ""}
                          onChange={(event) =>
                            setThresholdValues((prev) => ({
                              ...prev,
                              [productId]: event.target.value,
                            }))
                          }
                          placeholder={`Current: ${threshold}`}
                          className="w-40 rounded-lg border border-divider/40 bg-main px-3 py-2 text-sm text-onNeutralBg outline-none"
                        />
                        <Button
                          variant="outlined"
                          className="rounded-lg border-divider/50"
                          onClick={() => handleThresholdUpdate(productId)}
                          disabled={isUpdatingThreshold}
                        >
                          <span>{isUpdatingThreshold ? "Saving..." : "Save"}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoadingInventory && inventoryItems.length === 0 && !isInventoryError ? (
          <div className="rounded-xl border border-divider/30 bg-main/20 p-6 text-center text-secondary">
            No inventory items found yet.
          </div>
        ) : null}
      </div>
    </MerchantPageTemplate>
  );
}
