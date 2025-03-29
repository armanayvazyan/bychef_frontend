import { memo, useEffect, useMemo, useState } from "react";
import { ORDER_STATUS } from "@/types";
import { ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import formatPrice from "@/helpers/formatPrice";
import { useQuery } from "@tanstack/react-query";
import Separator from "@/components/ui/separator";
import { fetchOrderInfo } from "@/server-actions";
import CopyId from "@/components/sections/copy-id";
import { Skeleton } from "@/components/ui/skeleton";
import useServerError from "@/hooks/useServerError";
import OrderItem from "@/components/sections/order-item";
import FileDownload from "@/components/sections/file-download";
import { formatDateTimeReverse } from "@/helpers/formatDateTime";
import { logPageOpenEvent } from "@/analytics/Events";

const Tracking = () => {
  const { id: orderNumber } = useParams();
  const { handleServerError } = useServerError();
  const { t } = useTranslation("translation", { keyPrefix: "tracking" });
  const { t: tGeneral } = useTranslation("translation", { keyPrefix: "generic" });

  const [isCollapsed, setIsCollapsed] = useState(true);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get("token");

  const { data, isLoading } = useQuery({
    queryKey: ["order-info", orderNumber, token],
    queryFn: () => {
      if (orderNumber && token) return fetchOrderInfo(orderNumber, token, handleServerError);
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    logPageOpenEvent();
  }, []);
  const orderDate = useMemo(() => {
    if (data?.deliveryDateTime) {
      const dateObj = formatDateTimeReverse(data.deliveryDateTime);

      return `${tGeneral(`months.${dateObj.month}`, { day: dateObj.day })}, ${dateObj.year} | ${dateObj.time}`;
    }
  }, [data?.deliveryDateTime, tGeneral]);

  const address = useMemo(() => {
    const addressList = [];

    if (data?.addressDto.street) {
      addressList.push(data.addressDto.street);
    }

    if (data?.addressDto.entrance) {
      addressList.push(`${t("entrance")} - ${data.addressDto.entrance}`);
    }

    if (data?.addressDto.floor) {
      addressList.push(`${t("floor")} - ${data.addressDto.floor}`);
    }

    if (data?.addressDto.home) {
      addressList.push(`${t("home")} - ${data.addressDto.home}`);
    }

    return addressList.join(", ");
  }, [data?.addressDto.entrance, data?.addressDto.floor, data?.addressDto.home, data?.addressDto.street, t]);

  return (
    <section className="pt-9 px-4 flex-1">
      <div className="w-full flex flex-col lg:flex-row justify-around gap-3">
        <div className="flex flex-col gap-4 min-w-[50%]">
          {isLoading ? (
            <Skeleton className="w-full min-h-[200px]" />
          ) : (
            <>
              <div className="flex gap-4 items-center">
                <h1 className="text-primary font-bold text-xl">{t("order")}</h1>
                <CopyId id={orderNumber} />
              </div>
              <div className="flex gap-3 items-center">
                <div className="bg-zinc-200 rounded-md px-2-5 py-1-5">
                  {data?.status && <p>{t(`status.${ORDER_STATUS[data.status]}`)}</p>}
                </div>
                {orderDate && <p>{orderDate}</p>}
              </div>
              <div className="flex gap-1">
                <p className="text-zinc-800 font-bold text-nowrap">{t("address") + " -"}</p>
                <p>{address}</p>
              </div>
              <FileDownload id={data?.id} token={token} orderNumber={orderNumber} />
            </>
          )}
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
            {isLoading ? (
              <Skeleton className="w-full min-h-[200px]" />
            ) : (
              <div className="overflow-hidden flex flex-col gap-6">
                {data?.orderDishList.map((product, index) => (
                  <OrderItem
                    key={product.id}
                    product={product}
                    isLastItem={data.orderDishList.length === index + 1}
                  />
                ))}
              </div>
            )}
          </div>
          <Separator className="my-3"/>
          <div className="flex w-full justify-between my-4">
            <p>{t("delivery")}</p>
            {!isLoading && data?.deliveryPrice && <p>{formatPrice(data.deliveryPrice)} ֏</p>}
            {isLoading && <Skeleton className="w-[100px]"/>}
          </div>
          <div className="flex justify-between text-base font-bold text-zinc-800">
            <p>{t("total")}</p>
            {!isLoading && data?.deliveryPrice && <p>{formatPrice(data.totalPrice)} ֏</p>}
            {isLoading && <Skeleton className="w-[100px]"/>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Tracking);