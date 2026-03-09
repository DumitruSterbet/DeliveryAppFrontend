import { useParams } from "react-router-dom";

import CourierPageTemplate from "./CourierPageTemplate";

export default function DeliveryDetails() {
  const { id } = useParams();

  return (
    <CourierPageTemplate
      title="Delivery Details"
      description="View customer location, delivery notes, and status workflow."
    >
      <div className="space-y-2 text-sm">
        <p className="text-onNeutralBg font-medium">Delivery ID: {id}</p>
        <p className="text-secondary">Customer: Pending backend integration</p>
        <p className="text-secondary">Address: Pending backend integration</p>
        <p className="text-secondary">Order items: Pending backend integration</p>
      </div>
    </CourierPageTemplate>
  );
}
