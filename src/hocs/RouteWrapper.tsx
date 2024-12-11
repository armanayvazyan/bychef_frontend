import { ReactNode } from "react";
import Home from "@/pages/Home";
import Chef from "@/pages/Chef";
import Explore from "@/pages/Explore";
import Checkout from "@/pages/Checkout";
import HFWrapper from "@/hocs/HFWrapper";
import { Helmet } from "react-helmet-async";
import OrderStatus from "@/pages/OrderStatus";
import ScrollResetWrapper from "@/hocs/ScrollResetWrapper";
import { RouterProvider, Navigate, createBrowserRouter } from "react-router-dom";
import AnalyticsWrapper from "@/hocs/AnalyticsWrapper";
import NotificationsWrapper from "@/hocs/NotificationsWrapper";

const wrapComponentWithHF = (component: ReactNode, name?: string) => {
  return (
    <HFWrapper>
      <NotificationsWrapper>
        <AnalyticsWrapper>
          <ScrollResetWrapper>
            <Helmet>
              <title>{name ? `byChef | ${name}` : "byChef"}</title>
            </Helmet>
            {component}
          </ScrollResetWrapper>
        </AnalyticsWrapper>
      </NotificationsWrapper>
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
    path: "/chef/:id",
    element: wrapComponentWithHF(<Chef />)
  },
  {
    path: "/checkout",
    element: wrapComponentWithHF(<Checkout />)
  },
  {
    path: "/order/success",
    element: wrapComponentWithHF(<OrderStatus type="success" />)
  },
  {
    path: "/order/failed",
    element: wrapComponentWithHF(<OrderStatus type="failure" />)
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