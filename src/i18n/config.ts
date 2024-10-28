import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import hy from "@/locales/hy.json";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "hy",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      hy: {
        translation: hy,
      },
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;