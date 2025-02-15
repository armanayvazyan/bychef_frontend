import { useEffect, useMemo, useState } from "react";
import { IDishInfo } from "@/types";
import { db, ICartItem } from "@/db";
import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Separator from "@/components/ui/separator";
import { fetchApi } from "@/hooks/use-fetch-data";
import { Skeleton } from "@/components/ui/skeleton";
import DishModal from "@/components/sections/dish-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDataStringByLocale } from "@/helpers/getDataByLocale";
import { Minus, Plus, Trash2, TriangleAlert, X } from "lucide-react";

const fetchCartItem = async (id: string | number, deleteItemCb: () => void) => {
  const data = await fetchApi({
    initialPath: "dish/",
    pathExtension: id.toString()
  });

  if (data && data.status === 404) {
    deleteItemCb();
  }

  return data?.result as IDishInfo;
};

const useCartItem = (itemId: string | number, deleteItemCb: () => void) => {
  return useQuery({
    queryKey: ["cart-item", itemId],
    queryFn: () => fetchCartItem(itemId, deleteItemCb),
    refetchOnWindowFocus: false,
  });
};

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

  const [selectedDish, setSelectedDish] = useState<{ id: string | number } | null>(null);

  const { data } = useCartItem(product.id, () => { onDeleteItem(product.uid); });

  const name = data ? getDataStringByLocale(data, "name", i18n.language) : null;

  const totalCartItemPrice = useMemo(() => {
    const additionsTotalPrice = product.additions ? Object.values(product.additions).reduce((acc, additionPrice) => acc + Number(additionPrice), 0) : 0;

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
      <div className="cursor-pointer" onClick={() => { handleSelectDish(product.id); }}>
        <div className="flex items-center gap-4">
          <img src={data.url} alt="cart product image" className="w-[136px] h-[136px] object-cover rounded-xl"/>
          <div>
            <h1 className="text-xl font-extrabold text-zinc-800">{name}</h1>
            <p className="text-zinc-400 text-sm my-4">{details}</p>
            <div>
              <p className="text-lg font-semibold text-zinc-800">{`${totalCartItemPrice} ֏`}</p>
              <div className="flex gap-3 items-center mt-2">
                <Button
                  size="icon"
                  className="bg-muted hover:bg-muted w-[32px] h-[32px]"
                  onClick={(event) => {
                    event.stopPropagation();
                    onChangeQuantity(
                      product.uid,
                      { ...product, price: data.price },
                      -1,
                      () => queryClient.invalidateQueries({ queryKey: ["cart-item", product.id ] })
                    );
                  }}
                >
                  <Minus size={14} className="text-foreground"/>
                </Button>
                <p className="text-lg font-extrabold text-zinc-950">{product.quantity}</p>
                <Button
                  size="icon"
                  className="bg-muted hover:bg-muted w-[32px] h-[32px]"
                  onClick={(event) => {
                    event.stopPropagation();
                    onChangeQuantity(
                      product.uid,
                      { ...product, price: data.price },
                      1,
                      () => queryClient.invalidateQueries({ queryKey: ["cart-item", product.id ] })
                    );
                  }}
                >
                  <Plus size={14} className="text-foreground"/>
                </Button>
              </div>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost2"
            className="bg-muted hover:bg-muted"
            onClick={(event) => { event.stopPropagation(); onDeleteItem(product.uid); }}
          >
            <Trash2 />
          </Button>
        </div>
        <div className="flex flex-col gap-3 mt-6">
          {data.orderBefore && (
            <div className="flex items-center gap-3">
              <TriangleAlert size={14} className="text-destructive"/>
              <p className="text-destructive font-normal text-sm">
                {t("generic.order-days-ahead", { timeAhead: data.orderBefore })}
              </p>
            </div>
          )}
        </div>
        {!isLastItem && <Separator className="my-4" />}
      </div>
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