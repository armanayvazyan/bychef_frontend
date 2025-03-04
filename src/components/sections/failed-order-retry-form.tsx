import { memo, useCallback, useEffect, useId, useMemo } from "react";
import { z } from "zod";
import { db } from "@/db";
import Button from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { retryOrder } from "@/server-actions";
import { useForm } from "@/components/ui/form";
import { useTranslation } from "react-i18next";
import Form from "@/components/ui/form-wrapper";
import useServerError from "@/hooks/useServerError";
import { useMutation } from "@tanstack/react-query";
import { PAYMENT_METHODS } from "@/configs/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import FormItem from "@/components/ui/form-item-wrapper";
import { EFailedOrderInputNames, LOCALES } from "@/types";
import { IRetryOrderProps } from "@/server-actions/types";
import { failedOrderSchema } from "@/schemas/failed-order";
import PaymentSelect from "@/components/sections/payment-select";

const FailedOrderRetryForm = ({ orderId }: { orderId: string | null }) => {
  const formId = useId();
  const { toast } = useToast();
  const { t, i18n } = useTranslation("translation");
  const { handleServerError } = useServerError();
  const form = useForm<z.infer<typeof failedOrderSchema>>({
    defaultValues: {
      [EFailedOrderInputNames.payment_type]: "",
      [EFailedOrderInputNames.order_number]: "",
    },
    resolver: zodResolver(failedOrderSchema)
  });

  const retryOrderMutation = useMutation({
    mutationFn: async (formData: IRetryOrderProps) => {
      return retryOrder(formData, i18n.language as LOCALES, handleServerError);
    },
    onSuccess: async (data) => {
      try {
        const html = await data.text();
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        await db.products.clear();

        window.open(url, "_blank");
      } catch (e) {
        toast({
          title: "Something went wrong!",
          description: (e instanceof Error) ? e.message : "Unknown Error",
          variant: "destructive",
        });
      }
    }
  });

  const selectedPaymentMethod = form.watch(EFailedOrderInputNames.payment_type);

  const handleSelectPaymentMethod = useCallback((method: string) => {
    form.setValue(EFailedOrderInputNames.payment_type, method);
  }, [form]);

  const paymentOptions = useMemo(() => {
    // TODO: make payment method enums
    return Object.values(PAYMENT_METHODS).filter(method => method.value !== "CASH");
  }, []);

  const handleSubmitOrder = useCallback((formData: z.infer<typeof failedOrderSchema>) => {
    retryOrderMutation.mutate(formData);
  }, [retryOrderMutation]);

  useEffect(() => {
    if (orderId) form.setValue(EFailedOrderInputNames.order_number, orderId);
  }, [form, orderId]);

  return (
    // @ts-expect-error zod problem (temp solution)
    <Form id={formId} form={form} onSubmit={handleSubmitOrder} className="flex flex-col gap-2 max-w-[264px] w-full">
      <FormItem name={EFailedOrderInputNames.payment_type}>
        <PaymentSelect
          paymentOptions={paymentOptions}
          selectedPaymentMethod={selectedPaymentMethod}
          onSelectPaymentMethod={handleSelectPaymentMethod}
        />
      </FormItem>
      <Button type="submit">{t("order-status.failure.try-again")}</Button>
      <Button type="button" className="px-0 py-0" variant="ghost">
        <a className="w-full h-full grid place-items-center" href="mailto:support@bychef.am">{t("order-status.failure.contact-support")}</a>
      </Button>
    </Form>
  );
};

export default memo(FailedOrderRetryForm);