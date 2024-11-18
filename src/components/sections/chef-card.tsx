import { CalendarCheck2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GridCard from "@/components/ui/grid-card";
import Separator from "@/components/ui/separator";

interface IChefCard {
  id: number,
  img: string,
  name: string,
  dishes: string[],
  businessName: string,
}

const ChefCard = ({ chefInfo }: { chefInfo: IChefCard }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("translation");

  const handleNavigate = () => {
    navigate(`/chef/${chefInfo.id}`);
  };

  return (
    <GridCard
      onClick={handleNavigate}
      className="px-4 py-3 cursor-pointer"
      footer={
        <>
          <Separator/>
          <div className="flex items-center gap-2 text-[#15803D]">
            <CalendarCheck2 size={14}/>
            <p className="text-sm font-medium">{t("status.available", { day: t("generic.weekdays.today") })}</p>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="min-w-[84px] min-h-[84px] w-[84px] h-[84px]">
            <img src={chefInfo.img} alt="chef image" className="w-full h-full rounded-full object-cover"/>
          </div>
          <p className="text-zinc-900 text-lg font-bold">{chefInfo.businessName}</p>
        </div>
        <p className="text-zinc-400 text-sm font-medium">
          {chefInfo.dishes.join(" • ")}
        </p>
      </div>
    </GridCard>
  );
};

export default ChefCard;