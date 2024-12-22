import { useMemo } from "react";
import { IChefGenericInfo } from "@/types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GridCard from "@/components/ui/grid-card";
import getDataByLocale from "@/helpers/getDataByLocale";

interface IChefCardProps {
  chefInfo: IChefGenericInfo
}

const ChefCard = ({ chefInfo }: IChefCardProps) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const kitchenName = useMemo(() =>
    getDataByLocale(chefInfo.kitchenDto, i18n.language),
  [chefInfo.kitchenDto, i18n.language]);

  const chefLabels = useMemo(() => {
    return chefInfo.chefLabelDtos?.map((label) => (
      getDataByLocale(label.chefLabelTranslationSet, i18n.language)
    )).join(" • ");
  }, [chefInfo.chefLabelDtos, i18n.language]);

  const handleNavigate = () => {
    navigate(`/chef/${chefInfo.id}`);
  };

  return (
    <GridCard
      onClick={handleNavigate}
      className="px-4 py-3 cursor-pointer"
      // footer={
      //   <>
      //     <Separator/>
      //     <div className="flex items-center gap-2 text-[#15803D]">
      //       <CalendarCheck2 size={14}/>
      //       <p className="text-sm font-medium">{t("status.available", { day: t("generic.weekdays.today") })}</p>
      //     </div>
      //   </>
      // }
    >
      <div className="flex flex-col flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="min-w-[84px] min-h-[84px] w-[84px] h-[84px]">
            <img src={chefInfo.avatarUrl} alt="chef image" className="w-full h-full rounded-full object-cover"/>
          </div>
          <p className="text-zinc-900 text-lg font-bold">{kitchenName}</p>
        </div>
        <p className="text-zinc-400 text-sm font-medium">
          {chefLabels}
        </p>
      </div>
    </GridCard>
  );
};

export default ChefCard;