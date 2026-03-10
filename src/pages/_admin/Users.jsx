import { Navigate } from "react-router-dom";

import { Title } from "@/components";
import { useCurrentUser } from "@/lib/store";

export default function Users() {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  if (!isLoaded) {
    return (
      <section className="admin_users_page">
        <div className="py-12 text-center text-secondary">Loading users...</div>
      </section>
    );
  }

  if (!user || user.role !== "Administrator") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <section className="admin_users_page">
      <Title
        name="Users"
        desc="Manage customer, merchant, courier, and administrator accounts."
        type="large"
      />

      <div className="mt-6 rounded-xl border border-divider/30 bg-card p-6 text-onNeutralBg">
        <p className="text-secondary">Users management UI scaffold is ready for integration.</p>
      </div>
    </section>
  );
}