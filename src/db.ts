import Dexie, { EntityTable } from "dexie";
import { ICartItem, ILocation } from "./types";

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