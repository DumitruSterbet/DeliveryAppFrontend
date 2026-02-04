import {
  useFetchNewReleases,
  useFetchCategoryById,
  useFetchTopProductsByCategory,
} from "@/lib/actions";
import { Sections } from "@/components";

export default function Category({ id }) {
  const {
    data: category,
    isSuccess: categoryDataSuccess,
    isPending: categoryDataPending,
  } = useFetchCategoryById({ id });

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
  const categoryName = category?.name;
  const gridNumber = 5;

  return (
    <section className="category_section">
      <div className="relative z-20 flex flex-col gap-10">
        <Sections.MediaSection
          data={topProducts?.data}
          title={`Top ${categoryName} Products`}
          titleType="large"
          titleDivider={false}
          type="product"
          cardItemNumber={10}
          gridNumber={gridNumber}
          isLoading={topProductsDataPending && categoryDataPending}
          isSuccess={topProductsDataSuccess && categoryDataSuccess}
        />

        <Sections.MediaSection
          data={releases?.data}
          title={` ${categoryName} Stores`}
          titleType="large"
          titleDivider={false}
          type="album"
          cardItemNumber={10}
          gridNumber={gridNumber}
          isLoading={releasesDataPending && categoryDataPending}
          isSuccess={releasesDataSuccess && categoryDataSuccess}
        />           
             
      </div>
    </section>
  );
}