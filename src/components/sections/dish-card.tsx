import { useState } from "react";
import { IDishInfo } from "@/types";
import Button from "@/components/ui/button";
import GridCard from "@/components/ui/grid-card";
import Separator from "@/components/ui/separator";
import { Leaf, ShoppingCart, X } from "lucide-react";
import DishModal from "@/components/sections/dish-modal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IDishCard {
  dishInfo: IDishInfo;
  selectedDate: string;
}

const DishCard = ({ dishInfo, selectedDate }: IDishCard) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="text-start">
        <GridCard
          className="h-full"
          footer={
            <div className="flex flex-col w-full px-4 pb-3 gap-4">
              <Separator/>
              <div className="flex justify-between items-baseline">
                <p className="text-xl font-semibold text-zinc-800">{`${dishInfo.price} դր.`}</p>
                <Button className="rounded-full w-10 h-10">
                  <ShoppingCart />
                </Button>
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="w-full relative">
              <img src={dishInfo.img} alt="chef image" className="w-full h-full object-cover" />
              {dishInfo.isVegan && (
                <div className="absolute top-4 right-4">
                  <TooltipProvider>
                    <Tooltip delayDuration={1000}>
                      <TooltipTrigger>
                        <div className="bg-zinc-50 p-2 rounded-md">
                          <Leaf size={16} className="text-[#15803D]"/>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-[#15803D] font-semibold bg-background p-2">
                        <p>Vegan friendly</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
      </DialogTrigger>
      <DialogContent
        className="pt-16 rounded-lg w-11/12 sm:max-w-lg"
        closeIcon={
          <X size={24} />
        }
      >
        <DishModal dishInfo={dishInfo} selectedDate={selectedDate} onCloseDialog={handleCloseDialog} />
      </DialogContent>
    </Dialog>
  );
};

export default DishCard;