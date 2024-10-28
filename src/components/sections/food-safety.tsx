import { useTranslation } from "react-i18next";
import ImageSection from "@/components/ui/image-section";

const FoodSafety = () => {
  const { t } = useTranslation("translation", { keyPrefix: "home-page" });

  return (
    <ImageSection
      title={t("food-safety.title")}
      text={t("food-safety.details")}
      imgSrc="https://static.bychef.am/landing/food-safety.jpg"
    />
  );
};

export default FoodSafety;