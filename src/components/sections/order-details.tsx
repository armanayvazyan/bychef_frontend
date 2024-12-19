import { useCallback, useId, useMemo, useState } from "react";
import { z } from "zod";
import { db, ICartItem } from "@/db";
import { ChevronUp } from "lucide-react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useForm } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Form from "@/components/ui/form-wrapper";
import CartItem from "@/components/ui/cart-item";
import { useLiveQuery } from "dexie-react-hooks";
import Separator from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import FormItem from "@/components/ui/form-item-wrapper";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

enum EInputNames {
  email = "email",
  address = "address",
  apartment = "apartment",
  entrance = "entrance",
  floor = "floor",
  phone = "phone",
  notes = "notes",
  delivery_date = "delivery_date",
  delivery_time = "delivery_time",
  payment_method = "payment_method"
}

const formSchema = z.object({
  [EInputNames.email]: z.string().min(1),
  [EInputNames.address]: z.string().min(1),
  [EInputNames.apartment]: z.string().optional(),
  [EInputNames.entrance]: z.string().optional(),
  [EInputNames.floor]: z.string().optional(),
  [EInputNames.phone]: z.string().min(1),
  [EInputNames.notes]: z.string().optional(),
  [EInputNames.delivery_date]: z.string().min(1),
  [EInputNames.delivery_time]: z.string().min(1),
  [EInputNames.payment_method]: z.string().min(1),
});

const deliveryDates = [
  "Հունվար 1",
  "Հունվար 2",
  "Հունվար 3",
  "Հունվար 4",
  "Հունվար 5",
  "Հունվար 6",
];

const deliveryHours = [
  "11:30",
  "12:30",
  "13:30",
  "14:30",
  "15:30",
  "16:30",
];

