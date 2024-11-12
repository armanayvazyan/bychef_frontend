import { chefs } from "@/configs/constants";
import { useTranslation } from "react-i18next";
import DatePicker from "@/components/ui/date-picker";
import ChefCard from "@/components/sections/chef-card";

const ExploreChefs = () => {
  const { t } = useTranslation("translation");

  return (
    <section className="flex flex-col gap-4 px-6 md:px-[10%] pt-6">
      <h1 className="text-2xl font-bold text-zinc-800">{t("explore.title")}</h1>
      <DatePicker/>
      {chefs.length ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-[104px]">
          {chefs.map((chef) => <ChefCard key={chef.businessName} chefInfo={chef}/>)}
        </div>
      ) : (
        <div className="w-full grid place-items-center min-h-[50dvh]">
          <h2 className="text-2xl font-bold">No chefs found</h2>
        </div>
      )}
    </section>
  );
};

export default ExploreChefs;