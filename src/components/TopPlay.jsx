import { useId, useMemo } from "react";

import { getRandomList, classNames } from "@/lib/utils";
import { useFetchChartBySection } from "@/lib/actions";

import { Sections, Footer } from "@/components";

const TopPlay = () => {
  const {
    data: tracks,
    isPending: chartsDataPending,
    isSuccess: chartsDataSuccess,
  } = useFetchChartBySection({
    id: "0",
    section: "tracks",
  });

  const topPickId = useId();

  const randomTopProducts = useMemo(() => {
    const topTracks = tracks?.data || [];
    return topTracks?.length
      ? getRandomList(topTracks, 5, 1, topTracks?.length)
      : [];
  }, [tracks?.data]);

  return (
    <section
      className={classNames(
        "top_products_section xl:fixed top-0 xl:h-screen xl:w-aside min-w-aside hidden-0 relative main_width xl:left-auto mb-[100px] xl:mb-0 h-auto p-3 sm:p-6 xl:p-0 xl:block right-0 overflow-auto"
      )}
    >
      <div className="w-full h-full bg-switch">
        
        <div className="sticky top-0 p-4 rounded bg-switch xl:rounded-none">
          <div className="top_products_content">
            <Sections.TrackSection
              data={randomTopProducts}
              details={{
                id: topPickId,
                type: "chart",
              }}
              disableHeader
              disableRowList={[
                "no",
                "album",
                "duration",
                "more_button",
                "like_button",
                "dateCreated",
              ]}
              imageDims="11"
              enableTitle
              titleName="Top Products"
              titleType="medium"
              titleDivider={false}
              isLoading={chartsDataPending}
              isSuccess={chartsDataSuccess}
            />
          </div>

          <Footer />
        </div>
      </div>
    </section>
  );
};

export default TopPlay;
