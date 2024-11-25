import { PropsWithChildren, useEffect } from "react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import AnalyticsManager from "@/analytics/AnalyticsManager";

const HFWrapper = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    AnalyticsManager.initialize();
  }, []);
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default HFWrapper;