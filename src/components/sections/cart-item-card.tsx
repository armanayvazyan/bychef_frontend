import formatPrice from "@/helpers/formatPrice";
import Button from "@/components/ui/button";
import { Minus, Plus, Trash2, TriangleAlert } from "lucide-react";
import Separator from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { MouseEvent } from "react";

interface ICartItemCardProps {
  title: string | null;
  price: number;
  details: string;
  imageUrl: string;
  quantity: number;
  hasSeparator: boolean;
  orderBeforeDays?: number | string;
  onSelectDish?: () => void;
  onDeleteItem?: (event: MouseEvent<HTMLButtonElement>) => void;
  onDecreaseQuantity?: (event: MouseEvent<HTMLButtonElement>) => void;
  onIncreaseQuantity?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const CartItemCard = ({
  title,
  price,
  details,
  imageUrl,
  quantity,
  hasSeparator,
  onDeleteItem,
  onSelectDish,
  orderBeforeDays,
  onDecreaseQuantity,
  onIncreaseQuantity
}: ICartItemCardProps) => {
  const { t } = useTranslation("translation");

  return (
    <div className="cursor-pointer" onClick={onSelectDish}>
      <div className="flex items-center gap-4">
        <img src={imageUrl} alt="cart product image" className="w-[136px] h-[136px] object-cover rounded-xl"/>
        <div>
          <h1 className="text-xl font-extrabold text-zinc-800">{title}</h1>
          <p className="text-zinc-400 text-sm my-4">{details}</p>
          <div>
            <p className="text-lg font-semibold text-zinc-800">{`${formatPrice(price)} ֏`}</p>
            <div className="flex gap-3 items-center mt-2">
              {onDecreaseQuantity && (
                <Button
                  size="icon"
                  type="button"
                  className="bg-muted hover:bg-muted w-[32px] h-[32px]"
                  onClick={onDecreaseQuantity}
                >
                  <Minus size={14} className="text-foreground"/>
                </Button>
              )}
              <p className="text-lg font-extrabold text-zinc-950">{quantity}</p>
              {onIncreaseQuantity && (
                <Button
                  size="icon"
                  type="button"
                  className="bg-muted hover:bg-muted w-[32px] h-[32px]"
                  onClick={onIncreaseQuantity}
                >
                  <Plus size={14} className="text-foreground"/>
                </Button>
              )}
            </div>
          </div>
        </div>
        {onDeleteItem && (
          <Button
            size="icon"
            variant="ghost2"
            onClick={onDeleteItem}
            className="bg-muted hover:bg-muted shrink-0"
          >
            <Trash2/>
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-3 mt-6">
        {orderBeforeDays && (
          <div className="flex items-center gap-3">
            <TriangleAlert size={14} className="text-destructive"/>
            <p className="text-destructive font-normal text-sm">
              {t("generic.order-days-ahead", { timeAhead: orderBeforeDays })}
            </p>
          </div>
        )}
      </div>
      {hasSeparator && <Separator className="my-4"/>}
    </div>
  );
};

export default CartItemCard;