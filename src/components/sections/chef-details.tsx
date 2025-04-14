import { useContext, useMemo } from "react";
import Chip from "@/components/ui/chip";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import getDataByLocale from "@/helpers/getDataByLocale";
import ChefInfoContext from "@/context/chef-info-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChefDetails = () => {
  const { i18n } = useTranslation();
  const { info: details, isLoading } = useContext(ChefInfoContext);

  const name = details?.name && !isLoading ? getDataByLocale(details.name, i18n.language) : null;

  const kitchenName = details?.kitchen && !isLoading ? getDataByLocale(details.kitchen, i18n.language) : null;

  const description = details?.description && !isLoading ? getDataByLocale(details.description, i18n.language) : null;

  const chefLabels = useMemo(() => {
    return details?.chefLabels?.map((label) => (
      getDataByLocale(label.chefLabelTranslationSet, i18n.language)
    ));
  }, [details?.chefLabels, i18n.language]);

  return (
    <div>
      <div className="flex items-start gap-6 mt-6 flex-wrap md:flex-nowrap">
        <Avatar className="w-[84px] h-[84px] md:w-[206px] md:h-[206px]">
          <AvatarImage src={details?.avatarUrl} alt="chef image" className="w-full h-full object-cover"/>
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 md:gap-3">
            {kitchenName && (
              <h1 className="text-zinc-900 font-bold text-base md:text-2xl">{kitchenName}</h1>
            )}
            {isLoading && (
              <Skeleton className="w-1/2 h-[30px] rounded-xl" />
            )}
            {/*{name && (*/}
            {/*  <h2 className="text-sm md:text-base font-semibold text-primary">{name}</h2>*/}
            {/*)}*/}
            {isLoading && (
              <Skeleton className="w-full h-[30px] rounded-xl" />
            )}
            {details?.socialLinks && (
              <div className="flex items-center gap-3 flex-wrap">
                {details.socialLinks.map((social) => (
                  <a className="flex gap-2 items-center" key={social.link} href={social.link} target="_blank" rel="noopener noreferrer">
                    <img
                      className="w-[20px] h-[20px]"
                      src={`https://static.bychef.am/icons/${social.socialType?.toLowerCase()}.svg`}
                      alt="chef social page icon"
                    />
                    <p className="text-xs md:text-base font-semibold text-primary">
                      {((social.socialType ?? "")[0]) + (social.socialType ?? "").toLowerCase().slice(1)}
                    </p>
                  </a>
                ))}
              </div>
            )}
            {isLoading && (
              <div className="flex items-center gap-3 flex-wrap">
                {new Array(3).fill(0).map((_, index) =>
                  <Skeleton key={index} className="w-[108px] h-[36px] rounded-md" />
                )}
              </div>
            )}
          </div>
          {chefLabels && (
            <div className="flex gap-3 mt-3 max-w-[calc(100dvw-48px)] md:flex-wrap md:max-w-full overflow-x-auto">
              {chefLabels.map(dish => (
                dish ? <Chip key={dish} label={dish} /> : null
              ))}
            </div>
          )}
          {isLoading && (
            <div className="flex flex-wrap gap-3 mt-3">
              {new Array(3).fill(0).map((_, index) => (
                <Skeleton key={index} className="w-[108px] h-[36px] rounded-md" />
              ))}
            </div>
          )}
          {description && (
            <p className="text-zinc-500 text-sm font-normal hidden md:block mt-4">{description}</p>
          )}
          {isLoading && (
            <Skeleton className="w-full h-[60px] rounded-xl hidden md:block mt-4" />
          )}
        </div>
      </div>
      {description && (
        <p className="mt-2 text-zinc-500 text-sm font-normal md:hidden">{description}</p>
      )}
      {isLoading && (
        <Skeleton className="w-full h-[30px] mt-4 rounded-xl md:hidden"/>
      )}
    </div>
  );
};

export default ChefDetails;