import { useEffect } from "react";
import { LOCALES } from "@/types";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
<<<<<<< Updated upstream
import { useEffect } from "react";
import { logPageOpenEvent } from "@/analytics/Events";

const fetchTermsContent = async (locale: LOCALES) => {
  try {
    const response = await fetch(`https://static.bychef.am/docs/terms/${locale}_latest.html`);

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const html = await response.text();

    return html as TrustedHTML;
  } catch(error) {
    console.log(error);
  }
};
=======
import { fetchTermsContent } from "@/server-actions";
import { logPageOpenEvent } from "@/analytics/Events";
>>>>>>> Stashed changes

const TermsConditions = () => {
  const { i18n } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["terms", i18n.language],
    queryFn: () => fetchTermsContent(i18n.language.split("-")[0] as LOCALES),
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

export default TermsConditions;