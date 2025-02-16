import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { db } from "@/db";
import { IDishInfo } from "@/types";
import Button from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/hooks/use-fetch-data";
import Separator from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Minus, Plus } from "lucide-react";
import { logCartAddEvent } from "@/analytics/Events";
import Addition from "@/components/sections/addition";
import DishImage from "@/components/sections/dish-image";
import DishSpiceLevels from "@/components/ui/dish-spice-levels";
import DietaryOption from "@/components/sections/dietary-option";
import DishModalAlert from "@/components/sections/dish-modal-alert";
import ClearCartModal from "@/components/sections/clear-cart-modal";
import getDataByLocale, { getDataStringByLocale } from "@/helpers/getDataByLocale";
import { DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import formatPrice from "@/helpers/formatPrice";

const fetchDish = async (id: string | number): Promise<IDishInfo | undefined> => {
  const data = await fetchApi(
    {
      initialPath: "dish/",
      pathExtension: id.toString()
    }
  );

  return data?.result;
};

interface IDishModal {
  id: number | string;
  onCloseDialog: () => void;
}

interface ISelectedProductInfo {
  quantity: number;
  spiceLevelId?: number,
  orderInAdvanceDays?: number,
  additions?: Record<string, number>
}

const DishModal = ({ id, onCloseDialog }: IDishModal) => {
  const { toast } = useToast();
  const { i18n, t } = useTranslation();

  const {
    isFetching,
    data: dishInfo,
  } = useQuery({
    queryKey: ["dish", id],
    queryFn: () => fetchDish(id),
    refetchOnWindowFocus: false
  });

  const name = dishInfo ? getDataStringByLocale(dishInfo, "name", i18n.language) : null;
  const dishPortion = dishInfo ? getDataStringByLocale(dishInfo, "portion", i18n.language) : null;

  const dishLabels = useMemo(() => {
    return dishInfo?.dishTagDtos.map((label) => (
      getDataByLocale(label.translations, i18n.language)
    )).join(" • ");
  }, [dishInfo?.dishTagDtos, i18n.language]);

  const dishIngredients = useMemo(() => {
    return dishInfo?.ingridientsDto
      .map((ingredient) => getDataStringByLocale(ingredient, "ingredient", i18n.language))
      .join(", ");
  }, [dishInfo?.ingridientsDto, i18n.language]);

  const [isClearCartOpen, setIsClearCartOpen] = useState(false);
  const [product, setProduct] = useState<ISelectedProductInfo>({
    quantity: 1,
  });

  const totalCartItemPrice = useMemo(() => {
    if (dishInfo) {
      const additionsTotalPrice = product.additions
        ? Object.values(product.additions).reduce((acc, additionPrice) => acc + additionPrice, 0)
        : 0;

      return formatPrice((dishInfo.price + additionsTotalPrice) * product.quantity);
    } else {
      return 0;
    }
  }, [dishInfo, product.additions, product.quantity]);

  const handleIncrement = () => {
    setProduct((prevState) => {
      return { ...prevState, quantity: prevState.quantity > 19 ? prevState.quantity : prevState.quantity + 1 };
    });
  };

  const handleDecrement = () => {
    setProduct((prevState) => {
      return { ...prevState, quantity: prevState.quantity < 2 ? prevState.quantity : prevState.quantity - 1 };
    });
  };

  const handleChangeSpiceLevel = (value: string) => {
    setProduct(prevState => ({ ...prevState, spiceLevelId: Number(value) }));
  };

  const handleSelectAddition = (e: MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.getAttribute("data-id");

    if (!id) return;

    const price = e.currentTarget.getAttribute("data-price");
    const hasAddition = product.additions
      ? Object.keys(product.additions).find(additionId => additionId === id)
      : false;

    if (hasAddition) {
      const filteredAdditions = { ...product.additions };
      delete filteredAdditions[id];

      setProduct(prevState => ({
        ...prevState,
        additions: filteredAdditions
      }));
    } else {
      setProduct(prevState => ({
        ...product,
        additions: {
          ...(prevState.additions ?? {}),
          [id]: Number(price),
        }
      }));
    }
  };

  const handleAddToCart = useCallback(async () => {
    if (!dishInfo?.id || !dishInfo.chefId) return;

    const cartDishes = await db.products.toArray();
    const chefDishesInCart = await db.products.where("chefId").equals(dishInfo.chefId).toArray();

    if (cartDishes.length !== chefDishesInCart.length) {
      setIsClearCartOpen(true);
      return;
    }

    try {
      // item id consists from 3 parts (product id, spice level id, selected addition ids)
      const id1 = dishInfo.id;
      const id2 = product.spiceLevelId ?? "-";
      const id3 = product.additions
        ? Object.keys(product.additions).sort((id1, id2) => Number(id1) - Number(id2)).join("/")
        : "-";
      const itemId = [id1, id2, id3].join("/");
      const selectedItemExistsInCart = await db.products.get(itemId);

      let updatedCart = selectedItemExistsInCart;

      if (updatedCart) {
        updatedCart.quantity += product.quantity;
      } else {
        updatedCart = {
          uid: itemId,
          id: dishInfo.id,
          chefId: dishInfo.chefId,
          price: dishInfo.price,
          quantity: product.quantity,
          ...(dishInfo.orderBefore && { orderBefore: dishInfo.orderBefore }),
          ...(product.spiceLevelId && { spiceLevel: product.spiceLevelId }),
          ...(!!product.additions && { additions: product.additions })
        };
      }

      await db.products.put(updatedCart, itemId);
      logCartAddEvent(updatedCart.id, updatedCart.quantity, "dish_details", updatedCart.spiceLevel === dishInfo.adjustableSpiceLevelDtoList[0]?.id);
      onCloseDialog();

      toast({
        title: "Product added to cart!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error?.toString(),
      });
    }
  }, [
    toast,
    product,
    dishInfo,
    onCloseDialog,
  ]);

  const handleClearCartAcceptAction = async () => {
    await db.products.clear();
    handleAddToCart();
  };

  const handleClearCartDeclineAction = () => {
    setIsClearCartOpen(false);
  };

  // select first spice level item as default if no spice level is selected
  useEffect(() => {
    if (
      !product.spiceLevelId &&
      dishInfo?.adjustableSpiceLevelDtoList.length
    ) {
      setProduct(product => ({
        ...product,
        spiceLevelId: dishInfo.spiceLevel ?? dishInfo.adjustableSpiceLevelDtoList[0].id
      }));
    }
  }, [dishInfo?.adjustableSpiceLevelDtoList, dishInfo?.spiceLevel, product.spiceLevelId]);

  return (
    <>
      <ClearCartModal
        open={isClearCartOpen}
        setOpen={setIsClearCartOpen}
        acceptAction={handleClearCartAcceptAction}
        declineAction={handleClearCartDeclineAction}
      />
      <DishImage url={dishInfo?.url} />
      <div className="max-h-[calc(90dvh-282px-88px-16px-36px-0px)] overflow-y-scroll">
        {dishLabels && <p className="text-base text-zinc-400 font-medium mt-4">{dishLabels}</p>}
        {isFetching && !dishLabels && (
          <Skeleton className="w-full h-[30px] rounded-md" />
        )}
        {!!dishInfo?.dietaryOptionDtoList.length && (
          <div className="flex overflow-x-scroll gap-1 mt-3">
            {dishInfo.dietaryOptionDtoList.map(dietaryInfo => (
              <DietaryOption key={dietaryInfo.id} value={dietaryInfo.dietaryOptionValue} />
            ))}
          </div>
        )}
        {isFetching && !dishInfo && (
          <div className="flex flex-nowrap mt-3 w-full h-[30px] gap-3">
            {new Array(3).fill(0).map((_, index) =>
              <Skeleton key={index} className="w-full h-full rounded-md" />
            )}
          </div>
        )}
        <DialogTitle className="mt-4">
          {name && <p className="inline-block text-zinc-900 text-lg font-bold">{name}</p>}
          {dishPortion && <p className="inline-block text-zinc-900 text-lg font-bold">&nbsp;({dishPortion})</p>}
          {isFetching && !name && <Skeleton className="w-full h-[20px] rounded-md" />}
        </DialogTitle>
        <DialogDescription className="mt-3">
          {dishIngredients && <p className="text-zinc-500 text-base font-medium">{dishIngredients}</p>}
          {isFetching && !dishIngredients && <Skeleton className="w-full h-[60px] rounded-md" />}
        </DialogDescription>
        <Separator className="my-4"/>
        <div className="flex flex-col gap-4">
          {!!dishInfo?.adjustableSpiceLevelDtoList.length && (
            <div className="flex flex-col gap-3">
              <p className="text-primary text-base font-bold">{t("spice-level")}</p>
              <DishSpiceLevels
                onChangeSpiceLevel={handleChangeSpiceLevel}
                spiceLevels={dishInfo.adjustableSpiceLevelDtoList}
                selectedSpiceLevel={product.spiceLevelId?.toString()}
              />
            </div>
          )}
          {isFetching && !dishInfo && (
            <div className="flex flex-col mt-3 w-full gap-3">
              {new Array(3).fill(0).map((_, index) =>
                <Skeleton key={index} className="w-full h-[40px] rounded-md" />
              )}
            </div>
          )}
          {!!dishInfo?.adjustableSpiceLevelDtoList.length && !!dishInfo.dishAdditionDtoList.length && (
            <Separator />
          )}
          {!!dishInfo?.dishAdditionDtoList.length && (
            <div className="flex flex-col gap-3 mb-13">
              <p className="text-primary text-base font-bold">{t("additions")}</p>
              {dishInfo.dishAdditionDtoList.map(additionInfo => (
                <Addition
                  key={additionInfo.id}
                  additionInfo={additionInfo}
                  onSelectAddition={handleSelectAddition}
                  isActive={product.additions ? !!product.additions[additionInfo.id] : false}
                />
              ))}
            </div>
          )}
          {isFetching && !dishInfo && (
            <div className="flex flex-col mt-3 w-full gap-3">
              {new Array(3).fill(0).map((_, index) =>
                <Skeleton key={index} className="w-full h-[40px] rounded-md" />
              )}
            </div>
          )}
        </div>
      </div>
      <DialogFooter className="sticky">
        <div className="flex flex-col gap-6 w-full">
          {dishInfo?.orderBefore && <DishModalAlert date={dishInfo.orderBefore} />}
          <div className="flex gap-4 w-full">
            <div className="flex gap-3 items-center">
              <Button
                size="icon"
                onClick={handleDecrement}
                className="bg-muted hover:bg-muted w-[32px] h-[32px]"
              >
                <Minus size={14} className="text-foreground"/>
              </Button>
              <p className="text-lg font-extrabold text-zinc-950">{product.quantity}</p>
              <Button
                size="icon"
                onClick={handleIncrement}
                className="bg-muted hover:bg-muted w-[32px] h-[32px]"
              >
                <Plus size={14} className="text-foreground"/>
              </Button>
            </div>
            <Button className="flex gap-2 w-full" onClick={handleAddToCart} type="submit">
              {dishInfo && (
                <>
                  <span>{t("generic.add")}</span>
                  <span className="font-bold">({totalCartItemPrice} ֏)</span>
                </>
              )}
              {isFetching && !dishInfo && (
                <Loader2 className="animate-spin" />
              )}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </>
  );
};

export default DishModal;