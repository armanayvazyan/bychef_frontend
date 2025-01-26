import Dexie, { EntityTable } from "dexie";

interface ICartItem {
  id: number;
  uid: string;
  quantity: number;
  price: number;
  spiceLevel?: number;
  additions?: Record<string, number>;
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