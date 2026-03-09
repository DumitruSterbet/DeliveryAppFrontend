import { Title } from "@/components";

export default function PaymentMethods() {
  return (
    <section className="payment_methods_page space-y-6">
      <Title
        name="Payment Methods"
        desc="Manage your saved cards and preferred payment options."
        type="large"
      />

      <div className="rounded-xl border border-divider/30 bg-card p-6">
        <p className="text-secondary">
          Payment methods page is added. Connect secure payment-method endpoints when ready.
        </p>
      </div>
    </section>
  );
}
