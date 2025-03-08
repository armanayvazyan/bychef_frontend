import { memo, MouseEvent } from "react";
import { Minus, Plus } from "lucide-react";
import Button from "@/components/ui/button";

interface IItemQuantityButtonGroupProps {
  quantity: number;
  onIncrement?: (e: MouseEvent<HTMLButtonElement>) => void;
  onDecrement?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ItemQuantityButtonGroup = ({ quantity, onIncrement, onDecrement }: IItemQuantityButtonGroupProps) => {
  return (
    <div className="flex gap-3 items-center">
      <Button
        size="icon"
        onClick={onDecrement}
        className="bg-muted hover:bg-muted w-[32px] h-[32px]"
      >
        <Minus size={14} className="text-foreground"/>
      </Button>
      <p className="text-lg font-extrabold text-zinc-950">{quantity}</p>
      <Button
        size="icon"
        onClick={onIncrement}
        className="bg-muted hover:bg-muted w-[32px] h-[32px]"
      >
        <Plus size={14} className="text-foreground"/>
      </Button>
    </div>
  );
};

export default memo(ItemQuantityButtonGroup);