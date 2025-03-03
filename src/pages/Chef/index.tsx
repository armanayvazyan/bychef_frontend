import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Button from "@/components/ui/button";
import { fetchChef } from "@/server-actions";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { logPageOpenEvent } from "@/analytics/Events";
import { useNavigate, useParams } from "react-router-dom";
import ChefInfoContext from "@/context/chef-info-context";
import ChefDishes from "@/components/sections/chef-dishes";
import ChefDetails from "@/components/sections/chef-details";
import { DATA_DEFAULT_CACHE_TIME, DATA_DEFAULT_STALE_TIME } from "@/configs/constants";
import useServerError from "@/hooks/useServerError";

const Chef = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleServerError } = useServerError();

  useEffect(() => {
    logPageOpenEvent({
      chef_id: Number(id)
    });
  }, []);

  const {
    data: chefInfo,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["chef", id],
    queryFn: () => fetchChef(id ?? "", handleServerError),
    staleTime: DATA_DEFAULT_STALE_TIME,
    gcTime: DATA_DEFAULT_CACHE_TIME,
    refetchOnWindowFocus: false,
  });

  const handleNavigateBack = () => { navigate("/explore"); };

  return (
    <ChefInfoContext.Provider value={{
      info: chefInfo,
      error,
      isLoading: isFetching
    }}>
      <section className="px-6 md:px-[10%]">
        <Button
          variant="ghost2"
          onClick={handleNavigateBack}
          className="flex items-center gap-2 mt-6 p-0"
        >
          <ChevronLeft size={20} />
          <p className="text-sm text-primary font-semibold">{t("generic.back")}</p>
        </Button>
        {chefInfo && <ChefDetails />}
        {chefInfo && <ChefDishes />}
      </section>
    </ChefInfoContext.Provider>
  );
};

export default Chef;