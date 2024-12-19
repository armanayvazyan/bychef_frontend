"use client";

import { HTMLAttributes, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import Calendar from "@/components/ui/calendar";
import { useTranslation } from "react-i18next";

const DatePicker = ({
  className,
  onSubmitDate,
}: HTMLAttributes<HTMLDivElement> & { onSubmitDate: (from: Date, to: Date) => void }) => {
  const { t } = useTranslation("translation");

  // format:
  // from: new Date(2022, 0, 20),
  // to: addDays(new Date(2022, 0, 20), 20),
  const [date, setDate] = useState<DateRange | undefined>();

  const handleSelectDate = () => {
    if (date?.from && date.to) {
      onSubmitDate(date.from, date.to);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{t("explore.pick-date")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={{
              before: new Date(),
            }}
          />
          <div className="flex justify-end w-full gap-2 px-4 my-2">
            <Button disabled={!date} onClick={() => { setDate(undefined); }}>{t("generic.clear")}</Button>
            <Button disabled={!date} onClick={handleSelectDate}>{t("generic.show")}</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;