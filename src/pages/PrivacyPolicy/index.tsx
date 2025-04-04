import { useEffect } from "react";
import { LOCALES } from "@/types";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { logPageOpenEvent } from "@/analytics/Events";
import { fetchPrivacyContent } from "@/server-actions";

const PrivacyPolicy = () => {
  const { i18n } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["terms", i18n.language],
    queryFn: () => fetchPrivacyContent(i18n.language.split("-")[0] as LOCALES),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    logPageOpenEvent();
  }, []);

  return (
    <section className="px-[10%] py-20">
      {data && <div className="leading-loose [&_li]:ms-3" dangerouslySetInnerHTML={{ __html: data }} />}
      {isLoading && (
        <Skeleton className="w-full h-[500px] rounded-md" />
      )}
    </section>
  );
};

export default PrivacyPolicy;