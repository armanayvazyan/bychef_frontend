import Faq from "@/components/sections/faq";
import Hero from "@/components/sections/hero";
import FoodSafety from "@/components/sections/food-safety";
import AboutSection from "@/components/sections/about-section";
import Illustrations from "@/components/sections/illustrations";
import ImageCollection from "@/components/sections/image-collection";
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
      <Faq />
    </>
  );
};

export default Home;