import { MouseEvent } from "react";
import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import formatPrice from "@/helpers/formatPrice";
import Separator from "@/components/ui/separator";
import { Trash2, TriangleAlert } from "lucide-react";
import ItemQuantityButtonGroup from "@/components/sections/item-quantity-button-group";

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
  onIncreaseQuantity,
  ...props
}: ICartItemCardProps) => {
  const { t } = useTranslation("translation");

  return (
    <div className={onSelectDish ? "cursor-pointer" : ""} onClick={onSelectDish} {...props}>
      <div className="flex items-center gap-4">
        <div className="max-w-[136px] aspect-square">
          <img src={imageUrl} alt="cart product image" className="w-full h-full object-cover rounded-xl"/>
        </div>
        <div>
          <h1 className="text-base md:text-xl font-extrabold text-zinc-800">{title}</h1>
          <p className="text-zinc-400 text-sm my-4">{details}</p>
          <div>
            <p className="text-lg font-semibold text-zinc-800">{`${formatPrice(price)} ֏`}</p>
            <div className="flex gap-3 items-center mt-2">
              {onIncreaseQuantity && onDecreaseQuantity ? (
                <ItemQuantityButtonGroup quantity={quantity} onIncrement={onIncreaseQuantity} onDecrement={onDecreaseQuantity} />
              ) : (
                <p className="text-lg font-extrabold text-zinc-950">{quantity}</p>
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