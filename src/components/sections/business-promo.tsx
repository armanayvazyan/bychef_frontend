import React from "react";
import Button from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface BusinessPromoProps {
  backgroundImage?: string;
  className?: string;
}

const BusinessPromo: React.FC<BusinessPromoProps> = ({ 
  backgroundImage,
  className 
}) => {
  const { t } = useTranslation("translation", { keyPrefix: "partners-page" });

  return (
    <header 
      className={cn(
        "relative w-full h-[400px] flex flex-col justify-center items-center text-center text-white py-12 bg-gradient-to-r from-red-500/90 to-orange-400/90",
        className
      )}
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } : {}}
    >
      <div className="container max-w-3xl px-4">
        <h1 id="partners-page-title" className="text-3xl md:text-5xl font-bold mb-4">
          {t("hero_title")}
        </h1>
        <p className="text-base md:text-xl mb-8">
          {t("hero_subtitle")}
        </p>
        <a href="tel:+37477916666" aria-label={t("contact.btn")}>
          <Button 
            className="rounded-full px-8 py-2 bg-red-500 hover:bg-red-600 text-white"
            size="lg"
          >
            {t("hero_cta")}
          </Button>
        </a>
      </div>
    </header>
  );
};

export default BusinessPromo; 