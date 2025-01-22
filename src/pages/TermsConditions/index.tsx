import { LOCALES } from "@/types";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/hooks/use-fetch-data";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTermsContent = async (locale: LOCALES) => {
  const response = await fetchApi({
    initialPath: `https://static.bychef.am/docs/terms/${locale}_latest.html`
  });

  if (response && !response.error) {
    const html = await response.result.text();

    return html as TrustedHTML;
  } else {
    console.log(response?.error);
    return "";
  }
};

const TermsConditions = () => {
  const { i18n } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["terms", i18n.language],
    queryFn: () => fetchTermsContent(i18n.language.split("-")[0] as LOCALES),
    refetchOnWindowFocus: false,
  });

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