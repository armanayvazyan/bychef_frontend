import ExploreChefs from "@/components/sections/explore-chefs";
import { useEffect } from "react";
import { logPageOpenEvent } from "@/analytics/Events";

const Explore = () => {
  useEffect(() => {
    logPageOpenEvent();
  }, []);
  return (
    <section>
      <img
        src="https://static.bychef.am/explore_banner.webp"
        alt="hero"
        className="hidden md:block w-full max-h-[240px] object-cover"
      />
      <ExploreChefs />
    </section>
  );
};

export default Explore;