import { Navigate } from "react-router-dom";

import { Title } from "@/components";
import { useCurrentUser } from "@/lib/store";

export default function Analytics() {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  if (!isLoaded) {
    return (
      <section className="admin_analytics_page">
        <div className="py-12 text-center text-secondary">Loading analytics...</div>
      </section>
    );
  }

  if (!user || user.role !== "Administrator") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <section className="admin_analytics_page">
      <Title
        name="Analytics"
        desc="Track platform trends, engagement, and operational performance."
        type="large"
      />

      <div className="mt-6 rounded-xl border border-divider/30 bg-card p-6 text-onNeutralBg">
        <p className="text-secondary">Analytics dashboard scaffold is ready for charts and KPIs.</p>
      </div>
    </section>
  );
}