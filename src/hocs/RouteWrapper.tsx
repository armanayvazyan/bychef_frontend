import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { RouterProvider, Navigate, createBrowserRouter } from "react-router-dom";

import Home from "@/pages/Home";
import HFWrapper from "@/hocs/HFWrapper";

import ScrollResetWrapper from "@/hocs/ScrollResetWrapper.tsx";

const wrapComponentWithHF = (component: ReactNode, name?: string) => {
  return (
    <HFWrapper>
      <ScrollResetWrapper>
        <Helmet>
          <title>{name ? `ByChef | ${name}` : "ByChef"}</title>
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
    path: "*",
    element: <Navigate to="/" replace/>
  }
];

const RouteWrapper = () => {
  return (
    <RouterProvider router={createBrowserRouter(routes)}/>
  );
};

export default RouteWrapper;