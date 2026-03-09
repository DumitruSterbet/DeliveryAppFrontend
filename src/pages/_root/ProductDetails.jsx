import { useParams } from "react-router-dom";

import { Title } from "@/components";

export default function ProductDetails() {
  const { id } = useParams();

  return (
    <section className="product_details_page space-y-6">
      <Title
        name="Product Details"
        desc="View full product information, pricing, and purchase options."
        type="large"
      />

      <div className="rounded-xl border border-divider/30 bg-card p-6 space-y-2">
        <p className="text-onNeutralBg font-medium">Product ID: {id || "N/A"}</p>
        <p className="text-secondary">
          Detailed product page route is ready. Connect this page to a product details endpoint when available.
        </p>
      </div>
    </section>
  );
}
