import { useMemo, useState } from "react";
import { IDishInfo } from "@/types";
import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import GridCard from "@/components/ui/grid-card";
import Separator from "@/components/ui/separator";
import { X } from "lucide-react";
import DishModal from "@/components/sections/dish-modal";
import getDataByLocale, { getDataStringByLocale } from "@/helpers/getDataByLocale";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {logDishClickEvent} from "@/analytics/Events";

interface IDishCard {
  dishInfo: IDishInfo;
}

const DishCard = ({ dishInfo }: IDishCard) => {
  const { i18n, t } = useTranslation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const name = getDataStringByLocale(dishInfo, "name", i18n.language);

  const dishLabels = useMemo(() => {
    return dishInfo.dishTagDtos.map((label) => (
      getDataByLocale(label.translations, i18n.language)
    )).join(" • ");
  }, [dishInfo.dishTagDtos, i18n.language]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="text-start" onClick={()=>{ logDishClickEvent(dishInfo); }}>
        <GridCard
          className="h-full"
          footer={
            <div className="flex flex-col w-full px-4 pb-3 gap-4">
              <p className="text-zinc-400 text-sm font-medium">
                {dishLabels}
              </p>
              <p className="text-zinc-900 text-lg font-bold">{name}</p>
              <Separator/>
              <div className="flex flex-col gap-4">
                <p className="text-lg font-semibold text-zinc-800">{`${dishInfo.price} դր.`}</p>
                <Button variant="secondary" className="w-full h-10 text-primary text-sm font-semibold">
                  {t("generic.add")}
                </Button>
              </div>
            </div>
          }
        >
          <div className="w-full relative">
            <img src={dishInfo.url} alt="chef image" className="w-full object-cover h-[200px]" />
          </div>
        </GridCard>
      </DialogTrigger>
      <DialogContent
        className="pt-16 rounded-lg w-11/12 sm:max-w-lg"
        closeIcon={
          <X size={24} />
        }
      >
        <DishModal
          id={dishInfo.id}
          onCloseDialog={handleCloseDialog}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DishCard;