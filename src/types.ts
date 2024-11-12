export enum LOCALES {
  HY = "hy",
  EN = "en",
  RU = "ru"
}

export interface IDishInfo {
  id: string;
  name: string,
  isAvailable: boolean,
  isVegan: boolean,
  img: string,
  price: number,
  dishes: string[],
  ingredients: string[],
  options?: { id: number, question: string }[],
  notices?: string[],
  onAddToCard: () => void;
}