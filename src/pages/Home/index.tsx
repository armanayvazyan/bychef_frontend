import Faq from "@/components/sections/faq";
import Hero from "@/components/sections/hero";
import FoodSafety from "@/components/sections/food-safety";
import AboutSection from "@/components/sections/about-section";
import Illustrations from "@/components/sections/illustrations";
import ImageCollection from "@/components/sections/image-collection";
import ForPartners from "@/components/sections/for-partners";
import { useEffect } from "react";
import { logPageOpenEvent } from "@/analytics/Events";

const Home = () => {
  useEffect(() => {
    logPageOpenEvent();
  }, []);
  return (
    <>
      <Hero />
      <Illustrations />
      <AboutSection />
      <ImageCollection />
      <FoodSafety />
      <ForPartners />
      <Faq />
    </>
  );
};

export default Home;