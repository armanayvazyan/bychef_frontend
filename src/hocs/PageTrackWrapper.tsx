import { PropsWithChildren, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { routes } from "@/hocs/RouteWrapper";
import { match as pathMatch } from "path-to-regexp";

const PageTrackWrapper = ({ children }: PropsWithChildren) => {
    const location = useLocation();
    const [previousPath, setPreviousPath] = useState("direct");
    useEffect(() => {

        const currentRoute = routes.find((route) => {
            const matcher = pathMatch(route.path, { decode: decodeURIComponent });
            return matcher(location.pathname) !== false;
        });

        if (currentRoute?.name) {
            sessionStorage.setItem("previousPage", previousPath);
            sessionStorage.setItem("currentPage", currentRoute.name);
            if (currentRoute.name === "kitchen") {
                const matcher = pathMatch("/chef/:id", { decode: decodeURIComponent });
                const matchResult = matcher(location.pathname);

                if (matchResult && matchResult.params.id) {
                    sessionStorage.setItem("currentChefId", matchResult.params.id as string);
                }
            }
            setPreviousPath(currentRoute.name);
        }
    }, [location, previousPath]);

    return <>{children}</>;
};

export default PageTrackWrapper;