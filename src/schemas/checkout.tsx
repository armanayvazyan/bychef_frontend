import { z } from "zod";
import { EInputNames } from "@/types";

export const checkoutFormSchema = z.object({
  [EInputNames.email]: z
    .string()
    .min(1, { message: "form.email-required" })
    .email({ message: "form.invalid-email" }),
  [EInputNames.address]: z
    .string()
    .min(1, { message: "form.address-required" }),
  [EInputNames.apartment]: z.string().optional(),
  [EInputNames.entrance]: z.string().optional(),
  [EInputNames.floor]: z.string().optional(),
  [EInputNames.phone]: z
    .string()
    .min(1, { message: "form.phone-required" })
    .regex(/\d{8}$/, { message: "form.invalid-phone" }),
  [EInputNames.notes]: z.string().optional(),
  [EInputNames.delivery_date]: z.string().min(1, { message: "form.delivery-date-required" }),
  [EInputNames.delivery_time]: z.string().min(1, { message: "form.delivery-time-required" }),
  [EInputNames.payment_method]: z.string().min(1, { message: "form.payment-method-required" }),
  [EInputNames.coordinates]: z.array(z.number()),
  [EInputNames.door2Door]: z.boolean(),
});