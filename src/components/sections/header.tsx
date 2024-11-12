import { useCallback } from "react";
import { db } from "@/db";
import logo from "@/assets/logo.svg";
import { Link } from "react-router-dom";
import Button from "@/components/ui/button";
import CartItem from "@/components/ui/cart-item";
import { useLiveQuery } from "dexie-react-hooks";
import { Circle, ShoppingCart } from "lucide-react";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Header = () => {
  const products = useLiveQuery(() => db.products.reverse().toArray());

  const handleChangeQuantity = useCallback((id: string, date: string, diff: -1 | 1) => {
    const cardItem = products?.find(product => product.date === date);
    const modifiedItems = cardItem?.items.map((item) => {
      if (item.id == id) {
        const quantity = item.quantity + ((item.quantity == 1 && diff == -1) ? 0 : diff);
        return { ...item, quantity };
      } else {
        return item;
      }
    });

    if (cardItem && modifiedItems) {
      db.products.put({
        ...cardItem,
        items: modifiedItems,
      }, date);
    }
  }, [products]);

  const handleDeleteCartItem = useCallback((id: string, date: string) => {
    const cardItem = products?.find(product => product.date === date);
    const modifiedItems = cardItem?.items.filter((item) => item.id !== id);

    if (cardItem && modifiedItems) {
      if (!modifiedItems.length) {
        db.products.delete(date);
        return;
      }

      db.products.put({
        ...cardItem,
        items: modifiedItems,
      }, date);
    }
  }, [products]);

  return (
    <NavigationMenu className="w-full sticky top-0 bg-background flex justify-between max-w-full border-b-2 border-zinc-100 px-4 md:px-16 py-4 md:py-6">
      <Link to="/">
        <img src={logo} alt="logo" className="h-8 md:h-auto" />
      </Link>
      <Popover>
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
        <PopoverContent align="end" sideOffset={8} className="flex flex-col gap-6 max-h-[500px] overflow-y-scroll">
          <>
            {products?.length ?
              products.map(product => (
                <CartItem
                  key={product.date}
                  product={product}
                  onDeleteItem={handleDeleteCartItem}
                  onChangeQuantity={handleChangeQuantity}
                />
              )) : (
                <p className="text-base font-extrabold text-zinc-800">Cart is empty</p>
              )}
          </>
        </PopoverContent>
      </Popover>
    </NavigationMenu>
  );
};

export default Header;