import { ChangeEvent } from "react";
import { EInputNames } from "@/types";
import Input from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import FormItem from "@/components/ui/form-item-wrapper";
import { PHONE_NUMBER_PREFIX } from "@/configs/constants";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormField } from "@/components/ui/form";

const PhoneInput = () => {
  const { control } = useFormContext();
  const { t } = useTranslation("translation", { keyPrefix: "checkout" });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 8) {
      onChange(value);
    }
  };

  return (
    <FormField
      control={control}
      name={EInputNames.phone}
      render={() => (
        <FormItem name={EInputNames.phone} requiredAsterisk className="w-[calc(50%-8px)]" label={t("phone")}>
          <>
            <FormControl>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  {PHONE_NUMBER_PREFIX}
                </span>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="tel"
                      placeholder={t("phone")}
                      className="rounded-l-none"
                      onChange={(e) => { handleInputChange(e, field.onChange); }}
                    />
                  )}
                />
              </div>
            </FormControl>
          </>
        </FormItem>
      )}
    />
  );
};

export default PhoneInput;