import { useCallback, useMemo, useState } from "react";
import { db } from "@/db";
import { IDishInfo } from "@/types";
import Button from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
// import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/hooks/use-fetch-data";
import Separator from "@/components/ui/separator";
import { Minus, Plus, TriangleAlert } from "lucide-react";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import getDataByLocale, { getDataStringByLocale } from "@/helpers/getDataByLocale";
import { DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";

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

const DishModal = ({ id, onCloseDialog }: IDishModal) => {
  const { toast } = useToast();
  const { i18n, t } = useTranslation();

  const {
    data: dishInfo,
  } = useQuery({
    queryKey: ["dish", id],
    queryFn: () => fetchDish(id),
    refetchOnWindowFocus: false
  });

  const name = getDataStringByLocale(dishInfo ?? {}, "name", i18n.language);

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

  // TODO: this should store only quantity and options
  const [product, setProduct] = useState<{ quantity: number; }>({
    quantity: 1,
  });

  const handleIncrement = () => {
    setProduct((prevValue) => {
      return { quantity: prevValue.quantity > 19 ? prevValue.quantity : prevValue.quantity + 1 };
    });
  };

  const handleDecrement = () => {
    setProduct((prevValue) => {
      return { quantity: prevValue.quantity < 2 ? prevValue.quantity : prevValue.quantity - 1 };
    });
  };

  // const handleOptionSelect = (name: string, value: string) => {
  //   setProduct(prevState => ({ ...prevState, [name]: value }));
  // };

  const handleAddToCart = useCallback(async () => {
    if (!dishInfo?.id) return;

    try {
      const selectedItemExistsInCart = await db.products.get(dishInfo.id);

      let updatedCart = selectedItemExistsInCart;

      console.log(updatedCart);

      if (updatedCart) {
        updatedCart.quantity += product.quantity;
      } else {
        // TODO: optimization (store only quantity and id of item)
        updatedCart = {
          ...product,
          id: dishInfo.id,
          price: dishInfo.price,
        };
      }

      await db.products.put(updatedCart, dishInfo.id);

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

  if (!dishInfo) return null;

  return (
    <>
      <img src={dishInfo.url} alt="dish image" className="w-full max-h-[282px] object-cover rounded-xl"/>
      <div className="max-h-[calc(90dvh-282px-88px-16px-36px-0px)] overflow-y-scroll">
        <p className="text-base text-zinc-400 font-medium mt-4">{dishLabels}</p>
        {/* TODO: add dietary list */}
        <DialogTitle className="mt-4">
          <p className="text-zinc-900 text-lg font-bold">{name}</p>
        </DialogTitle>
        <DialogDescription className="mt-3">
          <p className="text-zinc-500 text-base font-medium">{dishIngredients}</p>
        </DialogDescription>
        <Separator className="my-4"/>
        <div className="flex flex-col gap-4">
          {/* TODO: add spice level options list */}
          {/*{dishInfo.options?.map(({ id, question }) => (*/}
          {/*  <div key={id} className="flex flex-col gap-2">*/}
          {/*    {question}*/}
          {/*    <RadioGroup*/}
          {/*      defaultValue="option-one"*/}
          {/*      className="flex items-end space-y-1"*/}
          {/*      onValueChange={(value: string) => {*/}
          {/*        handleOptionSelect(question, value);*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      <div className="flex gap-2 items-center">*/}
          {/*        <RadioGroupItem value="option-one" id="option-one"/>*/}
          {/*        <Label className="text-sm font-medium text-zinc-900" htmlFor="option-one">Այո</Label>*/}
          {/*      </div>*/}
          {/*      <div className="flex gap-2 items-center">*/}
          {/*        <RadioGroupItem value="option-two" id="option-two"/>*/}
          {/*        <Label className="text-sm font-medium text-zinc-900" htmlFor="option-two">Ոչ</Label>*/}
          {/*      </div>*/}
          {/*    </RadioGroup>*/}
          {/*  </div>*/}
          {/*))}*/}
          {/* TODO: add dish extras list */}
        </div>
      </div>
      <DialogFooter className="sticky">
        <div className="flex flex-col gap-6 w-full">
          {dishInfo.orderBefore && (
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
              <span>{t("generic.add")}</span>
              <span className="font-bold">({dishInfo.price} դր.)</span>
            </Button>
          </div>
        </div>
      </DialogFooter>
    </>
  );
};

export default DishModal;