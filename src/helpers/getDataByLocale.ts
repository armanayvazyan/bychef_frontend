import { ILocalizedData } from "@/types";

const getDataByLocale = (collection: ILocalizedData[], locale: string) => {
  return collection.find((item: ILocalizedData) => item.languageCode === locale)?.value;
};

export default getDataByLocale;