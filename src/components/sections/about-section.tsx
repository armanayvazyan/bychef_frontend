import { useTranslation } from "react-i18next";
import ImageSection from "@/components/ui/image-section";

const AboutSection = () => {
  const { t } = useTranslation("translation", { keyPrefix: "home-page" });

  return (
    <ImageSection
      title={t("about-us.title")}
      text={t("about-us.details")}
      imgSrc="https://static.bychef.am/landing/about-us.jpg"
    />
  );
};

export default AboutSection;