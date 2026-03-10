import { Navigate } from "react-router-dom";

import { Title } from "@/components";
import { useCurrentUser } from "@/lib/store";

export default function Dashboard() {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  if (!isLoaded) {
    return (
      <section className="admin_dashboard_page">
        <div className="py-12 text-center text-secondary">Loading dashboard...</div>
      </section>
    );
  }

  if (!user || user.role !== "Administrator") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <section className="admin_dashboard_page">
      <Title
        name="Admin Dashboard"
        desc="Monitor platform health and navigate core administration tools."
        type="large"
      />

      <div className="mt-6 rounded-xl border border-divider/30 bg-card p-6 text-onNeutralBg">
        <h3 className="text-lg font-semibold">Welcome, Administrator</h3>
        <p className="mt-2 text-secondary">
          Use the sidebar to manage users, categories, and analytics.
        </p>
      </div>
    </section>
  );
}