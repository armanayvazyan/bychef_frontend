import Faq from "@/components/sections/faq";
import HeroMap from "@/components/sections/hero-map";
import FoodSafety from "@/components/sections/food-safety";
import AboutSection from "@/components/sections/about-section";
import Illustrations from "@/components/sections/illustrations";
import ImageCollection from "@/components/sections/image-collection";

const Home = () => {
  return (
    <>
      <HeroMap />
      <Illustrations />
      <AboutSection />
      <ImageCollection />
      <FoodSafety />
      <Faq />
    </>
  );
};

export default Home;