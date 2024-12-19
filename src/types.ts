export enum LOCALES {
  HY = "hy",
  EN = "en",
  RU = "ru"
}

export interface IChefAvailableDates {
  dayOfTheWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  isAvailable: boolean
}

export interface IChefLegalInfo {
  id: number,
  taxNumber: string,
  legalName: string,
  address: {
    id: number,
    country: string,
    city: string,
    street: string,
    home: string
  }
}

export interface IChefInfo {
  id: number,
  phoneNumber: string,
  email: string,
  chefLegalDto: IChefLegalInfo,
  avatarUrl: string,
  bannerUrl: string,
  status: string,
  telegramId: string,
  fullNameAm: string | null,
  fullNameEn: string | null,
  fullNameRu: string | null,
  descriptionEn: string | null,
  descriptionAm: string | null,
  descriptionRu: string | null,
  kitchenEn: string | null,
  kitchenAm: string | null,
  kitchenRu: string | null,
  rating: number,
  chefAvailableDtoList: IChefAvailableDates,
  socialLinkDtos: []
  chefAvailabilityExceptionDayDtoList: [],
}

export interface IChefLabelsDto {
  id: number,
  name: string,
  chefLabelTranslationSet: {
    languageCode: string,
    value: string
  }[],
}

export interface IChefGenericInfo {
  id: number,
  phoneNumber: string,
  email: string,
  avatarUrl: string,
  bannerUrl: string,
  status: string,
  telegramId: string,
  fullNameAm: string | null,
  fullNameEn: string | null,
  fullNameRu: string | null,
  descriptionEn: string | null,
  descriptionAm: string | null,
  descriptionRu: string | null,
  kitchenEn: string | null,
  kitchenAm: string | null,
  kitchenRu: string | null,
  type: string | null,
  rating: number,
  chefAvailableDates: string[],
  chefLegalDto: IChefLegalInfo,
  chefLabelDtos?: IChefLabelsDto[]
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

export interface IChefsPage {
  activeChefResponseDtoList: IChefGenericInfo[];
  count: number;
}