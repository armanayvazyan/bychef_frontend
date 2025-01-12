import { ReactNode } from "react";
import Home from "@/pages/Home";
import Chef from "@/pages/Chef";
import Explore from "@/pages/Explore";
import Checkout from "@/pages/Checkout";
import HFWrapper from "@/hocs/HFWrapper";
import { Helmet } from "react-helmet-async";
import OrderStatus from "@/pages/OrderStatus";
import AnalyticsWrapper from "@/hocs/AnalyticsWrapper";
import ScrollResetWrapper from "@/hocs/ScrollResetWrapper";
import NotificationsWrapper from "@/hocs/NotificationsWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, Navigate, createBrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

const wrapComponentWithHF = (component: ReactNode, name?: string) => {
  return (
    <ScrollResetWrapper>
      <NotificationsWrapper>
        <AnalyticsWrapper>
          <QueryClientProvider client={queryClient}>
            <HFWrapper>
              <Helmet>
                <title>{name ? `byChef | ${name}` : "byChef"}</title>
              </Helmet>
              {component}
            </HFWrapper>
          </QueryClientProvider>
        </AnalyticsWrapper>
      </NotificationsWrapper>
    </ScrollResetWrapper>
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