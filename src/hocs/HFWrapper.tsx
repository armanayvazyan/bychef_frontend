import { PropsWithChildren } from "react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

const HFWrapper = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default HFWrapper;