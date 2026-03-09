import MerchantPageTemplate from "./MerchantPageTemplate";

export default function Customers() {
  return (
    <MerchantPageTemplate
      title="Customers"
      description="View customer list and recent buying activity."
    >
      <p className="text-secondary">
        Customers page is ready. You can connect customer profiles and order history next.
      </p>
    </MerchantPageTemplate>
  );
}
