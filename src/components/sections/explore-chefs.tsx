import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { fetchApi } from "@/hooks/use-fetch-data";
import { Skeleton } from "@/components/ui/skeleton";
import { IChefGenericInfo, IChefsPage } from "@/types";
import ChefCard from "@/components/sections/chef-card";
import { useInfiniteQuery } from "@tanstack/react-query";
import constructFinalUrl from "@/helpers/constructFinalUrl";

const limit = 8;

interface IFetchChefsProps {
  pageParam: number,
  dateFrom?: string,
  dateTo?: string
}

const fetchChefs = async ({ pageParam, dateFrom, dateTo }: IFetchChefsProps) => {
  const url = new URL(constructFinalUrl("chef/active"));

  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("offset", pageParam.toString());
  if (dateFrom) url.searchParams.append("dateFrom", dateFrom);
  if (dateTo) url.searchParams.append("dateTo", dateTo);

  const data = await fetchApi(
    {
      initialPath: "chef/active",
      pathExtension: url.search
    }
  );

  return data?.result || {};
};

const ExploreChefs = () => {
  const { t } = useTranslation("translation");
  const observerTargetRef = useRef<HTMLDivElement | null>(null);
  // const [selectedDate, setSelectedDate] = useState<{ dateFrom: string; dateTo: string } | undefined>();
  const {
    data,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "projects",
      // selectedDate
    ],
    queryFn: (props) => fetchChefs({
      ...props,
      // dateFrom: selectedDate?.dateFrom,
      // dateTo: selectedDate?.dateTo
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: IChefsPage, allPages: IChefsPage[]) => {
      const totalFetched = allPages.reduce((acc, page) => {
        return Number(acc) + Number(page.activeChefResponseDtoList.length);
      }, 0);

      return totalFetched < lastPage.count ? totalFetched : undefined;
    },
    refetchOnWindowFocus: false,
  });

  // const handleSubmitDate = (from: Date, to: Date) => {
  //   setSelectedDate({
  //     dateFrom: new Date(from).toISOString().split("T")[0],
  //     dateTo: new Date(to).toISOString().split("T")[0],
  //   });
  //
  //   refetch();
  // };

  const handleFN = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    const options = {
      root: document,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleFN, options);
    if (observerTargetRef.current) observer.observe(observerTargetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [handleFN]);

  return (
    <section className="flex flex-col gap-4 px-6 md:px-[10%] pt-6 pb-[104px]">
      <h1 className="text-2xl font-bold text-zinc-800">{t("explore.title")}</h1>
      {/*<DatePicker onSubmitDate={handleSubmitDate}/>*/}
      {data && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {data.pages.map((chefsGroup) => (
            chefsGroup.activeChefResponseDtoList.map((chef: IChefGenericInfo) => (
              <ChefCard key={chef.id} chefInfo={chef} />
            ))
          ))}
        </div>
      )}
      {!data && !isFetchingNextPage && !isFetching && !error && (
        <div className="w-full grid place-items-center min-h-[50dvh]">
          <h2 className="text-2xl font-bold">No chefs found</h2>
        </div>
      )}
      {(isFetchingNextPage || isFetching) && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-[104px]">
          {new Array(limit).fill(1).map((_, index) => (
            <Skeleton key={index} className="min-h-[210px] rounded-xl"/>
          ))}
        </div>
      )}
      <div ref={observerTargetRef}/>
    </section>
  );
};

export default ExploreChefs;