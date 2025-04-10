import React from "react";
import Button from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ContactCtaProps {
  className?: string;
}

const ContactCta: React.FC<ContactCtaProps> = ({ className }) => {
  const { t } = useTranslation("translation", { keyPrefix: "partners-page" });

  return (
    <section className={cn("py-16 bg-gray-50", className)} aria-labelledby="contact-title">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 id="contact-title" className="text-3xl md:text-4xl font-bold text-center mb-3">
          {t("contact.join-today")}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {t("contact.subtitle")}
        </p>
        <a href="tel:+37477916666" aria-label={t("contact.btn")}>
          <Button
            className="rounded-full px-8 py-2 bg-red-500 hover:bg-red-600 text-white"
            size="lg"
          >
            {t("contact.btn")}
          </Button>
        </a>
      </div>
    </section>
  );
};

export default ContactCta;