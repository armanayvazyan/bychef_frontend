import Dexie, { EntityTable } from "dexie";

interface ICartItem {
  id: string | number;
  uid: string;
  quantity: number;
  price: number;
  spiceLevel?: number;
}

const db = new Dexie("UserCart") as Dexie & {
  products: EntityTable<
    ICartItem,
    "uid"
  >;
};

// Schema declaration:
db.version(1).stores({
  products: "uid"
});

export type { ICartItem };
export { db };