import i18n from "i18next";
import { LOCALES } from "@/types";

const changeLanguage = (lng: LOCALES) => {
  i18n.changeLanguage(lng);
  localStorage.setItem("i18nextLng", lng);
};

export default changeLanguage;