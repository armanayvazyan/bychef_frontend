import { ILocalizedData } from "@/types";

const getDataByLocale = (collection: ILocalizedData[], locale: string) => {
  return collection.find((item: ILocalizedData) => item.languageCode === locale.split("-")[0])?.value;
};

export const getDataStringByLocale = (obj: object, key: string, locale: string) => {
  const keyLocale = locale.charAt(0).toUpperCase() + locale.slice(1);
  return obj[(key + keyLocale) as keyof typeof obj];
};

export default getDataByLocale;