const OrderDetails = () => {
  const formId = useId();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      address: "",
      apartment: "",
      entrance: "",
      floor: "",
      phone: "",
      delivery_date: "",
      delivery_time: "",
      payment_method: ""
    },
    resolver: zodResolver(formSchema)
  });

  const [isCollapsed, setIsCollapsed] = useState(true);

  const navigate = useNavigate();
  const { t } = useTranslation("translation", { keyPrefix: "checkout" });
  const products = useLiveQuery(async () => {
    const products = await db.products.reverse().toArray();

    if (!products.length) navigate("/explore");

    return products;
  });
  const generalInfo = useLiveQuery(() => db.generalInfo ? db.generalInfo.toArray() : []);

  const selectedDeliveryDate = form.watch(EInputNames.delivery_date);
  const selectedDeliveryTime = form.watch(EInputNames.delivery_time);
  const selectedPaymentMethod = form.watch(EInputNames.payment_method);

  const handleSubmitOrder = (formData: z.infer<typeof formSchema>) => {
    console.log("formData", formData);
  };

  const paymentMethods = useMemo(() => {
    const paymentMethods = [
      "card",
      "idram",
      "cash"
    ];

    return paymentMethods.filter(method => generalInfo && generalInfo[0].price >= 20000 ? method === "cash" : true);
  }, [generalInfo]);

  const handleSelectDeliveryDate = (date: string) => {
    form.setValue(EInputNames.delivery_date, date);
  };

  const handleSelectDeliveryTime = (time: string) => {
    form.setValue(EInputNames.delivery_time, time);
  };

  const handleSelectPaymentMethod = (method: string) => {
    form.setValue(EInputNames.payment_method, method);
  };

  const handleChangeQuantity = useCallback(async (date: string, targetItem: ICartItem, diff: -1 | 1) => {
    const cardItem = products?.find(product => product.date === date);

    if (targetItem.quantity == 1 && diff == -1) return;

    const quantity = targetItem.quantity + diff;
    const modifiedItems = cardItem?.items.map((item) => item.id == targetItem.id ? { ...item, quantity } : item);

    if (cardItem && modifiedItems) {
      await db.products.put({
        ...cardItem,
        items: modifiedItems,
      }, date);
    }

    if (generalInfo) {
      await db.generalInfo?.put({
        id: "1",
        price: generalInfo[0].price + (diff * targetItem.price),
      }, "1");
    }
  }, [generalInfo, products]);

  const handleDeleteCartItem = useCallback(async (date: string, targetItem: ICartItem) => {
    const cardItem = products?.find(product => product.date === date);
    const modifiedItems = cardItem?.items.filter((item) => item.id !== targetItem.id);

    if (cardItem && modifiedItems) {
      if (generalInfo) {
        await db.generalInfo?.put({
          id: "1",
          price: generalInfo[0].price - (targetItem.quantity * targetItem.price),
        }, "1");
      }

      if (!modifiedItems.length) {
        await db.products.delete(date);
        return;
      }

      db.products.put({
        ...cardItem,
        items: modifiedItems,
      }, date);
    }
  }, [generalInfo, products]);

  return (
    // @ts-expect-error zod problem (temp solution)
    <Form id={formId} form={form} onSubmit={handleSubmitOrder} className="w-full flex flex-col-reverse lg:flex-row justify-around gap-3">
      <fieldset className="flex flex-col gap-4 lg:max-w-[500px] w-full">
        <div className="flex flex-col gap-5">
          <h1 className="text-primary font-bold text-xl leading-tight">Առաքման տվյալներ</h1>
          <FormItem label={t("email")} requiredAsterisk name={EInputNames.address}>
            <Input placeholder="example@gmail.com" />
          </FormItem>
          <FormItem label={t("address")} requiredAsterisk name={EInputNames.address}>
            <Input placeholder={t("address")} />
          </FormItem>
          <div className="flex w-full gap-4">
            <FormItem className="flex-1" label={t("home")} name={EInputNames.apartment}>
              <Input placeholder={t("home")} />
            </FormItem>
            <FormItem className="flex-1" label={t("entrance")} name={EInputNames.entrance}>
              <Input placeholder={t("entrance")} />
            </FormItem>
          </div>
          <div className="flex w-full gap-4">
            <FormItem className="flex-1" label={t("floor")} name={EInputNames.floor}>
              <Input placeholder={t("floor")} />
            </FormItem>
            <FormItem className="flex-1" label={t("phone")} requiredAsterisk name={EInputNames.phone}>
              <Input placeholder={t("phone")} />
            </FormItem>
          </div>
          <FormItem label={t("deliveryNotes")} name={EInputNames.notes}>
            <Textarea placeholder={t("notes")} />
          </FormItem>
        </div>
        <Separator />
        <div className="flex flex-col gap-5">
          <h1 className="text-primary font-bold text-xl leading-tight">{t("deliveryTime")}</h1>
          <div className="flex w-full gap-4">
            <FormItem className="flex-1" name={EInputNames.delivery_date}>
              <Select onValueChange={handleSelectDeliveryDate}>
                <SelectTrigger>
                  <div className="flex justify-between py-2 rounded-xl cursor-pointer">
                    {selectedDeliveryDate ? (
                      <span className="flex gap-2">{selectedDeliveryDate}</span>
                    ) : (
                      t("selectDay")
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[240px] overflow-y-scroll">
                  {deliveryDates.map((date) => (
                    <SelectItem key={date} value={date} className="p-2">
                      <div className="flex gap-2 text-sm leading-tight text-foreground cursor-pointer">
                        {date}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem className="flex-1" name={EInputNames.delivery_time}>
              <Select onValueChange={handleSelectDeliveryTime}>
                <SelectTrigger>
                  <div className="flex justify-between py-2 rounded-xl cursor-pointer">
                    {selectedDeliveryTime ? (
                      <span className="flex gap-2">{selectedDeliveryTime}</span>
                    ) : (
                      t("selectTime")
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[240px] overflow-y-scroll">
                  {deliveryHours.map((time) => (
                    <SelectItem key={time} value={time} className="p-2">
                      <div className="flex gap-2 text-sm leading-tight text-foreground cursor-pointer">
                        {time}
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
          <h1 className="text-primary font-bold text-xl leading-tight">{t("paymentMethod")}</h1>
          <FormItem name={EInputNames.payment_method}>
            <Select onValueChange={handleSelectPaymentMethod}>
              <SelectTrigger>
                <div className="flex justify-between py-2 rounded-xl cursor-pointer">
                  {selectedPaymentMethod ? (
                    <span className="flex gap-2">{selectedPaymentMethod}</span>
                  ) : (
                    t("choosePaymentMethod")
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
          <h1 className="text-xl font-bold text-primary mb-4">{t("yourOrder")}</h1>
          <ChevronUp className="group-data-[collapsed=false]:-rotate-180 transition-all duration-500" />
        </div>
        <div className="grid group-data-[collapsed=false]:grid-rows-[0fr] grid-rows-[1fr] transition-all duration-300">
          <div data-collapsed={isCollapsed} className="overflow-hidden flex flex-col gap-6">
            {!!products?.length && products.map(product => (
              <CartItem
                key={product.date}
                product={product}
                onDeleteItem={handleDeleteCartItem}
                onChangeQuantity={handleChangeQuantity}
              />
            ))}
          </div>
        </div>
        <Separator className="my-3" />
        <div className="flex w-full justify-between my-4">
          <p>{t("delivery")}</p>
          <p>880 դր.</p>
        </div>
        {generalInfo?.length && (
          <div className="flex justify-between text-base font-bold text-zinc-800 mb-8">
            <p>{t("total")}</p>
            <p>{generalInfo[0].price} դր.</p>
          </div>
        )}
        <Button type="submit">
          {t("pay", { amount: generalInfo?.[0].price ?? 0 })}
        </Button>
      </div>
    </Form>
  );
};

export default OrderDetails;