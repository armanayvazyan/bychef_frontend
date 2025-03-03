import { useCallback, useEffect, useRef } from "react";
import { fetchChefs } from "@/server-actions";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { IChefGenericInfo, IChefsPage } from "@/types";
import ChefCard from "@/components/sections/chef-card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CHEFS_PER_PAGE_COUNT } from "@/configs/constants";
import useServerError from "@/hooks/useServerError";

const ExploreChefs = () => {
  const { t } = useTranslation("translation");
  const { handleServerError } = useServerError();
  const observerTargetRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "chefs",
    ],
    queryFn: (props) => fetchChefs({
      ...props,
      onErrorCb: handleServerError,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: IChefsPage, allPages: IChefsPage[]) => {
      const totalFetched = allPages.reduce((acc, page) => {
        return Number(acc) + Number(page.exploreChefResponseDtoList.length);
      }, 0);

      return totalFetched < lastPage.count ? totalFetched : undefined;
    },
    refetchOnWindowFocus: false,
  });

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
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data?.pages.map((chefsGroup) => (
          chefsGroup.exploreChefResponseDtoList.map((chef: IChefGenericInfo) => (
            <ChefCard key={chef.id} chefInfo={chef} />
          ))
        ))}
        {(isFetchingNextPage || isFetching) && (
          new Array(CHEFS_PER_PAGE_COUNT).fill(1).map((_, index) => (
            <Skeleton key={index} className="min-h-[140px] rounded-xl"/>
          ))
        )}
      </div>
      {!data && !isFetchingNextPage && !isFetching && (
        <div className="w-full grid place-items-center min-h-[50dvh]">
          <h2 className="text-2xl font-bold">{t("generic.no-chefs-found")}</h2>
        </div>
      )}
      <div ref={observerTargetRef}/>
    </section>
  );
};

export default ExploreChefs;