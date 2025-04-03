import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FaqProps {
  className?: string;
}

const Faq = ({ className }: FaqProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "home-page" });

  return (
    <section className={cn("py-16 bg-white", className)}>
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("faq.title")}</h2>
        <div className="w-full max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border border-gray-200 rounded-lg mb-4 px-4">
              <AccordionTrigger className="text-lg font-medium py-6">{t("faq.q1.question")}</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                <p className="mb-2">{t("faq.q1.answer.p1")}</p>
                <p className="mb-2">{t("faq.q1.answer.p2")}</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>{t("faq.q1.answer.p3")}</li>
                  <li>{t("faq.q1.answer.p4")}</li>
                  <li>{t("faq.q1.answer.p5")}</li>
                  <li>{t("faq.q1.answer.p6")}</li>
                  <li>{t("faq.q1.answer.p7")}</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border border-gray-200 rounded-lg mb-4 px-4">
              <AccordionTrigger className="text-lg font-medium py-6">{t("faq.q2.question")}</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {t("faq.q2.answer")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border border-gray-200 rounded-lg mb-4 px-4">
              <AccordionTrigger className="text-lg font-medium py-6">{t("faq.q3.question")}</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {t("faq.q3.answer")}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;