import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const PartnersSeo: React.FC = () => {
  const { t, i18n } = useTranslation("translation", { keyPrefix: "partners-page" });
  const currentLang = i18n.language;

  // Create structured data for Schema.org
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t("seo.title"),
    "description": t("seo.description"),
    "provider": {
      "@type": "Organization",
      "name": "byChef",
      "url": "https://bychef.am",
      "logo": "https://static.bychef.am/landing/about-us.jpg"
    },
    "serviceType": "Food Delivery Platform",
    "areaServed": {
      "@type": "Country",
      "name": "Armenia"
    },
    "potentialAction": {
      "@type": "CommunicateAction",
      "name": t("contact.btn"),
      "target": "tel:+37477916666"
    }
  };

  return (
    <Helmet>
      <title>{t("seo.title")}</title>
      <meta name="description" content={t("seo.description")} />
      <meta name="keywords" content={t("seo.keywords")} />

      {/* Open Graph tags for social sharing */}
      <meta property="og:title" content={t("seo.title")} />
      <meta property="og:description" content={t("seo.description")} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://bychef.am/partners" />
      <meta property="og:image" content="https://static.bychef.am/landing/about-us.jpg" />
      <meta property="og:site_name" content="byChef" />
      <meta property="og:locale" content={currentLang === "hy" ? "hy_AM" : currentLang === "ru" ? "ru_RU" : "en_US"} />

      {/* Twitter Card data */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t("seo.title")} />
      <meta name="twitter:description" content={t("seo.description")} />
      <meta name="twitter:image" content="https://static.bychef.am/landing/about-us.jpg" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://bychef.am/partners" />

      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default PartnersSeo;