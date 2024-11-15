import Dexie, { EntityTable } from "dexie";

interface ICartItem {
  id: string;
  img: string;
  name: string;
  price: number;
  quantity: number;
  notices?: string[];
}

export interface ICart {
  date: string;
  items: ICartItem[];
}

const db = new Dexie("UserCart") as Dexie & {
  generalInfo?: EntityTable<{
    id: string,
    price: number,
  }, "id">;
  products: EntityTable<
    ICart,
    "date"
  >;
};

// Schema declaration:
db.version(1).stores({
  generalInfo: "id, price",
  products: "date, items"
});

export type { ICartItem };
export { db };