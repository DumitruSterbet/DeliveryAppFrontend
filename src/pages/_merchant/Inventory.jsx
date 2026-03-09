import MerchantPageTemplate from "./MerchantPageTemplate";

export default function Inventory() {
  return (
    <MerchantPageTemplate
      title="Inventory"
      description="Track stock levels, adjustments, and low-stock products."
    >
      <p className="text-secondary">
        Inventory management page is ready. Next step is connecting stock movements and reorder alerts.
      </p>
    </MerchantPageTemplate>
  );
}
