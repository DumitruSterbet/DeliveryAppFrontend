import { Navigate } from "react-router-dom";

import { useCurrentUser } from "@/lib/store";

export default function CourierPageTemplate({ title, description, children }) {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  if (!isLoaded) {
    return (
      <section className="courier_page">
        <div className="py-12 text-center text-secondary">Loading...</div>
      </section>
    );
  }

  if (!user || user.role !== "Courier") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <section className="courier_page space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-onNeutralBg">{title}</h2>
        <p className="text-secondary">{description}</p>
      </div>

      <div className="rounded-xl border border-divider/30 bg-card p-6">{children}</div>
    </section>
  );
}
