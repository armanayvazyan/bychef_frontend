import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import FeatureCard from "@/components/ui/illustration-card";

const getIllustrations = (t: TFunction<"translation", "home-page">) => ([
  {
    icon: "https://static.bychef.am/landing/illustration_1.png",
    title: t("illustration1.title"),
    description: t("illustration1.details"),
  },
  {
    icon: "https://static.bychef.am/landing/illustration_2.png",
    title: t("illustration2.title"),
    description: t("illustration2.details"),
  },
  {
    icon: "https://static.bychef.am/landing/illustration_3.png",
    title: t("illustration3.title"),
    description: t("illustration3.details"),
  }
]);

const Illustrations = () => {
  const { t } = useTranslation("translation", { keyPrefix: "home-page" });

  return (
    <div className="container mx-auto px-4 mt-16 mb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
        {getIllustrations(t).map(illustration => (
          <FeatureCard
            key={illustration.title}
            icon={illustration.icon}
            title={illustration.title}
            description={illustration.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Illustrations;