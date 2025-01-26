import { TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

const DishModalAlert = ({ date }: { date: number }) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3">
      <TriangleAlert size={24} className="text-destructive"/>
      <p className="text-destructive font-normal text-sm">
        {t("generic.order-days-ahead", { timeAhead: date })}
      </p>
    </div>
  );
};

export default DishModalAlert;