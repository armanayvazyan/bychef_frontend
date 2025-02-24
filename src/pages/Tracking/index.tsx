import { useCallback, useState } from "react";
import { db } from "@/db";
import Button from "@/components/ui/button";
import Map from "@/components/sections/map";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { YMaps } from "@pbe/react-yandex-maps";
import formatPrice from "@/helpers/formatPrice";
import { useLiveQuery } from "dexie-react-hooks";
import Separator from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronUp, Copy, Download } from "lucide-react";
import OrderItem from "@/components/sections/order-item";

const deliveryInfoResponse = {
  data: {
    deliveryPrice: 5000,
  },
  isLoading: false,
};

const orderTotalPrice = 4000;

const Tracking = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { t } = useTranslation("translation", { keyPrefix: "checkout" });

  const cartItems = useLiveQuery(async () => {
    const products = await db.products.reverse().toArray();

    return products;
  }, [], []);

  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleCopyId = useCallback(async () => {
    if (id) {
      await navigator.clipboard.writeText(id);

      toast({
        title: "Order id copied to clipboard!",
      });
    }
  }, [id, toast]);

  return (
    <section className="pt-9 px-4 flex-1">
      <div className="w-full flex flex-col-reverse lg:flex-row justify-around gap-3">
        <div className="flex flex-col gap-4 min-w-[50%]">
          <div className="flex gap-4 items-center">
            <h1 className="text-primary font-bold text-xl">Order</h1>
            <div className="flex gap-2 items-center cursor-pointer" onClick={handleCopyId}>
              <p className="text-primary font-bold">#{id}</p>
              <Copy size={16} />
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="bg-zinc-200 rounded-md px-2-5 py-1-5">
              <p>Առաքվում է</p>
            </div>
            <p>25 Հոկ, 2024 | 13:40</p>
          </div>
          <div className="flex gap-1">
            <p className="text-zinc-800 font-bold">Հասցե -</p>
            <p>Երևան, Սերո Խանզադյան 131/9, 5-րդ հարկ, բն. 36</p>
          </div>
          <Button variant="secondary" className="max-w-[200px]">
            <Download />
            Ներբեռնել կտրոնը
          </Button>
          <Separator />
          <YMaps query={{ lang: "en_US", apikey: import.meta.env.VITE_YMAP_KEY }}>
            <Map/>
          </YMaps>
        </div>
        <div
          className="flex flex-col p-6 border-[1px] lg:max-w-[424px] max-h-max w-full rounded-xl border-border group"
          data-collapsed={isCollapsed}
        >
          <div
            className="flex justify-between cursor-pointer"
            onClick={() => {
              setIsCollapsed(isCollapsed => !isCollapsed);
            }}
          >
            <h1 className="text-xl font-bold text-primary mb-4">{t("your-order")}</h1>
            <ChevronUp className="group-data-[collapsed=false]:-rotate-180 transition-all duration-500"/>
          </div>
          <div className="grid group-data-[collapsed=false]:grid-rows-[0fr] grid-rows-[1fr] transition-all duration-300">
            <div className="overflow-hidden flex flex-col gap-6">
              {!!cartItems.length && cartItems.map((product, index) => (
                <OrderItem
                  key={product.id}
                  product={product}
                  isLastItem={cartItems.length === index + 1}
                />
              ))}
            </div>
          </div>
          <Separator className="my-3"/>
          <div className="flex w-full justify-between my-4">
            <p>{t("delivery")}</p>
            {deliveryInfoResponse.data.deliveryPrice && <p>{formatPrice(deliveryInfoResponse.data.deliveryPrice)} ֏</p>}
            {deliveryInfoResponse.isLoading && <Skeleton className="w-[100px]"/>}
          </div>
          {!!cartItems.length && (
            <div className="flex justify-between text-base font-bold text-zinc-800">
              <p>{t("total")}</p>
              {deliveryInfoResponse.data.deliveryPrice && <p>{formatPrice(orderTotalPrice)} ֏</p>}
              {deliveryInfoResponse.isLoading && <Skeleton className="w-[100px]"/>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Tracking;