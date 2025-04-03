import React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ForPartnersProps {
  className?: string;
}

const ForPartners: React.FC<ForPartnersProps> = ({ className }) => {
  const { t } = useTranslation("translation", { keyPrefix: "home-page.for-partners" });

  return (
    <section className={cn("py-16 bg-gradient-to-r from-red-50 to-orange-50", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-gray-600 mb-8 text-lg">{t("description")}</p>
          <Link to="/partners">
            <Button className="rounded-full px-8 py-2 bg-red-500 hover:bg-red-600 text-white">
              {t("cta")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForPartners; 