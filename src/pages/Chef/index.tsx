import { ChevronLeft } from "lucide-react";
import Button from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { chefInfo } from "@/configs/constants";
import ChefDishes from "@/components/sections/chef-dishes";
import ChefDetails from "@/components/sections/chef-details";

const Chef = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="px-6 md:px-[10%]">
      <Button
        variant="ghost2"
        onClick={() => { navigate(-1); }}
        className="flex items-center gap-2 mt-6 p-0"
      >
        <ChevronLeft size={20} />
        <p className="text-sm text-primary font-semibold">{t("generic.back")}</p>
      </Button>
      <ChefDetails details={chefInfo} />
      <ChefDishes workdays={chefInfo.workingDays} />
    </section>
  );
};

export default Chef;