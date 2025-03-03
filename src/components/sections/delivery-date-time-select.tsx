import { memo, useMemo } from "react";
import { db } from "@/db";
import { EInputNames } from "@/types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useLiveQuery } from "dexie-react-hooks";
import FormItem from "@/components/ui/form-item-wrapper";
import { fetchChefAvailableDates } from "@/server-actions";
import getNextAvailableDays from "@/helpers/getNextAvailableDays";
import { FieldValues, useFormContext, UseFormSetValue } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import useServerError from "@/hooks/useServerError";

interface IDeliveryDateTimeSelectProps {
  selectedDeliveryDate: string;
  selectedDeliveryTime: string;
  setFormValue: UseFormSetValue<FieldValues>;
}

const DeliveryDateTimeSelect = memo(({ selectedDeliveryDate, selectedDeliveryTime, setFormValue }: IDeliveryDateTimeSelectProps) => {
  const navigate = useNavigate();
  const { handleServerError } = useServerError();
  const { t } = useTranslation("translation", { keyPrefix: "checkout" });

  const cartItems = useLiveQuery(async () => {
    const products = await db.products.reverse().toArray();

    if (!products.length) navigate("/explore");

    return products;
  }, [], []);

  const chefId = useMemo(() => cartItems[0]?.chefId, [cartItems]);

  const chefAvailabilityInfoResponse = useQuery({
    queryKey: ["chef-checkout"],
    queryFn: () => chefId
      ? fetchChefAvailableDates(chefId, handleServerError)
      : undefined,
    refetchOnWindowFocus: false,
    enabled: !!chefId,
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

  const handleSelectDeliveryDate = (date: string) => {
    setFormValue(EInputNames.delivery_date, date);
    setFormValue(EInputNames.delivery_time, "");
  };

  const handleSelectDeliveryTime = (time: string) => {
    setFormValue(EInputNames.delivery_time, time);
  };

  return (
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
  );
});

DeliveryDateTimeSelect.displayName = "DeliveryDateTimeSelect";

const DeliveryDateTimeSelectContainer = () => {
  const { watch, setValue } = useFormContext();
  const selectedDeliveryDate = watch(EInputNames.delivery_date);
  const selectedDeliveryTime = watch(EInputNames.delivery_time);

  return (
    <DeliveryDateTimeSelect
      setFormValue={setValue}
      selectedDeliveryDate={selectedDeliveryDate}
      selectedDeliveryTime={selectedDeliveryTime}
    />
  );
};

export default DeliveryDateTimeSelectContainer;