import analyticManager from "./AnalyticsManager";
import { IDishInfo } from "@/types";

export const logPageOpenEvent = (additionalProperties?: Record<string, any>): void => {
  const properties: Record<string, string | null> = {
    page: sessionStorage.getItem("currentPage"),
    origin: sessionStorage.getItem("previousPage"),
    ...additionalProperties
  };

  if (properties.origin === "direct") {
    properties.referrer_url = document.referrer;
  }
  analyticManager.logEvent("page_open", properties);
};

export const logLanguageApplyEvent = (language: string): void => {
  const properties: Record<string, string | null> = {
    language: language,
    page: sessionStorage.getItem("currentPage")
  };
  analyticManager.logEvent("language_apply", properties);
};

export const logChefClickEvent = (chefId: number): void => {
  const properties: Record<string, any> = {
    chef_id: chefId,
    page: sessionStorage.getItem("currentPage"),
  };
  analyticManager.logEvent("chef_click", properties);
};

export const logDishClickEvent= (dishInfo: IDishInfo): void => {
  const properties: Record<string, any> = {
    dish_id: dishInfo.id,
    dish_name: dishInfo.nameEn,
    dish_type: dishInfo.type,
    chef_id: Number(sessionStorage.getItem("currentChefId")),
  };
  analyticManager.logEvent("dish_click", properties);
};

export const logCartAddEvent = (dishId: number, count: number, source: string, spiceLevelChanged: boolean): void => {
  const properties: Record<string, any> = {
    chef_id: Number(sessionStorage.getItem("currentChefId")),
    count: count,
    dish_id: dishId,
    source: source,
    spice_level_change: spiceLevelChanged,
    page: sessionStorage.getItem("currentPage"),
  };
  analyticManager.logEvent("cart_add", properties);
};

export const logCartItemQuantityChangedEvent = (dishId: number, count: number, newCount: number, source: "cart" | "checkout"): void => {
  const properties: Record<string, any> = {
    chef_id: Number(sessionStorage.getItem("currentChefId")),
    dish_id: dishId,
    original_count: count,
    new_count: newCount,
    operation: count > newCount ? "remove" : "add",
    source: source
  };
  analyticManager.logEvent("cart_item_quantity_changed", properties);
};

export const logCartItemDeletedEvent = (dishId: number, count: number, source: "cart" | "checkout"): void => {
  const properties: Record<string, any> = {
    chef_id: Number(sessionStorage.getItem("currentChefId")),
    dish_id: dishId,
    count: count,
    source: source,
  };
  analyticManager.logEvent("cart_item_deleted", properties);
};

export const logCartOpenEvent = (): void => {
  const properties: Record<string, any> = {
    page: sessionStorage.getItem("currentPage")
  };
  analyticManager.logEvent("cart_open", properties);
};

export const logOrderReceiptDownloadedEvent = (orderNumber: string): void => {
  const properties: Record<string, any> = {
    order_number: orderNumber
  };
  analyticManager.logEvent("order_receipt_downloaded", properties);
};

export const logOrderPlacedEvent = (paymentMethod: string, deliveryPrice: number, totalPrice: number, deliveryOption: string, deliveryTime: string, deliveryDate: string, userPhoneNumber: string, deliveryMethod: string, orderedDishes: Record<string, any>[]): void => {
  const properties: Record<string, any> = {
    chef_id: Number(sessionStorage.getItem("currentChefId")),
    payment_method: paymentMethod,
    delivery_option: deliveryOption,
    total_price: totalPrice,
    delivery_price: deliveryPrice,
    delivery_date: deliveryDate,
    delivery_time: deliveryTime,
    order: orderedDishes,
    user_phone_number: userPhoneNumber,
    delivery_method: deliveryMethod,
    page: sessionStorage.getItem("currentPage"),
  };
  analyticManager.logEvent("order_placed", properties);
};