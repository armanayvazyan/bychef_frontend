import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { z } from "zod";
import { db, ICartItem } from "@/db";
import { ChevronUp } from "lucide-react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useForm } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import formatPrice from "@/helpers/formatPrice";
import Form from "@/components/ui/form-wrapper";
import CartItem from "@/components/ui/cart-item";
import { useLiveQuery } from "dexie-react-hooks";
import { fetchApi } from "@/hooks/use-fetch-data";
import Separator from "@/components/ui/separator";
import { useQueries } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema } from "@/schemas/checkout";
import FormItem from "@/components/ui/form-item-wrapper";
import PhoneInput from "@/components/sections/phone-input";
import getNextAvailableDays from "@/helpers/getNextAvailableDays";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { EInputNames, IChefAvailabilityExceptionDays, IChefAvailableDates } from "@/types";

const fetchChef = async (id: string): Promise<{ chefAvailableDates?: IChefAvailableDates[], chefAvailabilityExceptionDays?: IChefAvailabilityExceptionDays[] }> => {
  const data = await fetchApi(
    {
      initialPath: "chef/",
      pathExtension: id
    });

  return {
    chefAvailableDates: data?.result.chefAvailableDates,
    chefAvailabilityExceptionDays: data?.result.chefAvailabilityExceptionDays,
  };
};

const fetchDeliveryPrice = async (id: number, coordinates: { lat: number; lng: number }): Promise<{ deliveryPrice: number } | undefined> => {
  const data = await fetchApi(
    {
      initialPath: "order/delivery-price",
      method: "POST",
      bodyParams: {
        chefId: id,
        doorToDoorEnabled: false,
        userCoordinates: [coordinates.lng, coordinates.lat],
      }
    }
  );

  return data?.result;
};

