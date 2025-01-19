import { useContext } from "react";
import { useTranslation } from "react-i18next";
import DishCard from "@/components/sections/dish-card";
import ChefInfoContext from "@/context/chef-info-context";
import { Skeleton } from "@/components/ui/skeleton";

const ChefDishes = () => {
  const { t } = useTranslation("translation");
  const { info, isLoading, error } = useContext(ChefInfoContext);

  return (
    <div className="flex flex-col gap-7">
      <p className="text-xl font-bold text-primary my-6">{t("generic.menu")}</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 pb-[104px]">
        {!!info?.dishes.length && info.dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dishInfo={dish}
          />
        ))}
        {isLoading && (
          new Array(8).fill(1).map((_, index) => (
            <Skeleton key={index} className="min-h-[300px] rounded-xl"/>
          ))
        )}
      </div>
      {!isLoading && !info?.dishes.length && !error && (
        <div className="w-full grid place-items-center min-h-[50dvh]">
          <h2 className="text-2xl font-bold">{t("generic.no-dish-found")}</h2>
        </div>
      )}
    </div>
  );
};

export default ChefDishes;