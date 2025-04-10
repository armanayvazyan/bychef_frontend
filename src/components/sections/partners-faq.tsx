import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface PartnersFaqProps {
  className?: string;
}

const PartnersFaq = ({ className }: PartnersFaqProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "partners-page" });

  return (
    <section className={cn("py-10 md:py-16 bg-white", className)} aria-labelledby="faq-title">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 id="faq-title" className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12">{t("faq_title")}</h2>
        <div className="w-full max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border border-gray-200 rounded-lg mb-3 md:mb-4 px-3 md:px-4">
              <AccordionTrigger className="text-base md:text-lg font-medium py-4 md:py-6 pr-2 text-left">{t("faq.q1.question")}</AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-gray-600 pb-4">
                <p>{t("faq.q1.answer")}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border border-gray-200 rounded-lg mb-3 md:mb-4 px-3 md:px-4">
              <AccordionTrigger className="text-base md:text-lg font-medium py-4 md:py-6 pr-2 text-left">{t("faq.q2.question")}</AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-gray-600 pb-4">
                {t("faq.q2.answer")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border border-gray-200 rounded-lg mb-3 md:mb-4 px-3 md:px-4">
              <AccordionTrigger className="text-base md:text-lg font-medium py-4 md:py-6 pr-2 text-left">{t("faq.q3.question")}</AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-gray-600 pb-4">
                {t("faq.q3.answer")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border border-gray-200 rounded-lg mb-3 md:mb-4 px-3 md:px-4">
              <AccordionTrigger className="text-base md:text-lg font-medium py-4 md:py-6 pr-2 text-left">{t("faq.q4.question")}</AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-gray-600 pb-4">
                {t("faq.q4.answer")}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default PartnersFaq;