import { PropsWithChildren, useEffect } from "react";
import AnalyticsManager from "@/analytics/AnalyticsManager";

const AnalyticsWrapper = ({ children }: PropsWithChildren) => {

  useEffect(() => {
    AnalyticsManager.initialize();
  }, []);

  return (
    children
  );
};

export default AnalyticsWrapper;