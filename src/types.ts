export enum LOCALES {
  HY = "hy",
  EN = "en",
  RU = "ru"
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

export interface IChefAvailableDates {
  date: string
  timeFrom: string
  timeTo: string
}

export interface IChefAvailabilityExceptionDays {
  id: number,
  exceptionDate: string,
  isAvailable: boolean
}

export interface IChefInfo {
  id: number,
  phoneNumber: string,
  email: string,
  chefLegals: IChefLegalInfo,
  avatarUrl: string,
  bannerUrl: string,
  status: string,
  telegramId: string,
  name: ILocalizedData[],
  description: ILocalizedData[],
  kitchen: ILocalizedData[],
  rating: number,
  dishes: IDishInfo[],
  chefLabels?: IChefLabelsDto[],
  socialLinks: {
    id: number;
    link: string;
    socialType: string | null;
  }[],
  chefAvailabilityExceptionDays: IChefAvailabilityExceptionDays[],
  chefAvailableDates?: IChefAvailableDates[]
}

export interface ILocalizedData {
  languageCode: string;
  value: string;
}

export interface IChefLabelsDto {
  id: number,
  name: string,
  chefLabelTranslationSet: ILocalizedData[],
}

export interface IChefGenericInfo {
  id: number,
  phoneNumber: string,
  email: string,
  avatarUrl: string,
  bannerUrl: string,
  status: string,
  telegramId: string,
  name: ILocalizedData[],
  description: ILocalizedData[],
  kitchen: ILocalizedData[],
  type: string | null,
  rating: number,
  chefAvailableDates: string[],
  chefLegals: IChefLegalInfo,
  chefLabels?: IChefLabelsDto[]
}

export interface IChefsPage {
  exploreChefResponseDtoList: IChefGenericInfo[];
  count: number;
}

export interface IAdjustableSpiceLevelDtoList {
  id: number
  spiceLevel: string
}

export interface IDietaryOptionDtoList {
  id: number
  dietaryOptionValue: string
}

export interface IIngredientsDto {
  id: number
  ingredientEn: string
  ingredientRu: string
  ingredientHy: string
}

export interface IDishTagDto {
  id: number
  tag: string
  translations: ILocalizedData[]
}

export interface IDishCuisineTagDto {
  id: number
  cuisineTag: string
  translations: ILocalizedData[]
}

export interface IDishAddition {
  id: number;
  nameEn: string;
  nameHy: string;
  nameRu: string;
  price: number;
}

export interface IDishInfo {
  id: number
  nameEn: string
  nameHy: string
  nameRu: string
  chefId: number
  price: number
  type: string
  portionAm: string
  portionRu: string
  portionEn: string
  status: string
  url: string
  orderBefore: number
  spiceLevel: number
  expirationDate: number
  adjustableSpiceLevelDtoList: IAdjustableSpiceLevelDtoList[]
  dietaryOptionDtoList: IDietaryOptionDtoList[]
  ingridientsDto: IIngredientsDto[]
  dishAdditionDtoList: IDishAddition[]
  dishTagDtos: IDishTagDto[]
  dishCuisineTagDto: IDishCuisineTagDto
}

export enum EInputNames {
  email = "email",
  address = "address",
  apartment = "apartment",
  entrance = "entrance",
  floor = "floor",
  phone = "phone",
  notes = "notes",
  delivery_date = "delivery_date",
  delivery_time = "delivery_time",
  payment_method = "payment_method",
  coordinates = "coordinates",
  door2Door = "door2Door",
}

export enum EFailedOrderInputNames {
  payment_type = "paymentType",
  order_number = "orderNumber"
}

export interface IFetchApiReturnType {
  result?: any;
  error?: string;
  status?: number;
  isInjected: boolean;
}

export interface ICartItem {
  id: number;
  uid: string;
  price: number;
  chefId?: number;
  quantity: number;
  spiceLevel?: number;
  orderBefore?: number;
  additions?: Record<string, number>;
}

export interface ILocation {
  id: string;
  address: string;
  coordinates: { lng: number; lat: number };
}

export interface ISuggestion {
  address: string;
  location: string
}

export interface ISelectedProductInfo {
  quantity: number;
  spiceLevelId?: number,
  orderInAdvanceDays?: number,
  additions?: Record<string, number>
}