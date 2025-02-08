import Dexie, { EntityTable } from "dexie";

interface ICartItem {
  id: number;
  uid: string;
  price: number;
  chefId?: number;
  quantity: number;
  spiceLevel?: number;
  additions?: Record<string, number>;
}

interface ILocation {
  id: string;
  address: string;
  coordinates: { lng: number; lat: number };
}

const db = new Dexie("UserCart") as Dexie & {
  products: EntityTable<
    ICartItem,
    "uid"
  >;
  location: EntityTable<
    ILocation,
    "id"
  >
};

// Schema declaration:
db.version(1).stores({
  products: "uid, chefId",
  location: "id",
});

export type { ICartItem };
export { db };