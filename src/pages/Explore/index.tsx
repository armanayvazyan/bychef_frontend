import ExploreChefs from "@/components/sections/explore-chefs";
import { useEffect } from "react";
import { logPageOpenEvent } from "@/analytics/Events";
import { db } from "@/db";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logPageOpenEvent();
  }, []);

  useEffect(() => {
    (async () => {
      const location = await db.location.toArray();

      if (!location.length) navigate("/");
    })();
  }, [navigate]);

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