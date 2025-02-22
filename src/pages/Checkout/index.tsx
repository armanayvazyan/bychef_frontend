import { useEffect } from "react";
import { logPageOpenEvent } from "@/analytics/Events";
import OrderDetails from "@/components/sections/order-details";

const Checkout = () => {
  useEffect(() => {
    logPageOpenEvent();
  }, []);

  return (
    <section className="pt-9 px-4">
      <OrderDetails />
    </section>
  );
};

export default Checkout;