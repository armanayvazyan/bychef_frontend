import { memo, useCallback, useMemo } from "react";
import { EInputNames, PAYMENT_TYPES } from "@/types";
import FormItem from "@/components/ui/form-item-wrapper";
import PaymentSelect from "@/components/sections/payment-select";
import { MAX_ORDER_PRICE_BY_CASH, PAYMENT_METHODS } from "@/configs/constants";
import { FieldValues, useFormContext, UseFormSetValue } from "react-hook-form";

interface IDeliveryPaymentSelectContainerProps {
  orderTotalPrice: number,
}

interface IDeliveryPaymentSelectProps extends IDeliveryPaymentSelectContainerProps {
  selectedPaymentMethod: string;
  setFormValue: UseFormSetValue<FieldValues>;
}

const DeliveryPaymentSelect = memo(({ orderTotalPrice, setFormValue, selectedPaymentMethod }: IDeliveryPaymentSelectProps) => {
  const paymentOptions = useMemo(() => {
    return Object.values(PAYMENT_METHODS).filter(method => orderTotalPrice >= MAX_ORDER_PRICE_BY_CASH ? method.value !== PAYMENT_TYPES.CASH : true);
  }, [orderTotalPrice]);

  const handleSelectPaymentMethod = useCallback((method: string) => {
    setFormValue(EInputNames.payment_method, method);
  }, [setFormValue]);

  return (
    <FormItem name={EInputNames.payment_method}>
      <PaymentSelect paymentOptions={paymentOptions} selectedPaymentMethod={selectedPaymentMethod} onSelectPaymentMethod={handleSelectPaymentMethod} />
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