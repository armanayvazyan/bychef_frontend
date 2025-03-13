import { PropsWithChildren } from "react";
import Home from "@/pages/Home";
import Chef from "@/pages/Chef";
import Explore from "@/pages/Explore";
import Checkout from "@/pages/Checkout";
import Tracking from "@/pages/Tracking";
import HFWrapper from "@/hocs/HFWrapper";
import { Helmet } from "react-helmet-async";
import OrderStatus from "@/pages/OrderStatus";
import { useTranslation } from "react-i18next";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsConditions from "@/pages/TermsConditions";
import PageTrackWrapper from "@/hocs/PageTrackWrapper";
import AnalyticsWrapper from "@/hocs/AnalyticsWrapper";
import RouteGuardWrapper from "@/hocs/RouteGuardWrapper";
import ScrollResetWrapper from "@/hocs/ScrollResetWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddressSearchContextProvider from "@/context/address-search-context";
import { RouterProvider, Navigate, createBrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

const ProviderWrapper = ({ children, name }: PropsWithChildren & { name: string }) => {
  const { t } = useTranslation("translation", { keyPrefix: "generic" });

  return (
    <RouteGuardWrapper name={name}>
      <ScrollResetWrapper>
        {/* <NotificationsWrapper> */}
          <AnalyticsWrapper>
            <PageTrackWrapper>
              <AddressSearchContextProvider>
                <QueryClientProvider client={queryClient}>
                  <HFWrapper>
                    <Helmet>
                      <title>{name ? `byChef | ${t(name)}` : "byChef"}</title>
                    </Helmet>
                    {children}
                  </HFWrapper>
                </QueryClientProvider>
              </AddressSearchContextProvider>
            </PageTrackWrapper>
          </AnalyticsWrapper>
        {/* </NotificationsWrapper> */}
      </ScrollResetWrapper>
    </RouteGuardWrapper>
  );
};

export const routes = [
  {
    path: "/",
    name: "home",
    element: <ProviderWrapper name="home"><Home /></ProviderWrapper>
  },
  {
    path: "/explore",
    name: "explore",
    element: <ProviderWrapper name="explore"><Explore /></ProviderWrapper>
  },
  {
    path: "/chef/:id",
    name: "kitchen",
    element: <ProviderWrapper name="kitchen"><Chef /></ProviderWrapper>
  },
  {
    path: "/checkout",
    name: "checkout",
    element: <ProviderWrapper name="checkout"><Checkout /></ProviderWrapper>
  },
  {
    path: "/orders/success",
    name: "order_success",
    element: <ProviderWrapper name="order_success"><OrderStatus type="success" /></ProviderWrapper>
  },
  {
    path: "/orders/failed",
    name: "order_failed",
    element: <ProviderWrapper name="order_failed"><OrderStatus type="failure" /></ProviderWrapper>
  },
  {
    path: "/privacy",
    name: "privacy",
    element: <ProviderWrapper name="privacy"><PrivacyPolicy /></ProviderWrapper>
  },
  {
    path: "/terms",
    name: "terms",
    element: <ProviderWrapper name="terms"><TermsConditions /></ProviderWrapper>
  },
  {
    path: "/order/:id",
    name: "order-tracking",
    element: <ProviderWrapper name="tracking"><Tracking /></ProviderWrapper>
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