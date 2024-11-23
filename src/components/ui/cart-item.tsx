import { ICart, ICartItem } from "@/db";
import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Separator from "@/components/ui/separator";
import { Minus, Plus, Trash2, TriangleAlert, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DishModal from "@/components/sections/dish-modal";
import { dishes } from "@/configs/constants";

interface ICartItemProps {
  product: ICart;
  onDeleteItem: (date: string, targetItem: ICartItem) => void;
  onChangeQuantity: (date: string, targetItem: ICartItem, diff: -1 | 1) => void;
}

const CartItem = ({ product, onChangeQuantity, onDeleteItem }: ICartItemProps) => {
  const { t } = useTranslation("translation");

  const [selectedDish, setSelectedDish] = useState<{ id: string; date: string } | null>(null);

  const handleSelectDish = (id: string, date: string) => {
    setSelectedDish({ id, date });
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-extrabold text-zinc-800 mb-4">
        {product.date.split(" ")[0] + " " + t(`generic.months.${product.date.split(" ")[1].toLowerCase()}`)}
      </h1>
      {product.items.map((item, index) => (
        <div key={item.id} className="cursor-pointer" onClick={() => { handleSelectDish(item.id, product.date); }}>
          <div className="flex items-center gap-4">
            <img src={item.img} alt="cart product image" className="w-[136px] h-[136px] object-cover rounded-xl"/>
            <div>
              <h1 className="text-xl font-extrabold text-zinc-800">{item.name}</h1>
              <p className="text-lg font-semibold text-zinc-800">{`${item.price} դր.`}</p>
              <div className="flex gap-3 items-center mt-8">
                <Button
                  size="icon"
                  className="bg-muted hover:bg-muted"
                  onClick={(event) => { event.stopPropagation(); onChangeQuantity(product.date, item, -1); }}
                >
                  <Minus size={16} className="text-foreground"/>
                </Button>
                <p className="text-xl font-extrabold text-zinc-950">{item.quantity}</p>
                <Button
                  size="icon"
                  className="bg-muted hover:bg-muted"
                  onClick={(event) => { event.stopPropagation(); onChangeQuantity(product.date, item, 1); }}
                >
                  <Plus size={16} className="text-foreground"/>
                </Button>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost2"
              className="bg-muted hover:bg-muted"
              onClick={(event) => { event.stopPropagation(); onDeleteItem(product.date, item); }}
            >
              <Trash2 />
            </Button>
          </div>
          <div className="flex flex-col gap-3 mt-6">
            {item.notices?.map(notice => (
              <div key={notice.key} className="flex items-center gap-2">
                <TriangleAlert size={14} className="text-destructive"/>
                <p className="text-destructive font-normal text-sm">
                  {t(`generic.${notice.key}`, { timeAhead: notice.time })}
                </p>
              </div>
            ))}
          </div>
          {(index !== product.items.length - 1) && <Separator className="my-4" />}
        </div>
      ))}
      <Dialog open={!!selectedDish} onOpenChange={(open) => {
        if (!open) setSelectedDish(null);
      }}>
        <DialogContent
          className="pt-16 rounded-lg w-11/12 sm:max-w-lg"
          closeIcon={
            <X size={24} />
          }
        >
          {selectedDish && (
            <DishModal
              selectedDate={selectedDish.date}
              onCloseDialog={() => { setSelectedDish(null); }}
              dishInfo={dishes.find(dish => dish.id === selectedDish.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartItem;