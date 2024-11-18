import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/button";
import { dishes } from "@/configs/constants";
import { useTranslation } from "react-i18next";
import DishCard from "@/components/sections/dish-card";
import weekdaysToCalendarDate from "@/helpers/weekdayToCalendarDate";

interface IChefDishes {
  workdays: number[];
}

const ChefDishes = ({ workdays }: IChefDishes) => {
  const { t } = useTranslation("translation");

  const [selectedDay, setSelectedDay] = useState<string>("");

  const modifiedWorkdays = useMemo(() => weekdaysToCalendarDate(workdays), [workdays]);

  const handleSelectDay = useCallback((day: string) => {
    setSelectedDay(day);
  }, []);

  useEffect(() => {
    if (modifiedWorkdays.length) {
      setSelectedDay(modifiedWorkdays[0].date.day + " " + modifiedWorkdays[0].date.month);
    }
  }, [modifiedWorkdays]);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex gap-4 mt-6 overflow-x-scroll">
        {modifiedWorkdays.map((workday) => (
          <Button
            key={workday.weekday}
            variant="secondary"
            data-selected={selectedDay === workday.date.day + " " + workday.date.month}
            onClick={() => { handleSelectDay(workday.date.day + " " + workday.date.month); }}
            className="h-auto w-auto flex flex-col p-3 border-0 rounded-md bg-zinc-100 text-black data-[selected=true]:bg-zinc-800 data-[selected=true]:text-white"
          >
            <p className="text-xs">{t(`generic.weekdays.${workday.weekday}`)}</p>
            <p className="text-lg">{workday.date.day + " " + t(`generic.months.${workday.date.month.toLowerCase()}`)}</p>
          </Button>
        ))}
      </div>
      {dishes.length ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 pb-[104px]">
          {dishes.map((dish) => <DishCard key={dish.name} dishInfo={dish} selectedDate={selectedDay} />)}
        </div>
      ) : (
        <div className="w-full grid place-items-center min-h-[50dvh]">
          <h2 className="text-2xl font-bold">No chefs found</h2>
        </div>
      )}
    </div>
  );
};

export default ChefDishes;