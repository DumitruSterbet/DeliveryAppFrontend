import MerchantPageTemplate from "./MerchantPageTemplate";

export default function Shipping() {
  return (
    <MerchantPageTemplate
      title="Shipping"
      description="Configure courier availability, delivery zones, and shipping options."
    >
      <p className="text-secondary">
        Shipping page is ready. You can connect courier APIs and delivery rules next.
      </p>
    </MerchantPageTemplate>
  );
}
