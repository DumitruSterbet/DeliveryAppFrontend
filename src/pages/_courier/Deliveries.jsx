import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components";

import CourierPageTemplate from "./CourierPageTemplate";

export default function Deliveries() {
  const navigate = useNavigate();

  const deliveries = useMemo(
    () => [
      { id: "1001", customer: "John K.", address: "Downtown Ave 19", status: "Assigned" },
      { id: "1002", customer: "Emma R.", address: "West Market 2", status: "Picked Up" },
      { id: "1003", customer: "Ali M.", address: "River Street 47", status: "On The Way" },
    ],
    []
  );

  return (
    <CourierPageTemplate
      title="Deliveries"
      description="Manage assigned deliveries and open each delivery detail."
    >
      <div className="space-y-3">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="rounded-xl border border-divider/30 bg-main/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-onNeutralBg">Order #{delivery.id}</p>
                <p className="text-sm text-secondary">{delivery.customer} • {delivery.address}</p>
                <p className="text-xs text-secondary">Status: {delivery.status}</p>
              </div>
              <Button
                label="Open"
                variant="outlined"
                onClick={() => navigate(`/courier/deliveries/${delivery.id}`)}
              />
            </div>
          </div>
        ))}
      </div>
    </CourierPageTemplate>
  );
}
