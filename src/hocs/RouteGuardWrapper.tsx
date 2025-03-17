import { PropsWithChildren, useEffect } from "react";
import { db } from "@/db";
import { useNavigate } from "react-router-dom";

interface IRouteGuardWrapperProps extends PropsWithChildren {
  name: string;
}

const restrictedRoutes = ["home", "order_success", "order_failed", "privacy", "terms", "tracking"];

const RouteGuardWrapper = ({ name, children }: IRouteGuardWrapperProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const location = await db.location.toArray();

      if (location.length && name === "home") navigate("/explore");

      if (!location.length && !restrictedRoutes.includes(name)) navigate("/");
    })();
  }, [name, navigate]);

  return children;
};

export default RouteGuardWrapper;