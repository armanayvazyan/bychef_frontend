import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { db, ICartItem } from "@/db";
import { useTranslation } from "react-i18next";
import useCartItem from "@/hooks/use-cart-item";
import Separator from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import DishModal from "@/components/sections/dish-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CartItemCard from "@/components/sections/cart-item-card";
import { getDataStringByLocale } from "@/helpers/getDataByLocale";

interface ICartItemProps {
  product: ICartItem;
  onDeleteItem: (uid: string) => void;
  onChangeQuantity: (
    uid: string,
    targetItem: ICartItem & { price: number },
    diff: -1 | 1,
    callbackFn: () => void
  ) => void;
  isLastItem?: boolean;
}

const CartItem = ({ product, onChangeQuantity, onDeleteItem, isLastItem = false }: ICartItemProps) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation("translation");
  const { data } = useCartItem(product.id, () => { if (onDeleteItem) onDeleteItem(product.uid); });

  const [selectedDish, setSelectedDish] = useState<{ id: string | number } | null>(null);

  const name = data ? getDataStringByLocale(data, "name", i18n.language) : null;

  const totalCartItemPrice = useMemo(() => {
    const additionsTotalPrice = product.additions
      ? Object.values(product.additions).reduce((acc, additionPrice) => acc + Number(additionPrice), 0)
      : 0;

    return (product.price + additionsTotalPrice) * product.quantity;
  }, [product.additions, product.price, product.quantity]);

  const details = useMemo(() => {
    const details = [];

    if (product.spiceLevel) {
      const spiceLevel = data?.adjustableSpiceLevelDtoList.find(spiceLevelInfo => product.spiceLevel === spiceLevelInfo.id)?.spiceLevel;
      details.unshift(t(`spice-levels.${spiceLevel}`));
    }

    if (product.additions) {
      const additions = Object.keys(product.additions).map(additionId => {
        const currentAddition = data?.dishAdditionDtoList.find(info => String(info.id) === additionId);
        const additionName = currentAddition ? getDataStringByLocale(currentAddition, "name", i18n.language) : "";

        return additionName;
      }).join(", ");

      details.push(additions);
    }

    return details.join(", ");
  }, [data?.adjustableSpiceLevelDtoList, data?.dishAdditionDtoList, i18n.language, product.additions, product.spiceLevel, t]);

  const handleSelectDish = (id: string | number) => {
    setSelectedDish({ id });
  };

  // sync the product and additions' prices with current price mentioned in local db
  useEffect(() => {
    (async function() {
      const changedParams = {} as ICartItem;
      const cartItem = await db.products.get(product.uid);

      if (data && cartItem) {
        if (data.price !== cartItem.price) {
          changedParams.price = data.price;
        }

        if (cartItem.additions) {
          for (const addition of data.dishAdditionDtoList) {
            if (cartItem.additions[addition.id]) {
              if (changedParams.additions) {
                changedParams.additions[addition.id] = addition.price;
              } else {
                changedParams.additions = { [addition.id]: addition.price };
              }
            }
          }
        }

        await db.products.put({
          ...cartItem,
          ...changedParams
        }, product.uid);
      }
    })();
  }, [data, product.uid]);

  if (!data) {
    return (
      <>
        <Skeleton className="w-full min-w-[344px] h-[180px] rounded-xl" />
        {!isLastItem && <Separator className="my-4" />}
      </>
    );
  }

  return (
    <div className="flex flex-col">
      <CartItemCard
        title={name}
        details={details}
        imageUrl={data.url}
        hasSeparator={!isLastItem}
        aria-haspopup="dialog"
        price={totalCartItemPrice}
        quantity={product.quantity}
        orderBeforeDays={data.orderBefore}
        onDecreaseQuantity={(event) => {
          event.stopPropagation();
          onChangeQuantity(
            product.uid,
            { ...product, price: data.price },
            -1,
            () => queryClient.invalidateQueries({ queryKey: ["cart-item", product.id ] })
          );
        }}
        onIncreaseQuantity={(event) => {
          event.stopPropagation();
          onChangeQuantity(
            product.uid,
            { ...product, price: data.price },
            1,
            () => queryClient.invalidateQueries({ queryKey: ["cart-item", product.id ] })
          );
        }}
        onSelectDish={() => { handleSelectDish(product.id); }}
        onDeleteItem={(event) => { event.stopPropagation(); onDeleteItem(product.uid); }}
      />
      <Dialog open={!!selectedDish} onOpenChange={(open) => {
        if (!open) setSelectedDish(null);
      }}>
        <DialogContent
          className="pt-16"
          closeIcon={
            <X size={24} />
          }
        >
          {selectedDish && (
            <DishModal
              id={selectedDish.id}
              onCloseDialog={() => { setSelectedDish(null); }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartItem;