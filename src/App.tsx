import "@/i18n/config";
import RouteWrapper from "@/hocs/RouteWrapper";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <RouteWrapper />
      <Toaster />
    </HelmetProvider>
  );
}

export default App;
