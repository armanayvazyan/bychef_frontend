import { ICart } from "@/db";
import Button from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { Minus, Plus, Trash2, TriangleAlert } from "lucide-react";

interface ICartItem {
  product: ICart;
  onDeleteItem: (id: string, date: string) => void;
  onChangeQuantity: (id: string, date: string, type: -1 | 1) => void;
}

const CartItem = ({ product, onChangeQuantity, onDeleteItem }: ICartItem) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-extrabold text-zinc-800 mb-4">{product.date}</h1>
      {product.items.map((item, index) => (
        <div key={item.id}>
          <div className="flex items-center gap-4">
            <img src={item.img} alt="cart product image" className="w-[136px] h-[136px] object-cover rounded-xl"/>
            <div>
              <h1 className="text-xl font-extrabold text-zinc-800">{item.name}</h1>
              <p className="text-lg font-semibold text-zinc-800">{`${item.price} դր.`}</p>
              <div className="flex gap-3 items-center mt-8">
                <Button
                  size="icon"
                  onClick={() => {
                    onChangeQuantity(item.id, product.date, -1);
                  }}
                  className="bg-muted hover:bg-muted"
                >
                  <Minus size={16} className="text-foreground"/>
                </Button>
                <p className="text-xl font-extrabold text-zinc-950">{item.quantity}</p>
                <Button
                  size="icon"
                  onClick={() => {
                    onChangeQuantity(item.id, product.date, 1);
                  }}
                  className="bg-muted hover:bg-muted"
                >
                  <Plus size={16} className="text-foreground"/>
                </Button>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost2"
              onClick={() => {
                onDeleteItem(item.id, product.date);
              }}
              className="bg-muted hover:bg-muted"
            >
              <Trash2/>
            </Button>
          </div>
          <div className="flex flex-col gap-3 mt-6">
            {item.notices?.map(notice => (
              <div key={notice} className="flex items-center gap-2">
                <TriangleAlert size={14} className="text-destructive"/>
                <p className="text-destructive font-normal text-sm">{notice}</p>
              </div>
            ))}
          </div>
          {(index !== product.items.length - 1) && <Separator className="my-4" />}
        </div>
      ))}
    </div>
  );
};

export default CartItem;