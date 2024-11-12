import { IDishInfo } from "@/types";
import Button from "@/components/ui/button";
import GridCard from "@/components/ui/grid-card";
import Separator from "@/components/ui/separator";
import { Leaf, ShoppingCart, X } from "lucide-react";
import DishModal from "@/components/sections/dish-modal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface IDishCard {
  dishInfo: IDishInfo;
  selectedDate: string;
}

const DishCard = ({ dishInfo, selectedDate }: IDishCard) => {
  return (
    <GridCard
      footer={
        <div className="flex flex-col w-full px-4 pb-3 gap-4">
          <Separator/>
          <div className="flex justify-between items-baseline">
            <p className="text-xl font-semibold text-zinc-800">{`${dishInfo.price} դր.`}</p>
            <Dialog>
              <DialogTrigger>
                <Button className="rounded-full w-10 h-10">
                  <ShoppingCart />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="pt-16 rounded-lg w-11/12 sm:max-w-lg"
                closeIcon={
                  <X size={24} />
                }
              >
                <DishModal dishInfo={dishInfo} selectedDate={selectedDate} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="w-full relative">
          <img src={dishInfo.img} alt="chef image" className="w-full h-full object-cover" />
          {dishInfo.isVegan && (
            <div className="absolute top-4 right-4 bg-zinc-50 p-2 rounded-md">
              <Leaf size={16} className="text-[#15803D]" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 px-4">
          <p className="text-zinc-400 text-sm font-medium">
            {dishInfo.dishes.join(" • ")}
          </p>
          <p className="text-zinc-900 text-lg font-bold">{dishInfo.name}</p>
        </div>
      </div>
    </GridCard>
  );
};

export default DishCard;