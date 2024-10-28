import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Faq = () => {
  const { t } = useTranslation("translation", { keyPrefix: "home-page" });

  return (
    <section className="flex flex-col items-center mt-16 px-4">
      <h1 className="text-2xl">FAQ</h1>
      <Accordion type="single" collapsible className="w-full max-w-[498px]">
        <AccordionItem value="item-1">
          <AccordionTrigger>{t("faq.q1.question")}</AccordionTrigger>
          <AccordionContent>
            <p>{t("faq.q1.answer.p1")}</p>
            <p>{t("faq.q1.answer.p2")}</p>
            <ol>
              <li>1. {t("faq.q1.answer.p3")}</li>
              <li>2. {t("faq.q1.answer.p4")}</li>
              <li>3. {t("faq.q1.answer.p5")}</li>
              <li>4. {t("faq.q1.answer.p6")}</li>
              <li>5. {t("faq.q1.answer.p7")}</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>{t("faq.q2.question")}</AccordionTrigger>
          <AccordionContent>
            {t("faq.q2.answer")}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>{t("faq.q3.question")}</AccordionTrigger>
          <AccordionContent>
            {t("faq.q3.answer")}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default Faq;