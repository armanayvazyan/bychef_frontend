import { useEffect } from "react";
import { logPageOpenEvent } from "@/analytics/Events";
import BusinessPromo from "@/components/sections/business-promo";
import WhyByChef from "@/components/sections/why-bychef";
import JoinSteps from "@/components/sections/join-steps";
import PartnersFaq from "@/components/sections/partners-faq";
import ContactCta from "@/components/sections/contact-cta";
import PartnersSeo from "@/components/sections/partners-seo";

const PartnersLanding = () => {
  useEffect(() => {
    logPageOpenEvent();
  }, []);

  return (
    <>
      <PartnersSeo />
      <main aria-labelledby="partners-page-title">
        <BusinessPromo />
        <WhyByChef />
        <JoinSteps />
        <PartnersFaq />
        <ContactCta />
      </main>
    </>
  );
};

export default PartnersLanding;