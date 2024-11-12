import hero from "@/assets/explore-hero.png";
import ExploreChefs from "@/components/sections/explore-chefs";

const Explore = () => {
  return (
    <section>
      <img src={hero} alt="hero" className="w-full" />
      <ExploreChefs />
    </section>
  );
};

export default Explore;