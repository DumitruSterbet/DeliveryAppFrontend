import { useState } from "react";

import { Button } from "@/components";

import CourierPageTemplate from "./CourierPageTemplate";

export default function Availability() {
  const [online, setOnline] = useState(true);

  return (
    <CourierPageTemplate
      title="Availability"
      description="Control your courier online status and receive delivery assignments."
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
          <p className="text-sm text-secondary">Current Status</p>
          <p className={`mt-1 text-lg font-semibold ${online ? "text-green-500" : "text-red-500"}`}>
            {online ? "Online" : "Offline"}
          </p>
        </div>

        <Button
          label={online ? "Go Offline" : "Go Online"}
          variant={online ? "outlined" : "contained"}
          onClick={() => setOnline((state) => !state)}
        />
      </div>
    </CourierPageTemplate>
  );
}
