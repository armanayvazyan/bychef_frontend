import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { db } from "@/db";
import { IDishInfo } from "@/types";
import Button from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/hooks/use-fetch-data";
import Separator from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Minus, Plus, TriangleAlert } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import getDataByLocale, { getDataStringByLocale } from "@/helpers/getDataByLocale";
import { DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";

const fetchDish = async (id: string | number): Promise<IDishInfo | undefined> => {
  const data = await fetchApi(
    {
      initialPath: "dish/admin/",
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
  additionIds?: number[]
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

  const dishLabels = useMemo(() => {
    return dishInfo?.dishTagDtos.map((label) => (
      getDataByLocale(label.translations, i18n.language)
    )).join(" • ");
  }, [dishInfo?.dishTagDtos, i18n.language]);

  const dishIngredients = useMemo(() => {
    return dishInfo?.ingridientsDto.map((label) => (
      getDataByLocale(label.translations, i18n.language)
    )).join(", ");
  }, [dishInfo?.ingridientsDto, i18n.language]);

  const [product, setProduct] = useState<ISelectedProductInfo>({
    quantity: 1,
  });

  const totalCartItemPrice = useMemo(() => {
    if (dishInfo) {
      const additionsTotalPrice = product.additionIds?.reduce((acc, additionId) => {
        const additionInfo = dishInfo.dishAdditionDtoList.find(info => info.id === additionId);
        const additionPrice = additionInfo ? Number(additionInfo.price) : 0;

        return acc + additionPrice;
      }, 0) ?? 0;

      return (dishInfo.price + additionsTotalPrice) * product.quantity;
    } else {
      return 0;
    }
  }, [dishInfo, product.additionIds, product.quantity]);

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
    const id = e.currentTarget.getAttribute("data-value");

    if (product.additionIds?.includes(Number(id))) {
      setProduct(prevState => ({
        ...prevState,
        additionIds: prevState.additionIds?.filter(additionId => additionId !== Number(id))
      }));
    } else {
      setProduct(prevState => ({
        ...product,
        additionIds: [...(prevState.additionIds ?? []), Number(id)].sort((a, b) => a - b)
      }));
    }
  };

  const handleAddToCart = useCallback(async () => {
    if (!dishInfo?.id) return;

    try {
      // item id consists from 3 parts (product id, spice level id, selected addition ids)
      const id1 = dishInfo.id;
      const id2 = product.spiceLevelId ?? "-";
      const id3 = product.additionIds ? product.additionIds.join("/") : "-";
      const itemId = [id1, id2, id3].join("/");
      const selectedItemExistsInCart = await db.products.get(itemId);

      let updatedCart = selectedItemExistsInCart;

      if (updatedCart) {
        updatedCart.quantity += product.quantity;
      } else {
        updatedCart = {
          uid: itemId,
          id: dishInfo.id,
          price: dishInfo.price,
          quantity: product.quantity,
          ...(product.spiceLevelId && { spiceLevel: product.spiceLevelId }),
          ...(!!product.additionIds?.length && { additions: product.additionIds })
        };
      }

      await db.products.put(updatedCart, itemId);

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

  // select first spice level item as default if no spice level is selected
  useEffect(() => {
    if (
      !product.spiceLevelId &&
      dishInfo?.adjustableSpiceLevelDtoList.length &&
      product.spiceLevelId !== dishInfo.adjustableSpiceLevelDtoList[0].id
    ) {
      setProduct(product => ({ ...product, spiceLevelId: dishInfo.adjustableSpiceLevelDtoList[0].id }));
    }
  }, [dishInfo?.adjustableSpiceLevelDtoList, product.spiceLevelId]);

  return (
    <>
      {dishInfo?.url && (
        <img src={dishInfo.url} alt="dish image" className="w-full max-h-[282px] object-cover rounded-xl" />
      )}
      {isFetching && !dishInfo && (
        <Skeleton className="w-full h-[282px] rounded-xl" />
      )}
      <div className="max-h-[calc(90dvh-282px-88px-16px-36px-0px)] overflow-y-scroll">
        {dishLabels && <p className="text-base text-zinc-400 font-medium mt-4">{dishLabels}</p>}
        {isFetching && !dishLabels && (
          <Skeleton className="w-full h-[30px] rounded-md" />
        )}
        {!!dishInfo?.dietaryOptionDtoList.length && (
          <div className="flex overflow-x-scroll gap-2 mt-3">
            {dishInfo.dietaryOptionDtoList.map(dietaryInfo => (
              <div
                key={dietaryInfo.id}
                className="flex flex-nowrap gap-3 px-4 py-2 bg-secondary border-transparent border-[1px] rounded-md items-center"
              >
                <img
                  className="h-[20px]"
                  alt="dietary option icon"
                  src={`https://static.bychef.am/icons/${dietaryInfo.dietaryOptionValue}.svg`}
                />
                <p className="text-nowrap text-sm text-center font-normal text-zinc-600 w-[100px]">
                  {t(`dietary-options.${dietaryInfo.dietaryOptionValue}`)}
                </p>
              </div>
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
          {name && <p className="text-zinc-900 text-lg font-bold">{name}</p>}
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
              <RadioGroup value={product.spiceLevelId?.toString()}>
                {dishInfo.adjustableSpiceLevelDtoList.map(spiceLevelInfo => (
                  <div
                    key={spiceLevelInfo.id}
                    onClick={() => { handleChangeSpiceLevel(spiceLevelInfo.id.toString()); }}
                    className="flex gap-4 cursor-pointer items-center px-4 py-2 border-border border-[1px] rounded-md hover:bg-secondary"
                  >
                    <RadioGroupItem
                      id={spiceLevelInfo.id.toString()}
                      value={spiceLevelInfo.id.toString()}
                      className="w-[20px] h-[20px]" circleSize={10}
                    />
                    <img
                      className="h-[28px]"
                      alt="spice level icon"
                      src={`https://static.bychef.am/icons/${spiceLevelInfo.spiceLevel}.svg`}
                    />
                    <Label className="cursor-pointer" htmlFor="option-one">
                      {t(`spice-levels.${spiceLevelInfo.spiceLevel}`)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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
              {dishInfo.dishAdditionDtoList.map(additionInfo => {
                const additionName = getDataStringByLocale(additionInfo, "name", i18n.language);

                return (
                  <div
                    role="button"
                    key={additionInfo.id}
                    data-value={additionInfo.id}
                    onClick={handleSelectAddition}
                    className="flex gap-4 items-center px-4 py-2 border-border border-[1px] rounded-md hover:bg-secondary"
                  >
                    <Checkbox
                      id="terms"
                      className="pointer-events-none"
                      checked={product.additionIds?.includes(additionInfo.id)}
                    />
                    <label
                      htmlFor="terms"
                      className="flex pointer-events-none gap-2 items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <p>{additionName}</p>
                      <p className="font-bold text-base">{`(+${additionInfo.price} դր.)`}</p>
                    </label>
                  </div>
                );
              })}
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
          {dishInfo?.orderBefore && (
            <div className="flex gap-3">
              <TriangleAlert size={24} className="text-destructive"/>
              <p className="text-destructive font-normal text-base">
                {t("generic.order-days-ahead", { timeAhead: dishInfo.orderBefore })}
              </p>
            </div>
          )}
          <div className="flex gap-4 w-full">
            <div className="flex gap-3 items-center">
              <Button
                size="icon"
                onClick={handleDecrement}
                className="bg-muted hover:bg-muted"
              >
                <Minus size={16} className="text-foreground"/>
              </Button>
              <p className="text-xl font-extrabold text-zinc-950">{product.quantity}</p>
              <Button
                size="icon"
                onClick={handleIncrement}
                className="bg-muted hover:bg-muted"
              >
                <Plus size={16} className="text-foreground"/>
              </Button>
            </div>
            <Button className="flex gap-2 w-full" onClick={handleAddToCart} type="submit">
              {dishInfo && (
                <>
                  <span>{t("generic.add")}</span>
                  <span className="font-bold">({totalCartItemPrice} դր.)</span>
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