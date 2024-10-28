import "@/i18n/config";
import RouteWrapper from "@/hocs/RouteWrapper.tsx";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster.tsx";

function App() {
  return (
    <HelmetProvider>
      <RouteWrapper />
      <Toaster />
    </HelmetProvider>
  );
}

export default App;
