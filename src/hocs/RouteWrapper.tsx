import { ReactNode } from "react";
import Home from "@/pages/Home";
import Chef from "@/pages/Chef";
import Explore from "@/pages/Explore";
import Checkout from "@/pages/Checkout";
import HFWrapper from "@/hocs/HFWrapper";
import { Helmet } from "react-helmet-async";
import OrderStatus from "@/pages/OrderStatus";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsConditions from "@/pages/TermsConditions";
import AnalyticsWrapper from "@/hocs/AnalyticsWrapper";
import ScrollResetWrapper from "@/hocs/ScrollResetWrapper";
import NotificationsWrapper from "@/hocs/NotificationsWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, Navigate, createBrowserRouter } from "react-router-dom";
import AddressSearchContextProvider from "@/context/address-search-context";
import PageTrackWrapper from "@/hocs/PageTrackWrapper";

const queryClient = new QueryClient();

const wrapComponentWithHF = (component: ReactNode, name?: string) => {
  return (
    <ScrollResetWrapper>
      <NotificationsWrapper>
        <AnalyticsWrapper>
          <PageTrackWrapper>
            <AddressSearchContextProvider>
              <QueryClientProvider client={queryClient}>
                <HFWrapper>
                  <Helmet>
                    <title>{name ? `byChef | ${name}` : "byChef"}</title>
                  </Helmet>
                  {component}
                </HFWrapper>
              </QueryClientProvider>
            </AddressSearchContextProvider>
          </PageTrackWrapper>
        </AnalyticsWrapper>
      </NotificationsWrapper>
    </ScrollResetWrapper>
  );
};

export const routes = [
  {
    path: "/",
    name: "home",
    element: wrapComponentWithHF(<Home />),
  },
  {
    path: "/explore",
    name: "explore",
    element: wrapComponentWithHF(<Explore />)
  },
  {
    path: "/chef/:id",
    name: "kitchen",
    element: wrapComponentWithHF(<Chef />)
  },
  {
    path: "/checkout",
    name: "checkout",
    element: wrapComponentWithHF(<Checkout />)
  },
  {
    path: "/orders/success",
    name: "order_success",
    element: wrapComponentWithHF(<OrderStatus type="success" />)
  },
  {
    path: "/orders/failed",
    name: "order_failed",
    element: wrapComponentWithHF(<OrderStatus type="failure" />)
  },
  {
    path: "/privacy",
    name: "privacy",
    element: wrapComponentWithHF(<PrivacyPolicy />)
  },
  {
    path: "/terms",
    name: "terms",
    element: wrapComponentWithHF(<TermsConditions />)
  },
  {
    path: "*",
    name: "404",
    element: <Navigate to="/" replace />
  },
];

const RouteWrapper = () => {
  return (
    <RouterProvider router={createBrowserRouter(routes)}/>
  );
};

export default RouteWrapper;