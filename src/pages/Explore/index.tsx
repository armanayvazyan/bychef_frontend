import { useEffect } from "react";
import { logPageOpenEvent } from "@/analytics/Events";
import LazyImage from "@/components/sections/lazy-image";
import ExploreChefs from "@/components/sections/explore-chefs";

const Explore = () => {
  useEffect(() => {
    logPageOpenEvent();
  }, []);

  return (
    <section>
      <LazyImage
        alt="hero"
        imgClassName="w-full h-full object-cover"
        containerClassName="h-[220px] md:h-[282px]"
        url="https://static.bychef.am/explore_banner.webp"
      />
      <ExploreChefs />
    </section>
  );
};

export default Explore;