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
import PageTrackWrapper from "@/hocs/PageTrackWrapper";
import AnalyticsWrapper from "@/hocs/AnalyticsWrapper";
import RouteGuardWrapper from "@/hocs/RouteGuardWrapper";
import ScrollResetWrapper from "@/hocs/ScrollResetWrapper";
import NotificationsWrapper from "@/hocs/NotificationsWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddressSearchContextProvider from "@/context/address-search-context";
import { RouterProvider, Navigate, createBrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

const providerWrapper = (component: ReactNode, name: string) => {
  return (
    <RouteGuardWrapper name={name}>
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
    </RouteGuardWrapper>
  );
};

export const routes = [
  {
    path: "/",
    name: "home",
    element: providerWrapper(<Home />, "home"),
  },
  {
    path: "/explore",
    name: "explore",
    element: providerWrapper(<Explore />, "explore")
  },
  {
    path: "/chef/:id",
    name: "kitchen",
    element: providerWrapper(<Chef />, "kitchen")
  },
  {
    path: "/checkout",
    name: "checkout",
    element: providerWrapper(<Checkout />, "checkout")
  },
  {
    path: "/orders/success",
    name: "order_success",
    element: providerWrapper(<OrderStatus type="success" />, "order_success")
  },
  {
    path: "/orders/failed",
    name: "order_failed",
    element: providerWrapper(<OrderStatus type="failure" />, "order_failed")
  },
  {
    path: "/privacy",
    name: "privacy",
    element: providerWrapper(<PrivacyPolicy />, "privacy")
  },
  {
    path: "/terms",
    name: "terms",
    element: providerWrapper(<TermsConditions />, "terms")
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