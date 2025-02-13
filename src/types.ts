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
  chefAvailableDates: string[],
  chefLabels?: IChefLabelsDto[],
  socialLinks: {
    id: number;
    link: string;
    socialType: string | null;
  }[],
  chefAvailabilityExceptionDays: { id: number; exceptionDate: string, isAvailable: boolean }[],
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
  coordinates = "coordinates"
}