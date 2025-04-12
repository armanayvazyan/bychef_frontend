import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { z } from "zod";
import { db, ICartItem } from "@/db";
import { ChevronUp } from "lucide-react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/components/ui/form";
import { FormProvider } from "react-hook-form";
import { EInputNames, LOCALES } from "@/types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import formatPrice from "@/helpers/formatPrice";
import Form from "@/components/ui/form-wrapper";
import CartItem from "@/components/ui/cart-item";
import { useLiveQuery } from "dexie-react-hooks";
import Separator from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import useServerError from "@/hooks/useServerError";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema } from "@/schemas/checkout";
import FormItem from "@/components/ui/form-item-wrapper";
import FormCheckbox from "@/components/ui/form-checkbox";
import { formatDateTime } from "@/helpers/formatDateTime";
import { IPlaceOrderProps } from "@/server-actions/types";
import PhoneInput from "@/components/sections/phone-input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchDeliveryPrice, placeOrder } from "@/server-actions";
import CheckoutAddressField from "@/components/sections/checkout-address-field";
import DeliveryPaymentSelect from "@/components/sections/delivery-payment-select";
import DeliveryDateTimeSelect from "@/components/sections/delivery-date-time-select";
import {
  logCartItemDeletedEvent,
  logCartItemQuantityChangedEvent,
  logOrderPlacedEvent,
  logPageOpenEvent
} from "@/analytics/Events";

