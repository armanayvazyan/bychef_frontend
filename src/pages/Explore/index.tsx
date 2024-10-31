import hero from "@/assets/explore-hero.png";
import ExploreChefs from "@/components/sections/explore-chefs.tsx";

const Explore = () => {
  return (
    <>
      <img src={hero} alt="hero" className="w-full" />
      <ExploreChefs />
    </>
  );
};

export default Explore;