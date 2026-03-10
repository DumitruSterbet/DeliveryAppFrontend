import AdminUsersManager from "./AdminUsersManager";

export default function Merchants() {
  return (
    <AdminUsersManager
      pageClassName="admin_merchants_page"
      title="Merchants"
      description="Manage merchant accounts, approvals, and access state."
      roleFilter="Merchant"
      lockCreateRole={true}
      overviewVariant="merchants"
      integrationTitle="Next Integration"
      integrationDescription="Connect merchant approval workflow, suspension reasons, and compliance checks."
      integrationActions={[
        { label: "Open Stores Catalog", to: "/shop" },
        { label: "View Platform Analytics", to: "/admin/analytics" },
      ]}
    />
  );
}
