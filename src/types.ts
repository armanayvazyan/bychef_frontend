export enum LOCALES {
  HY = "hy",
  EN = "en",
  RU = "ru"
}

export interface IDishInfo {
  id: string;
  img: string,
  name: string,
  price: number,
  isVegan: boolean,
  dishes: string[],
  isAvailable: boolean,
  ingredients: string[],
  onAddToCard: () => void;
  options?: { id: number, question: string }[],
  notices?: {
    key: "orderDaysAhead" | "orderHoursAhead",
    time: number
  }[],
}