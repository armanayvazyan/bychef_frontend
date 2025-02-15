import { useCallback, useEffect, useMemo, useState } from "react";
import { db, ICartItem } from "@/db";
import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CartItem from "@/components/ui/cart-item";
import { useLiveQuery } from "dexie-react-hooks";
import Separator from "@/components/ui/separator";
import { Circle, CircleX, ShoppingCart } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import formatPrice from "@/helpers/formatPrice";

const UserCart = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("translation");

  const [open, setOpen] = useState(false);

  const products = useLiveQuery(() => db.products.reverse().toArray());

  const totalCartPrice = useMemo(() => {
    return products?.reduce((acc: number, product: ICartItem) => {
      const additionsTotalPrice = product.additions ? Object.values(product.additions).reduce((acc, additionPrice) => acc + Number(additionPrice), 0) : 0;

      return acc + ((product.price + additionsTotalPrice) * product.quantity);
    }, 0) ?? 0;
  }, [products]);

  const handleChangeQuantity = useCallback(
    async (uid: string, targetItem: ICartItem & { price: number }, diff: -1 | 1, callbackFn: () => void) => {
      const cartItem = products?.find(product => product.uid === uid);

      if (targetItem.quantity == 1 && diff == -1) return;

      const quantity = targetItem.quantity + diff;

      if (cartItem) {
        await db.products.put({
          ...cartItem,
          quantity,
          price: targetItem.price,
        }, uid);

        callbackFn();
      }
    }, [products]);

  const handleDeleteCartItem = useCallback(async (uid: string) => {
    const cartItem = products?.find(product => product.uid === uid);

    if (cartItem) {
      await db.products.delete(cartItem.uid);
      return;
    }
  }, [products]);

  const handleCheckout = () => {
    setOpen(false);
    navigate("/checkout");
  };

  const handleToggleCart = () => {
    document.body.classList.toggle("overflow-y-hidden");
    document.body.classList.toggle("md:overflow-y-auto");
    setOpen(prevState => !prevState);
  };

  useEffect(() => {
    return () => {
      if (document.body.classList.contains("overflow-y-hidden")) {
        document.body.classList.toggle("overflow-y-hidden");
      }
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={handleToggleCart}>
      <PopoverTrigger>
        <div className="relative">
          {!!products?.length && (
            <Circle size={14} className="text-destructive fill-destructive absolute translate-x-1/4 -translate-y-1/4 right-0 top-0" />
          )}
          <Button className="rounded-full w-8 h-8 md:w-10 md:h-10">
            <ShoppingCart />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="flex flex-col gap-6">
        <>
          {products?.length ? (
            <>
              <div className="max-h-[500px] overflow-y-scroll">
                {products.map((product, index) => (
                  <CartItem
                    key={product.id}
                    product={product}
                    onDeleteItem={handleDeleteCartItem}
                    onChangeQuantity={handleChangeQuantity}
                    isLastItem={products.length === index + 1}
                  />
                ))}
              </div>
              <Separator />
              {products.length && (
                <div className="flex justify-between text-base font-bold text-zinc-800">
                  <p>{t("user-cart.total")}</p>
                  <p>{formatPrice(totalCartPrice)} ֏</p>
                </div>
              )}
              <Button onClick={handleCheckout}>
                {t("user-cart.order")}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full min-w-[314px] md:min-w-[408px] h-[300px] md:h-[348px]">
              <div className="flex flex-col items-center max-w-[233px] gap-2">
                <div className="flex justify-center items-center w-[40px] h-[40px] md:w-[64px] md:h-[64px] rounded-full bg-secondary relative">
                  <div className="relative">
                    <ShoppingCart className="w-[20px] h-[20px] md:w-[32px] md:h-[32px]"/>
                    <CircleX
                      className="absolute top-0 right-0 fill-destructive text-white w-[8px] h-[8px] md:w-[14px] md:h-[14px]"
                    />
                  </div>
                </div>
                <p className="text-base font-normal text-primary text-wrap text-center">
                  {t("user-cart.empty-cart")}
                </p>
              </div>
            </div>
          )}
        </>
      </PopoverContent>
    </Popover>
  );
};

export default UserCart;