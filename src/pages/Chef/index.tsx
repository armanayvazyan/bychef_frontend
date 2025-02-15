import { ChevronLeft } from "lucide-react";
import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ChefDishes from "@/components/sections/chef-dishes";
import ChefDetails from "@/components/sections/chef-details";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/hooks/use-fetch-data";
import ChefInfoContext from "@/context/chef-info-context";
import { IChefInfo } from "@/types";
import { useEffect } from "react";
import { logPageOpenEvent } from "@/analytics/Events";

const fetchChef = async (id: string): Promise<IChefInfo | undefined> => {
  const data = await fetchApi(
    {
      initialPath: "chef/",
      pathExtension: id
    }
  );

  return data?.result;
};

const Chef = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
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
    queryFn: () => fetchChef(id ?? ""),
    refetchOnWindowFocus: false
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
        {/* TODO: loading skeletons */}
        {chefInfo && <ChefDetails />}
        {chefInfo && <ChefDishes />}
      </section>
    </ChefInfoContext.Provider>
  );
};

export default Chef;