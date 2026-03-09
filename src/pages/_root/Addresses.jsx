import { Title } from "@/components";

export default function Addresses() {
  return (
    <section className="addresses_page space-y-6">
      <Title
        name="My Addresses"
        desc="Manage saved delivery addresses for faster checkout."
        type="large"
      />

      <div className="rounded-xl border border-divider/30 bg-card p-6">
        <p className="text-secondary">
          Address management page is added. You can connect CRUD endpoints for saved addresses next.
        </p>
      </div>
    </section>
  );
}
