import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import CryptoPaymentPage from "./pages/CryptoPaymentPage";
import MarketAdmin from "./pages/MarketAdmin";
import MarketDashboard from "./pages/MarketDashboard";
import MarketLanding from "./pages/MarketLanding";

export type Page = "landing" | "catalog" | "tryon" | "pricing";
export type Route = "landing" | "dashboard" | "admin" | "payment";

function getRoute(): Route {
  const hash = window.location.hash;
  if (hash === "#admin") return "admin";
  if (hash === "#dashboard") return "dashboard";
  if (hash === "#payment") return "payment";
  return "landing";
}

export default function App() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (r: Route) => {
    window.location.hash = r === "landing" ? "" : r;
    setRoute(r);
  };

  return (
    <>
      {route === "admin" && <MarketAdmin navigate={navigate} />}
      {route === "dashboard" && <MarketDashboard navigate={navigate} />}
      {route === "landing" && <MarketLanding navigate={navigate} />}
      {route === "payment" && <CryptoPaymentPage navigate={navigate} />}
      <Toaster richColors position="top-center" />
    </>
  );
}
