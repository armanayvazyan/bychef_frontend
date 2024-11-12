import { useState } from "react";
import { db } from "@/db";
import { IDishInfo } from "@/types";
import Button from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import Separator from "@/components/ui/separator";
import { Minus, Plus, TriangleAlert } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";

interface IDishModal {
  dishInfo: IDishInfo;
  selectedDate: string;
}

const DishModal = ({ selectedDate, dishInfo }: IDishModal) => {
  const { toast } = useToast();
  const [product, setProduct] = useState<{ quantity: number; }>({
    quantity: 1,
  });

  const handleIncrement = () => {
    setProduct((prevValue) => {
      return { quantity: prevValue.quantity > 19 ? prevValue.quantity : prevValue.quantity + 1 };
    });
  };

  const handleDecrement = () => {
    setProduct((prevValue) => {
      return { quantity: prevValue.quantity < 2 ? prevValue.quantity : prevValue.quantity - 1 };
    });
  };

  const handleOptionSelect = (name: string, value: string) => {
    setProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddToCart = async () => {
    try {
      const selectedDateExistsInCart = await db.products.get(selectedDate);
      const updatedCartList = selectedDateExistsInCart?.items ?? [];
      const itemIndexInCart = updatedCartList.findIndex(item => item.id === dishInfo.id);
      const isAlreadyInTheCart = itemIndexInCart !== -1;

      if (selectedDateExistsInCart && isAlreadyInTheCart) {
        updatedCartList[itemIndexInCart].quantity += product.quantity;
      } else {
        updatedCartList.push({
          id: dishInfo.id,
          img: dishInfo.img,
          name: dishInfo.name,
          price: dishInfo.price,
          notices: dishInfo.notices,
          ...product,
        });
      }

      await db.products.put({
        date: selectedDate,
        items: updatedCartList,
      }, selectedDate);

      toast({
        title: "Product added to cart!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error?.toString(),
      });
    }
  };

  return (
    <>
      <img src={dishInfo.img} alt="dish image" className="w-full h-[282px] object-cover rounded-xl"/>
      <div className="h-[365px] overflow-y-scroll">
        <p className="text-base text-zinc-400 font-medium mt-4">{dishInfo.dishes.join(" • ")}</p>
        <DialogTitle className="mt-4">
          <p className="text-zinc-900 text-lg font-bold">{dishInfo.name}</p>
        </DialogTitle>
        <DialogDescription className="mt-3">
          <p className="text-zinc-500 text-base font-medium">{dishInfo.ingredients.join(", ")}</p>
        </DialogDescription>
        <div className="flex gap-3 items-center mt-8">
          <Button
            size="icon"
            onClick={handleDecrement}
            className="bg-muted hover:bg-muted"
          >
            <Minus size={16} className="text-foreground"/>
          </Button>
          <p className="text-xl font-extrabold text-zinc-950">{product.quantity}</p>
          <Button
            size="icon"
            onClick={handleIncrement}
            className="bg-muted hover:bg-muted"
          >
            <Plus size={16} className="text-foreground"/>
          </Button>
        </div>
        <div className="flex flex-col gap-3 mt-6">
          {dishInfo.notices?.map(notice => (
            <div key={notice} className="flex gap-3">
              <TriangleAlert size={24} className="text-destructive"/>
              <p className="text-destructive font-normal text-base">{notice}</p>
            </div>
          ))}
        </div>
        <Separator className="my-4"/>
        <div className="flex flex-col gap-4">
          {dishInfo.options?.map(({ id, question }) => (
            <div key={id} className="flex flex-col gap-2">
              {question}
              <RadioGroup
                defaultValue="option-one"
                className="flex items-end space-y-1"
                onValueChange={(value: string) => {
                  handleOptionSelect(question, value);
                }}
              >
                <div className="flex gap-2 items-center">
                  <RadioGroupItem value="option-one" id="option-one"/>
                  <Label className="text-sm font-medium text-zinc-900" htmlFor="option-one">Այո</Label>
                </div>
                <div className="flex gap-2 items-center">
                  <RadioGroupItem value="option-two" id="option-two"/>
                  <Label className="text-sm font-medium text-zinc-900" htmlFor="option-two">Ոչ</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button className="w-full" onClick={handleAddToCart}>Ավելացնել</Button>
      </DialogFooter>
    </>
  );
};

export default DishModal;