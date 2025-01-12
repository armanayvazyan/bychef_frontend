import Dexie, { EntityTable } from "dexie";

interface ICartItem {
  id: string | number;
  quantity: number;
  price: number
}

const db = new Dexie("UserCart") as Dexie & {
  products: EntityTable<
    ICartItem,
    "id"
  >;
};

// Schema declaration:
db.version(1).stores({
  products: "id"
});

export type { ICartItem };
export { db };