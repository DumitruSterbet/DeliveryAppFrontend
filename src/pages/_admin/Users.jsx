import AdminUsersManager from "./AdminUsersManager";

export default function Users() {
  return (
    <AdminUsersManager
      pageClassName="admin_users_page"
      title="Users"
      description="Manage customer accounts and account access."
      roleFilter="Customer"
      lockCreateRole={true}
      overviewVariant="users"
      integrationTitle="Next Integration"
      integrationDescription="Add customer verification, KYC checks, and support-risk flags for account reviews."
      integrationActions={[
        { label: "Open Analytics", to: "/admin/analytics" },
        { label: "Open Orders", to: "/admin/orders" },
      ]}
    />
  );
}
