import { useTranslation } from "react-i18next";
import { PAYMENT_METHODS } from "@/configs/constants";
import LazyImage from "@/components/sections/lazy-image";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

interface IPaymentSelectProps {
  selectedPaymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
  paymentOptions: { value: string, logo: string, disabled: boolean }[];
}

const PaymentSelect = ({ selectedPaymentMethod, onSelectPaymentMethod, paymentOptions }: IPaymentSelectProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "payment-methods" });

  return (
    <Select value={selectedPaymentMethod} onValueChange={onSelectPaymentMethod}>
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
          <SelectItem key={method.value} value={method.value} className="p-2 cursor-pointer" disabled={method.disabled}>
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
  );
};

export default PaymentSelect;