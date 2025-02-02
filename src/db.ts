import Dexie, { EntityTable } from "dexie";

interface ICartItem {
  id: number;
  uid: string;
  quantity: number;
  price: number;
  spiceLevel?: number;
  additions?: Record<string, number>;
}

interface ILocation {
  id: string;
  address: string;
  coordinates: { lng: string; lat: string };
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
  products: "uid",
  location: "id",
});

export type { ICartItem };
export { db };