import { useMemo, useState } from "react";

import { Button, Icon } from "@/components";
import {
  useFetchStoreCustomers,
  useFetchStoreCustomerDetails,
} from "@/lib/actions";
import { formatPrice } from "@/lib/utils";

import MerchantPageTemplate from "./MerchantPageTemplate";

const asArray = (payload, fallbackKey) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.[fallbackKey])) return payload[fallbackKey];
  return [];
};

const getCustomerId = (customer) =>
  customer?.customerId || customer?.id || customer?.userId || customer?.email;

const getCustomerName = (customer) =>
  customer?.customerName || customer?.name || customer?.username || customer?.email || "Customer";

const getOrderCount = (customer) =>
  Number(customer?.orderCount ?? customer?.ordersCount ?? customer?.totalOrders ?? 0);

const getTotalSpent = (customer) =>
  Number(customer?.totalSpent ?? customer?.spent ?? customer?.totalAmount ?? 0);

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

export default function Customers() {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const {
    data: customersData,
    isLoading: isLoadingCustomers,
    isError: isCustomersError,
    refetch: refetchCustomers,
  } = useFetchStoreCustomers();

  const customers = useMemo(() => asArray(customersData, "customers"), [customersData]);

  const {
    data: selectedCustomerData,
    isLoading: isLoadingCustomerDetail,
    isError: isCustomerDetailError,
    refetch: refetchCustomerDetail,
  } = useFetchStoreCustomerDetails({
    customerId: selectedCustomerId,
    enabled: Boolean(selectedCustomerId),
  });

  const selectedCustomer = selectedCustomerData?.customer || selectedCustomerData || null;
  const recentOrders = useMemo(
    () => asArray(selectedCustomerData?.recentOrders || selectedCustomerData, "orders").slice(0, 10),
    [selectedCustomerData]
  );

  const refreshAll = () => {
    refetchCustomers();
    if (selectedCustomerId) {
      refetchCustomerDetail();
    }
  };

  return (
    <MerchantPageTemplate
      title="Customers"
      description="View customer list with order totals and last purchase date."
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-secondary">
            {isLoadingCustomers ? "Loading customers..." : `${customers.length} customers found`}
          </p>
          <Button
            variant="outlined"
            className="rounded-lg border-divider/50"
            onClick={refreshAll}
          >
            <div className="flex items-center gap-2">
              <Icon name="BiRefresh" size={16} />
              <span>Refresh</span>
            </div>
          </Button>
        </div>

        {isCustomersError ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500">
            Failed to load store customers.
          </div>
        ) : customers.length === 0 && !isLoadingCustomers ? (
          <div className="rounded-xl border border-divider/30 bg-main/20 p-6 text-center text-secondary">
            No customers yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="space-y-3">
              {customers.map((customer) => {
                const customerId = getCustomerId(customer);
                const isActive = customerId === selectedCustomerId;

                return (
                  <button
                    key={customerId}
                    type="button"
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      isActive
                        ? "border-primary/40 bg-primary/5"
                        : "border-divider/30 bg-card hover:border-primary/20"
                    }`}
                    onClick={() => setSelectedCustomerId(customerId)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-onNeutralBg">{getCustomerName(customer)}</h4>
                        <p className="text-xs text-secondary">{customer?.email || "No email"}</p>
                      </div>
                      <Icon name="BiUser" size={18} className="text-secondary" />
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-secondary">Orders</p>
                        <p className="font-medium text-onNeutralBg">{getOrderCount(customer)}</p>
                      </div>
                      <div>
                        <p className="text-secondary">Spent</p>
                        <p className="font-medium text-onNeutralBg">{formatPrice(getTotalSpent(customer))}</p>
                      </div>
                      <div>
                        <p className="text-secondary">Last Order</p>
                        <p className="font-medium text-onNeutralBg">
                          {formatDate(
                            customer?.lastOrderDate || customer?.lastOrderedAt || customer?.updatedAt
                          )}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
              {!selectedCustomerId ? (
                <p className="text-sm text-secondary">Select a customer to view details and recent orders.</p>
              ) : isLoadingCustomerDetail ? (
                <p className="text-sm text-secondary">Loading customer detail...</p>
              ) : isCustomerDetailError ? (
                <p className="text-sm text-red-500">Could not load customer details.</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-onNeutralBg">
                      {getCustomerName(selectedCustomer)}
                    </h3>
                    <p className="text-sm text-secondary">{selectedCustomer?.email || "No email"}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-lg border border-divider/30 bg-card p-3 text-xs">
                    <div>
                      <p className="text-secondary">Orders</p>
                      <p className="font-medium text-onNeutralBg">{getOrderCount(selectedCustomer)}</p>
                    </div>
                    <div>
                      <p className="text-secondary">Total Spent</p>
                      <p className="font-medium text-onNeutralBg">
                        {formatPrice(getTotalSpent(selectedCustomer))}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary">Last Order</p>
                      <p className="font-medium text-onNeutralBg">
                        {formatDate(
                          selectedCustomer?.lastOrderDate ||
                            selectedCustomer?.lastOrderedAt ||
                            selectedCustomer?.updatedAt
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-onNeutralBg">Recent Orders</h4>
                    {recentOrders.length === 0 ? (
                      <p className="mt-2 text-sm text-secondary">No recent orders found for this customer.</p>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {recentOrders.map((order, index) => {
                          const orderId = order?.orderNumber || order?.id || `order-${index}`;
                          const amount =
                            Number(order?.totalAmount ?? order?.amount ?? order?.total ?? 0) || 0;
                          const status = order?.status || "Unknown";

                          return (
                            <div
                              key={orderId}
                              className="rounded-lg border border-divider/30 bg-card p-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-onNeutralBg">Order #{orderId}</p>
                                <span className="text-xs text-secondary">{status}</span>
                              </div>
                              <div className="mt-1 flex items-center justify-between text-xs">
                                <span className="text-secondary">{formatDate(order?.createdAt || order?.date)}</span>
                                <span className="font-medium text-onNeutralBg">{formatPrice(amount)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MerchantPageTemplate>
  );
}
