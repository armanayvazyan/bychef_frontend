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
  products: EntityTable<
    ICart,
    "date"
  >;
};

// Schema declaration:
db.version(1).stores({
  products: "date, items"
});

export type { ICartItem };
export { db };