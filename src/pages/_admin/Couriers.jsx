import AdminUsersManager from "./AdminUsersManager";

export default function Couriers() {
  return (
    <AdminUsersManager
      pageClassName="admin_couriers_page"
      title="Couriers"
      description="Manage courier accounts, verification flow, and lock status."
      roleFilter="Courier"
      lockCreateRole={true}
      overviewVariant="couriers"
      integrationTitle="Next Integration"
      integrationDescription="Add admin courier endpoints for assignment controls, audits, and account actions."
      integrationActions={[
        { label: "Open Courier Deliveries", to: "/courier/deliveries" },
        { label: "Review Orders Queue", to: "/admin/orders" },
      ]}
    />
  );
}
