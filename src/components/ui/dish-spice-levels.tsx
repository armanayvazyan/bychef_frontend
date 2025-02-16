import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { IAdjustableSpiceLevelDtoList } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface IDishSpiceLevelsProps {
  selectedSpiceLevel?: string;
  spiceLevels: IAdjustableSpiceLevelDtoList[];
  onChangeSpiceLevel: (value: string) => void;
}

const DishSpiceLevels = ({ spiceLevels, selectedSpiceLevel, onChangeSpiceLevel }: IDishSpiceLevelsProps) => {
  const { t } = useTranslation();

  return (
    <RadioGroup value={selectedSpiceLevel}>
      {spiceLevels.map(spiceLevelInfo => (
        <div
          key={spiceLevelInfo.id}
          onClick={() => { onChangeSpiceLevel(spiceLevelInfo.id.toString()); }}
          className="flex gap-4 cursor-pointer items-center px-4 py-2 border-border border-[1px] rounded-md hover:bg-secondary"
        >
          <RadioGroupItem
            id={spiceLevelInfo.id.toString()}
            value={spiceLevelInfo.id.toString()}
            className="w-[20px] h-[20px]" circleSize={10}
          />
          <img
            className="h-[28px]"
            alt="spice level icon"
            src={`https://static.bychef.am/icons/${spiceLevelInfo.spiceLevel}.svg`}
          />
          <Label className="cursor-pointer" htmlFor="option-one">
            {t(`spice-levels.${spiceLevelInfo.spiceLevel}`)}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default DishSpiceLevels;