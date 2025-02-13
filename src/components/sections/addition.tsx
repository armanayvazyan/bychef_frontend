import { MouseEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { getDataStringByLocale } from "@/helpers/getDataByLocale";
import { useTranslation } from "react-i18next";
import { IDishAddition } from "@/types";

interface IAdditionProps {
  isActive: boolean,
  additionInfo: IDishAddition,
  onSelectAddition: (e: MouseEvent<HTMLDivElement>) => void,
}

const Addition = ({ additionInfo, onSelectAddition, isActive }: IAdditionProps) => {
  const { i18n } = useTranslation();
  const additionName = getDataStringByLocale(additionInfo, "name", i18n.language);

  return (
    <div
      role="button"
      data-id={additionInfo.id}
      data-price={additionInfo.price}
      onClick={onSelectAddition}
      className="flex gap-4 items-center px-4 py-2 border-border border-[1px] rounded-md hover:bg-secondary"
    >
      <Checkbox
        id="terms"
        checked={isActive}
        className="pointer-events-none"
      />
      <label
        htmlFor="terms"
        className="flex pointer-events-none gap-2 items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        <p>{additionName}</p>
        <p className="font-bold text-base">{`(+${additionInfo.price} ֏)`}</p>
      </label>
    </div>
  );
};

export default Addition;