const OrderDetails = () => {
  const formId = useId();
  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    defaultValues: {
      email: "",
      address: "",
      apartment: "",
      entrance: "",
      floor: "",
      phone: "",
      delivery_date: "",
      delivery_time: "",
      payment_method: "",
      coordinates: [],
    },
    resolver: zodResolver(checkoutFormSchema)
  });

  const [isCollapsed, setIsCollapsed] = useState(true);

  const navigate = useNavigate();
  const { t } = useTranslation("translation", { keyPrefix: "checkout" });

  const cartItems = useLiveQuery(async () => {
    const products = await db.products.reverse().toArray();

    if (!products.length) navigate("/explore");

    return products;
  }, [], []);

  const sessionLocation = useLiveQuery(() => db.location.toArray());

  const [
    chefAvailabilityInfoResponse,
    deliveryInfoResponse,
  ] = useQueries({
    queries: [
      {
        queryKey: ["chef-checkout"],
        queryFn: () => cartItems[0]?.chefId
          ? fetchChef(String(cartItems[0]?.chefId))
          : undefined,
        refetchOnWindowFocus: false,
        enabled: !!cartItems[0]?.chefId,
      },
      {
        queryKey: ["delivery-price", sessionLocation?.[0].coordinates.lat, sessionLocation?.[0].coordinates.lng],
        queryFn: () => (cartItems[0]?.chefId && sessionLocation)
          ? fetchDeliveryPrice(cartItems[0]?.chefId, sessionLocation[0].coordinates)
          : undefined,
        refetchOnWindowFocus: false,
        enabled: !!cartItems[0]?.chefId && !!sessionLocation,
      }
    ]
  });

  const dateOptions = useMemo(() => {
    const workingWeekdays = chefAvailabilityInfoResponse.data?.chefAvailableDates;
    const exceptionDays = chefAvailabilityInfoResponse.data?.chefAvailabilityExceptionDays?.map(date => date.exceptionDate);

    if (!workingWeekdays?.length) return [];

    let min = 1;

    cartItems.forEach(product => {
      if (product.orderBefore) {
        min = Math.max(min, product.orderBefore);
      }
    });

    const availableDays = getNextAvailableDays(min, workingWeekdays, exceptionDays);

    return availableDays;
  }, [cartItems, chefAvailabilityInfoResponse.data]);

  const totalCartPrice = useMemo(() => {
    return cartItems.reduce((acc: number, product: ICartItem) => {
      const additionsTotalPrice = product.additions ? Object.values(product.additions).reduce((acc, additionPrice) => acc + Number(additionPrice), 0) : 0;

      return acc + ((product.price + additionsTotalPrice) * product.quantity);
    }, 0);
  }, [cartItems]);

  const orderTotalPrice = useMemo(() => {
    return totalCartPrice + (deliveryInfoResponse.data?.deliveryPrice ?? 0);
  }, [deliveryInfoResponse.data?.deliveryPrice, totalCartPrice]);

  const selectedDeliveryDate = form.watch(EInputNames.delivery_date);
  const selectedDeliveryTime = form.watch(EInputNames.delivery_time);
  const selectedPaymentMethod = form.watch(EInputNames.payment_method);

  const handleSubmitOrder = (formData: z.infer<typeof checkoutFormSchema>) => {
    console.log("formData", formData);
  };

  const paymentMethods = useMemo(() => {
    const paymentMethods = [
      "card",
      "idram",
      "cash"
    ];

    return paymentMethods.filter(method => (totalCartPrice || 0) >= 20000 ? method === "cash" : true);
  }, [totalCartPrice]);

  const handleSelectDeliveryDate = (date: string) => {
    form.setValue(EInputNames.delivery_date, date);
    form.setValue(EInputNames.delivery_time, "");
  };

  const handleSelectDeliveryTime = (time: string) => {
    form.setValue(EInputNames.delivery_time, time);
  };

  const handleSelectPaymentMethod = (method: string) => {
    form.setValue(EInputNames.payment_method, method);
  };

  const handleChangeQuantity = useCallback(
    async (uid: string, targetItem: ICartItem & { price: number }, diff: -1 | 1, callbackFn: () => void) => {
      const cartItem = cartItems.find(product => product.uid === uid);

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
    }, [cartItems]);

  const handleDeleteCartItem = useCallback(async (uid: string) => {
    const cartItem = cartItems.find(product => product.uid === uid);

    if (cartItem) {
      await db.products.delete(uid);
      return;
    }
  }, [cartItems]);

  useEffect(() => {
    (async () => {
      const sessionLocation = await db.location.toArray();

      if (sessionLocation[0]) {
        form.setValue(EInputNames.address, sessionLocation[0].address);
        form.setValue(EInputNames.coordinates, [sessionLocation[0].coordinates.lat, sessionLocation[0].coordinates.lng]);
      }
    })();
  }, [form]);

  return (
    // @ts-expect-error zod problem (temp solution)
    <Form id={formId} form={form} onSubmit={handleSubmitOrder} className="w-full flex flex-col-reverse lg:flex-row justify-around gap-3">
      <fieldset className="flex flex-col gap-4 lg:max-w-[500px] w-full">
        <div className="flex flex-col gap-5">
          <h1 className="text-primary font-bold text-xl leading-tight">{t("delivery-details")}</h1>
          <FormItem label={t("email")} requiredAsterisk name={EInputNames.email}>
            <Input placeholder="example@gmail.com" />
          </FormItem>
          <FormItem label={t("address")} requiredAsterisk name={EInputNames.address}>
            <Input placeholder={t("address")} disabled />
          </FormItem>
          <div className="flex w-full gap-4">
            <FormItem className="w-[calc(50%-8px)]" label={t("home")} name={EInputNames.apartment}>
              <Input placeholder={t("home")} />
            </FormItem>
            <FormItem className="w-[calc(50%-8px)]" label={t("entrance")} name={EInputNames.entrance}>
              <Input placeholder={t("entrance")} />
            </FormItem>
          </div>
          <div className="flex w-full gap-4">
            <FormItem className="w-[calc(50%-8px)]" label={t("floor")} name={EInputNames.floor}>
              <Input placeholder={t("floor")} />
            </FormItem>
            <FormProvider {...form}>
              <PhoneInput />
            </FormProvider>
          </div>
          <FormItem label={t("delivery-notes")} name={EInputNames.notes}>
            <Textarea placeholder={t("notes")} />
          </FormItem>
        </div>
        <Separator />
        <div className="flex flex-col gap-5">
          <h1 className="text-primary font-bold text-xl leading-tight">{t("delivery-time")}</h1>
          <div className="flex w-full gap-4">
            <FormItem className="flex-1" name={EInputNames.delivery_date}>
              <Select onValueChange={handleSelectDeliveryDate} disabled={!dateOptions.length}>
                <SelectTrigger>
                  <div className="flex justify-between py-2 rounded-xl cursor-pointer">
                    {selectedDeliveryDate ? (
                      <span className="flex gap-2">
                        {t(`months.${selectedDeliveryDate.split(" ")[0].toLowerCase()}`, { day: selectedDeliveryDate.split(" ")[1] })}
                      </span>
                    ) : (
                      t("select-day")
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[240px] overflow-y-scroll">
                  {dateOptions.map((date) => (
                    <SelectItem key={date.date} value={date.date} className="p-2">
                      <div className="flex gap-2 text-sm leading-tight text-foreground cursor-pointer">
                        {t(`months.${date.date.split(" ")[0].toLowerCase()}`, { day: date.date.split(" ")[1] })}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem className="flex-1" name={EInputNames.delivery_time}>
              <Select onValueChange={handleSelectDeliveryTime} disabled={!selectedDeliveryDate}>
                <SelectTrigger>
                  <div className="flex justify-between py-2 rounded-xl cursor-pointer">
                    {selectedDeliveryTime ? (
                      <span className="flex gap-2">{selectedDeliveryTime}</span>
                    ) : (
                      t("select-time")
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[240px] overflow-y-scroll">
                  {dateOptions.find(option => option.date === selectedDeliveryDate)?.time.map((timeOption) => (
                    <SelectItem key={timeOption} value={timeOption} className="p-2">
                      <div className="flex gap-2 text-sm leading-tight text-foreground cursor-pointer">
                        {timeOption}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-5">
          <h1 className="text-primary font-bold text-xl leading-tight">{t("payment-method")}</h1>
          <FormItem name={EInputNames.payment_method}>
            <Select onValueChange={handleSelectPaymentMethod}>
              <SelectTrigger>
                <div className="flex justify-between py-2 rounded-xl cursor-pointer">
                  {selectedPaymentMethod ? (
                    <span className="flex gap-2">{selectedPaymentMethod}</span>
                  ) : (
                    t("choose-payment-method")
                  )}
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-[240px] overflow-y-scroll">
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method} className="p-2">
                    <div className="flex flex-col gap-2 text-sm leading-tight text-foreground cursor-pointer">
                      {t(method)}
                      {method === "cash" && (
                        <div className="bg-muted-foreground max-w-[350px] w-full">
                          <p>
                            20.000 դրամ և ավել գնումներ կատարելուց վճարումը
                            կկատարվի կանխիկ։
                          </p>
                        </div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        </div>
      </fieldset>
      <div className="flex flex-col p-6 border-[1px] lg:max-w-[424px] max-h-max w-full rounded-xl border-border group" data-collapsed={isCollapsed}>
        <div className="flex justify-between cursor-pointer" onClick={() => { setIsCollapsed(isCollapsed => !isCollapsed); }}>
          <h1 className="text-xl font-bold text-primary mb-4">{t("your-order")}</h1>
          <ChevronUp className="group-data-[collapsed=false]:-rotate-180 transition-all duration-500" />
        </div>
        <div className="grid group-data-[collapsed=false]:grid-rows-[0fr] grid-rows-[1fr] transition-all duration-300">
          <div data-collapsed={isCollapsed} className="overflow-hidden flex flex-col gap-6">
            {!!cartItems.length && cartItems.map((product, index) => (
              <CartItem
                key={product.id}
                product={product}
                onDeleteItem={handleDeleteCartItem}
                onChangeQuantity={handleChangeQuantity}
                isLastItem={cartItems.length === index + 1}
              />
            ))}
          </div>
        </div>
        <Separator className="my-3" />
        <div className="flex w-full justify-between my-4">
          <p>{t("delivery")}</p>
          {deliveryInfoResponse.data?.deliveryPrice && <p>{formatPrice(deliveryInfoResponse.data.deliveryPrice)} ֏</p>}
          {deliveryInfoResponse.isLoading && <Skeleton className="w-[100px]" />}
        </div>
        {!!cartItems.length && (
          <div className="flex justify-between text-base font-bold text-zinc-800 mb-8">
            <p>{t("total")}</p>
            {deliveryInfoResponse.data?.deliveryPrice && <p>{formatPrice(orderTotalPrice)} ֏</p>}
            {deliveryInfoResponse.isLoading && <Skeleton className="w-[100px]" />}
          </div>
        )}
        <Button type="submit">
          {deliveryInfoResponse.data?.deliveryPrice && t("pay", { amount: formatPrice(orderTotalPrice) })}
        </Button>
      </div>
    </Form>
  );
};

export default OrderDetails;