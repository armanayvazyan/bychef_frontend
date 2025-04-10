import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
  <article className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
    <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-semibold mb-6" aria-hidden="true">
      {number}
    </div>
    <h3 className="font-medium text-xl mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </article>
);

interface JoinStepsProps {
  className?: string;
}

const JoinSteps: React.FC<JoinStepsProps> = ({ className }) => {
  const { t } = useTranslation("translation", { keyPrefix: "partners-page" });

  return (
    <section className={cn("py-16 bg-gray-50", className)} aria-labelledby="join-steps-title">
      <div className="container mx-auto px-4">
        <h2 id="join-steps-title" className="text-3xl md:text-4xl font-bold text-center mb-3">{t("how_it_works_title")}</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {t("how_it_works_subtitle")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            number={1}
            title={t("step_1_title")}
            description={t("step_1_desc")}
          />
          <StepCard
            number={2}
            title={t("step_2_title")}
            description={t("step_2_desc")}
          />
          <StepCard
            number={3}
            title={t("step_3_title")}
            description={t("step_3_desc")}
          />
        </div>
      </div>
    </section>
  );
};

export default JoinSteps;