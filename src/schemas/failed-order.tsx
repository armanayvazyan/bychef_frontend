import { z } from "zod";
import { EFailedOrderInputNames } from "@/types";

export const failedOrderSchema = z.object({
  [EFailedOrderInputNames.payment_type]: z.string().min(1, { message: "form.payment-method-required" }),
  [EFailedOrderInputNames.order_number]: z.string().min(1, { message: "form.payment-method-required" }),
});