const OrderCheckout = () => {
  const formId = useId();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleServerError } = useServerError();
  const { t, i18n } = useTranslation("translation", { keyPrefix: "checkout" });
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
      door2Door: false,
    },
    resolver: zodResolver(checkoutFormSchema)
  });

  useEffect(() => {
    logPageOpenEvent();
  }, []);
  const placeOrderMutation = useMutation({
    mutationFn: (formData: IPlaceOrderProps) => {
      return placeOrder(formData, i18n.language.split("-")[0] as LOCALES, handleServerError);
    },
    onSuccess: async (data) => {
      try {
        const html = await data.text();
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        await db.products.clear();

        window.location.href = url;
      } catch (e) {
        toast({
          title: "Something went wrong!",
          description: (e instanceof Error) ? e.message : "Unknown Error",
          variant: "destructive",
        });
      }
    }
  });

  const [isCollapsed, setIsCollapsed] = useState(true);

  const cartItems = useLiveQuery(async () => {
    const products = await db.products.reverse().toArray();

    if (!products.length) navigate("/explore");

    return products;
  }, [], []);

  const chefId = useMemo(() => cartItems[0]?.chefId, [cartItems]);

  const isDoorToDoorEnabled = form.watch(EInputNames.door2Door);

  const sessionLocation = useLiveQuery(() => db.location.toArray());

  const totalCartPrice = useMemo(() => {
    return cartItems.reduce((acc: number, product: ICartItem) => {
      const additionsTotalPrice = product.additions ? Object.values(product.additions).reduce((acc, additionPrice) => acc + Number(additionPrice), 0) : 0;

      return acc + ((product.price + additionsTotalPrice) * product.quantity);
    }, 0);
  }, [cartItems]);

  const deliveryInfoResponse = useQuery({
    queryKey: ["delivery-price", sessionLocation?.[0].coordinates.lat, sessionLocation?.[0].coordinates.lng, isDoorToDoorEnabled, totalCartPrice],
    queryFn: () => (chefId && sessionLocation && totalCartPrice)
      ? fetchDeliveryPrice(chefId, sessionLocation[0].coordinates, totalCartPrice, isDoorToDoorEnabled, handleServerError)
      : undefined,
    refetchOnWindowFocus: false,
    enabled: !!chefId && !!sessionLocation,
  });

  const orderTotalPrice = useMemo(() => {
    const deliveryPrice = deliveryInfoResponse.data?.result
      ? deliveryInfoResponse.data.result.deliveryPrice as number
      : 0;
    return totalCartPrice + deliveryPrice;
  }, [deliveryInfoResponse.data?.result, totalCartPrice]);

  const handleSubmitOrder = (formData: z.infer<typeof checkoutFormSchema>) => {
    if (!chefId) return;

    const [country, region, ...address] = formData.address.split(", ");

    const orderItems = cartItems.map(item => ({
      selectedSpiceLevel: item.spiceLevel ?? null,
      quantity: item.quantity,
      dishAdditionIds: item.additions ? Object.keys(item.additions).map(Number) : [],
      dishId: item.id
    }));

    logOrderPlacedEvent(
      formData.payment_method,
      Number(deliveryInfoResponse?.data?.result.deliveryPrice ?? 0.0),
      orderTotalPrice,
      "yandex",
      formData.delivery_time,
      formData.delivery_date,
      orderItems
    );
    placeOrderMutation.mutate({
      doorToDoorEnabled: formData.door2Door,
      addressDto: {
        country: country,
        city: region,
        region: region,
        street: address.join(", ").trim(),
        entrance: formData.entrance ?? "",
        home: formData.apartment ?? "",
        floor: formData.floor ?? "",
        coordinates: formData.coordinates.reverse(),
      },
      note: formData.notes ?? "",
      receiverPhoneNumber: "+374" + formData.phone,
      receiverEmail: formData.email,
      chefId: chefId,
      deliveryDateTime: formatDateTime(formData.delivery_date, formData.delivery_time),
      paymentType: formData.payment_method,
      createOrderDishes: orderItems,
    });
  };

  // TODO: create a custom hook to work with cart items
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

        logCartItemQuantityChangedEvent(cartItem.id, targetItem.quantity, quantity, "checkout");
        callbackFn();
        form.setValue(EInputNames.payment_method, "");
      }
    }, [cartItems, form]);

  const handleDeleteCartItem = useCallback(async (uid: string) => {
    const cartItem = cartItems.find(product => product.uid === uid);

    if (cartItem) {
      await db.products.delete(uid);
      logCartItemDeletedEvent(cartItem.id, cartItem.quantity, "checkout");
    }

    form.setValue(EInputNames.payment_method, "");
  }, [cartItems, form]);

  const submissionDisabled = useMemo(() => {
    return (
      typeof deliveryInfoResponse.data?.result?.deliveryPrice === "undefined" ||
      deliveryInfoResponse.isLoading ||
      placeOrderMutation.isPending
    );
  }, [
    placeOrderMutation.isPending,
    deliveryInfoResponse.isLoading,
    deliveryInfoResponse.data?.result?.deliveryPrice,
  ]);

  return (
    // @ts-expect-error zod problem (temp solution)
    <Form id={formId} form={form} onSubmit={handleSubmitOrder} className="w-full flex flex-col lg:flex-row justify-around gap-6">
      <fieldset className="flex flex-col gap-4 lg:max-w-[500px] w-full">
        <div className="flex flex-col gap-5">
          <h1 className="text-primary font-bold text-xl leading-tight">{t("delivery-details")}</h1>
          {!!sessionLocation?.length && (
            <CheckoutAddressField chefId={chefId} sessionLocation={sessionLocation} />
          )}
          <FormCheckbox name={EInputNames.door2Door} title={t("door2door")} />
          <FormItem label={t("email")} requiredAsterisk name={EInputNames.email}>
            <Input placeholder="example@gmail.com" />
          </FormItem>
          <p className="text-xs font-semibold">{t("emailNotice")}</p>
          {isDoorToDoorEnabled && (<div className="flex w-full gap-4">
            <FormItem className="w-[calc(50%-8px)]" label={t("home")} name={EInputNames.apartment}>
              <Input placeholder={t("home")} />
            </FormItem>
            <FormItem className="w-[calc(50%-8px)]" label={t("entrance")} name={EInputNames.entrance}>
              <Input placeholder={t("entrance")} />
            </FormItem>
          </div>)
          }
          <div className="flex w-full gap-4">
            {isDoorToDoorEnabled && (
              <FormItem className="w-[calc(50%-8px)]" label={t("floor")} name={EInputNames.floor}>
                <Input placeholder={t("floor")} />
              </FormItem>
            )}
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
          <DeliveryDateTimeSelect />
        </div>
        <Separator />
        <div className="flex flex-col gap-5">
          <h1 className="text-primary font-bold text-xl leading-tight">{t("payment-method")}</h1>
          <DeliveryPaymentSelect orderTotalPrice={orderTotalPrice} />
          <div className="w-full">
            <p className="text-xs text-primary">
              {t("payment-notes")}
            </p>
          </div>
        </div>
      </fieldset>
      <div
        data-collapsed={isCollapsed}
        className="flex flex-col p-6 border-[1px] lg:max-w-[424px] max-h-max w-full rounded-xl border-border group"
      >
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => { setIsCollapsed(isCollapsed => !isCollapsed); }}
        >
          <h1 className="text-xl font-bold text-primary mb-4">{t("your-order")}</h1>
          <ChevronUp className="group-data-[collapsed=false]:-rotate-180 transition-all duration-500" />
        </div>
        <div className="grid group-data-[collapsed=false]:grid-rows-[0fr] grid-rows-[1fr] transition-all duration-300">
          <div className="overflow-hidden flex flex-col gap-6">
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
          {deliveryInfoResponse.data?.result?.deliveryPrice && <p>{formatPrice(deliveryInfoResponse.data.result.deliveryPrice)} ֏</p>}
          {deliveryInfoResponse.isLoading && <Skeleton className="w-[100px]" />}
        </div>
        {!!cartItems.length && (
          <div className="flex justify-between text-base font-bold text-zinc-800 mb-8">
            <p>{t("total")}</p>
            {deliveryInfoResponse.data?.result?.deliveryPrice !== undefined && <p>{formatPrice(orderTotalPrice)} ֏</p>}
            {deliveryInfoResponse.isLoading && <Skeleton className="w-[100px]" />}
          </div>
        )}
        <Button type="submit" disabled={submissionDisabled}>
          {deliveryInfoResponse.data?.result?.deliveryPrice !== undefined && t("pay", { amount: formatPrice(orderTotalPrice) })}
        </Button>
      </div>
    </Form>
  );
};

export default OrderCheckout;