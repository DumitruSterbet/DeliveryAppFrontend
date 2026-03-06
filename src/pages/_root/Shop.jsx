import { useCourierTrackingSignalR } from "@/hooks";
import { Sections } from "@/components";

export default function Shop() {
  const {
    couriers: nearestCouriers,
    isLoading: isNearestCouriersPending,
    error: couriersError,
    refresh: refetchCouriers,
  } = useCourierTrackingSignalR({
    enabled: true,
  });

  return (
    <section className="shop_page">
      <div className="flex flex-col gap-y-8">
        <Sections.CourierSection
          couriers={nearestCouriers}
          isLoading={isNearestCouriersPending}
          error={couriersError || null}
          onRefresh={refetchCouriers}
          className="mb-8"
        />
      </div>
    </section>
  );
}