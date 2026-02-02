import {
  useFetchNewReleases,
  useFetchChartBySection,
  useFetchTopSelection,
  useFetchGenreBySection,
  useFetchGenreById,
  useFetchTopProductsByCategory,
} from "@/lib/actions";
import { Sections } from "@/components";

export default function Genre({ id }) {
  const {
    data: genre,
    isSuccess: genreDataSuccess,
    isPending: genreDataPending,
  } = useFetchGenreById({ id });

  const {
    data: newReleases,
    isPending: releasesDataPending,
    isSuccess: releasesDataSuccess,
  } = useFetchNewReleases({
    id,
  });

  const {
    data: topProductsData,
    isPending: topProductsDataPending,
    isSuccess: topProductsDataSuccess,
  } = useFetchTopProductsByCategory({
    id,
  });
  
  const { releases } = newReleases || {};
  const { topProducts } = topProductsData || {};
  const genreName = genre?.name;
  const gridNumber = 5;

  return (
    <section className="genre_section">
      <div className="relative z-20 flex flex-col gap-10">
        <Sections.MediaSection
          data={topProducts?.data}
          title={`Top ${genreName} Products`}
          titleType="large"
          titleDivider={false}
          type="product"
          cardItemNumber={10}
          gridNumber={gridNumber}
          isLoading={topProductsDataPending && genreDataPending}
          isSuccess={topProductsDataSuccess && genreDataSuccess}
        />

        <Sections.MediaSection
          data={releases?.data}
          title={` ${genreName} Stores`}
          titleType="large"
          titleDivider={false}
          type="album"
          cardItemNumber={10}
          gridNumber={gridNumber}
          isLoading={releasesDataPending && genreDataPending}
          isSuccess={releasesDataSuccess && genreDataSuccess}
        />           
             
      </div>
    </section>
  );
}
