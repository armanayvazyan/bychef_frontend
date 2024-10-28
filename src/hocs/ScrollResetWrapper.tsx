import { PropsWithChildren, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollResetWrapper = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    });
  }, [pathname]);

  return (
    children
  );
};

export default ScrollResetWrapper;