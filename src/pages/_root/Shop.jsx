import { useFetchNearestCouriers } from "@/lib/actions";
import { Sections } from "@/components";

export default function Shop() {
  const {
    data: nearestCouriersData,
    isPending: isNearestCouriersPending,
    isError: isNearestCouriersError,
    refetch: refetchCouriers,
  } = useFetchNearestCouriers({
    enabled: true,
  });
  const nearestCouriers = nearestCouriersData?.data || [];

  return (
    <section className="shop_page">
      <div className="flex flex-col gap-y-8">
        <Sections.CourierSection
          couriers={nearestCouriers}
          isLoading={isNearestCouriersPending}
          error={isNearestCouriersError && 'Failed to load couriers'}
          onRefresh={refetchCouriers}
          className="mb-8"
        />
      </div>
    </section>
  );
}