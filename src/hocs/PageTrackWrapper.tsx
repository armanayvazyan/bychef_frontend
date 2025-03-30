import { PropsWithChildren, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { routes } from "@/hocs/RouteWrapper";
import { match as pathMatch } from "path-to-regexp";

const PageTrackWrapper = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const previousPathRef = useRef<string>("direct"); // Ref for tracking the previous page synchronously

  useEffect(() => {
    const currentRoute = routes.find((route) => {
      const matcher = pathMatch(route.path, { decode: decodeURIComponent });
      return matcher(location.pathname) !== false;
    });

    if (currentRoute?.name) {
      sessionStorage.setItem("previousPage", previousPathRef.current);
      sessionStorage.setItem("currentPage", currentRoute.name);
      if (currentRoute.name === "kitchen") {
        const matcher = pathMatch("/chef/:id", { decode: decodeURIComponent });
        const matchResult = matcher(location.pathname);

        if (matchResult && matchResult.params.id) {
          sessionStorage.setItem("currentChefId", matchResult.params.id as string);
        }
      }
      previousPathRef.current = currentRoute.name;
    }
  }, [location]);

  return <>{children}</>;
};

export default PageTrackWrapper;