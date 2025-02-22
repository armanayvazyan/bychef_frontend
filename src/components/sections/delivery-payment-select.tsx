import { memo, useCallback, useMemo } from "react";
import { EInputNames } from "@/types";
import { useTranslation } from "react-i18next";
import FormItem from "@/components/ui/form-item-wrapper";
import LazyImage from "@/components/sections/lazy-image";
import { MAX_ORDER_PRICE_BY_CASH, PAYMENT_METHODS } from "@/configs/constants";
import { FieldValues, useFormContext, UseFormSetValue } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

interface IDeliveryPaymentSelectContainerProps {
  orderTotalPrice: number,
}

interface IDeliveryPaymentSelectProps extends IDeliveryPaymentSelectContainerProps {
  selectedPaymentMethod: string;
  setFormValue: UseFormSetValue<FieldValues>;
}

const DeliveryPaymentSelect = memo(({ orderTotalPrice, setFormValue, selectedPaymentMethod }: IDeliveryPaymentSelectProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "checkout" });

  const paymentOptions = useMemo(() => {
    return Object.values(PAYMENT_METHODS).filter(method => orderTotalPrice >= MAX_ORDER_PRICE_BY_CASH ? method.value !== "CASH" : true);
  }, [orderTotalPrice]);

  const handleSelectPaymentMethod = useCallback((method: string) => {
    setFormValue(EInputNames.payment_method, method);
  }, [setFormValue]);

  return (
    <FormItem name={EInputNames.payment_method}>
      <Select onValueChange={handleSelectPaymentMethod}>
        <SelectTrigger>
          <div className="flex justify-between py-2 rounded-xl cursor-pointer">
            {selectedPaymentMethod ? (
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  className="h-[15px]"
                  alt="payment option logo"
                  src={PAYMENT_METHODS[selectedPaymentMethod as keyof typeof PAYMENT_METHODS].logo}
                />
                <span className="flex gap-2">{t(selectedPaymentMethod)}</span>
              </div>
            ) : (
              t("choose-payment-method")
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[240px] overflow-y-scroll">
          {paymentOptions.map((method) => (
            <SelectItem key={method.value} value={method.value} className="p-2 cursor-pointer">
              <div className="flex items-center gap-2 cursor-pointer">
                <LazyImage
                  url={method.logo}
                  alt="payment option logo"
                  imgClassName="w-full h-full object-contain"
                  containerClassName="h-[15px] w-[25px]"
                />
                <p className="text-sm leading-tight text-foreground">{t(method.value)}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
});

DeliveryPaymentSelect.displayName = "DeliveryPaymentSelect";

const DeliveryPaymentSelectContainer = ({ orderTotalPrice }: IDeliveryPaymentSelectContainerProps) => {
  const { watch, setValue } = useFormContext();
  const selectedPaymentMethod = watch(EInputNames.payment_method);

  return (
    <DeliveryPaymentSelect
      setFormValue={setValue}
      orderTotalPrice={orderTotalPrice}
      selectedPaymentMethod={selectedPaymentMethod}
    />
  );
};

export default DeliveryPaymentSelectContainer;