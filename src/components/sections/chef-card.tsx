import { useMemo } from "react";
import { IChefGenericInfo } from "@/types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GridCard from "@/components/ui/grid-card";
import getDataByLocale from "@/helpers/getDataByLocale";
import {logChefClickEvent} from "@/analytics/Events";

interface IChefCardProps {
  chefInfo: IChefGenericInfo
}

const ChefCard = ({ chefInfo }: IChefCardProps) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const kitchenName = useMemo(() =>
    getDataByLocale(chefInfo.kitchen, i18n.language),
  [chefInfo.kitchen, i18n.language]);

  const chefLabels = useMemo(() => {
    return chefInfo.chefLabels?.map((label) => (
      getDataByLocale(label.chefLabelTranslationSet, i18n.language)
    )).join(" • ");
  }, [chefInfo.chefLabels, i18n.language]);

  const handleNavigate = () => {
    navigate(`/chef/${chefInfo.id}`);
  };

  return (
    <GridCard
      onClick={()=>{
        logChefClickEvent(chefInfo.id)
        handleNavigate()
      }}
      className="px-4 py-3 cursor-pointer"
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