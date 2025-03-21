import { ILocalizedData } from "@/types";

const getDataByLocale = (collection: ILocalizedData[], locale: string, defaultLocale = "hy") => {
  const refinedLocale = locale.split("-")[0];
  const value = collection.find((item: ILocalizedData) => item.languageCode === refinedLocale)?.value;

  if (value) return value;

  {
    const refinedDefaultLocale = defaultLocale.split("-")[0];
    return collection.find((item: ILocalizedData) => item.languageCode === refinedDefaultLocale)?.value;
  }
};

export const getDataStringByLocale = (obj: object, key: string, locale: string, defaultLocale = "hy") => {
  const refinedLocale = locale.split("-")[0];
  const keyLocale = refinedLocale.charAt(0).toUpperCase() + refinedLocale.slice(1);
  const value = obj[(key + keyLocale) as keyof typeof obj];

  if (value) return value;

  {
    const refinedDefaultLocale = defaultLocale.split("-")[0];
    const keyLocale = refinedDefaultLocale.charAt(0).toUpperCase() + refinedDefaultLocale.slice(1);
    return obj[(key + keyLocale) as keyof typeof obj];
  }
};

export default getDataByLocale;