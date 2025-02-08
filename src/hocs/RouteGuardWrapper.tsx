import { PropsWithChildren, useEffect } from "react";
import { db } from "@/db";
import { useNavigate } from "react-router-dom";

interface IRouteGuardWrapperProps extends PropsWithChildren {
  name: string;
}

const RouteGuardWrapper = ({ name, children }: IRouteGuardWrapperProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const location = await db.location.toArray();

      if (!location.length && name !== "home") navigate("/");
    })();
  }, [name, navigate]);

  return children;
};

export default RouteGuardWrapper;