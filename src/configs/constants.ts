import { PAYMENT_TYPES } from "@/types";

export const PHONE_NUMBER_PREFIX = "+374";
export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
export const SB_KEY = import.meta.env.VITE_SB_KEY;
export const YMAP_KEY = import.meta.env.VITE_YMAP_KEY;
export const IDRAM_ORDER_ID_PREFIX = import.meta.env.VITE_IDRAM_ORDER_ID_URL_PREFIX;
export const YMAP_SEARCH_RESULTS_COUNT = import.meta.env.VITE_YMAP_SEARCH_RESULTS_COUNT;
export const ANALYTICS_AMPLITUDE_KEY = import.meta.env.VITE_ANALYTICS_AMPLITUDE_KEY;
export const FIREBASE_VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
export const MAX_ORDER_PRICE_BY_CASH = 20000;
export const CHEFS_PER_PAGE_COUNT = 8;
export const DATA_DEFAULT_STALE_TIME = 60 * 10 * 1000;
export const DATA_DEFAULT_CACHE_TIME = 2 * DATA_DEFAULT_STALE_TIME;
export const MIN_CART_ITEM_QUANTITY = 1;

export const PAYMENT_METHODS = {
  CARD: { value: PAYMENT_TYPES.CARD, logo: "https://static.bychef.am/icons/card-arca.svg" },
  IDRAM: { value: PAYMENT_TYPES.IDRAM, logo: "https://static.bychef.am/icons/card-idram.svg" },
  CASH: { value: PAYMENT_TYPES.CASH, logo: "https://static.bychef.am/icons/cash.svg" },
};