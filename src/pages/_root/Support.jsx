import { useNavigate } from "react-router-dom";

import { Button, Title } from "@/components";

export default function Support() {
  const navigate = useNavigate();

  return (
    <section className="support_page space-y-6">
      <Title
        name="Support"
        desc="Get help with orders, deliveries, payments, and account issues."
        type="large"
      />

      <div className="rounded-xl border border-divider/30 bg-card p-6 space-y-3">
        <p className="text-secondary">Need help? Use our support contact channels.</p>
        <div className="flex flex-wrap gap-3">
          <Button label="Contact Us" variant="contained" onClick={() => navigate("/contact")} />
          <Button label="View Legal" variant="outlined" onClick={() => navigate("/legal")} />
          <Button label="View Policy" variant="outlined" onClick={() => navigate("/policy")} />
        </div>
      </div>
    </section>
  );
}
