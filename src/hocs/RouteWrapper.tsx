import { ReactNode } from "react";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import HFWrapper from "@/hocs/HFWrapper";
import { Helmet } from "react-helmet-async";
import ScrollResetWrapper from "@/hocs/ScrollResetWrapper.tsx";
import { RouterProvider, Navigate, createBrowserRouter } from "react-router-dom";

const wrapComponentWithHF = (component: ReactNode, name?: string) => {
  return (
    <HFWrapper>
      <ScrollResetWrapper>
        <Helmet>
          <title>{name ? `byChef | ${name}` : "byChef"}</title>
        </Helmet>
        {component}
      </ScrollResetWrapper>
    </HFWrapper>
  );
};

const routes = [
  {
    path: "/",
    element: wrapComponentWithHF(<Home />),
  },
  {
    path: "/explore",
    element: wrapComponentWithHF(<Explore />)
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  },
];

const RouteWrapper = () => {
  return (
    <RouterProvider router={createBrowserRouter(routes)}/>
  );
};

export default RouteWrapper;