import { useMemo } from "react";

import CourierPageTemplate from "./CourierPageTemplate";

export default function History() {
  const completed = useMemo(
    () => [
      { id: "H-901", date: "2026-03-08", amount: 8.5 },
      { id: "H-902", date: "2026-03-08", amount: 11.0 },
      { id: "H-903", date: "2026-03-07", amount: 9.25 },
    ],
    []
  );

  return (
    <CourierPageTemplate
      title="History"
      description="Review completed deliveries and recent courier activity."
    >
      <div className="space-y-2">
        {completed.map((item) => (
          <div key={item.id} className="rounded-lg border border-divider/30 bg-main/20 p-3 text-sm">
            <p className="text-onNeutralBg font-medium">Delivery {item.id}</p>
            <p className="text-secondary">Date: {item.date}</p>
            <p className="text-secondary">Earnings: ${item.amount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </CourierPageTemplate>
  );
}
