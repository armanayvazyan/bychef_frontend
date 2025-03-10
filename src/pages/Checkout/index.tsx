import { useEffect } from "react";
import { logPageOpenEvent } from "@/analytics/Events";
import OrderCheckout from "@/components/sections/order-checkout";

const Checkout = () => {
  useEffect(() => {
    logPageOpenEvent();
  }, []);

  return (
    <section className="pt-9 px-4">
      <OrderCheckout />
    </section>
  );
};

export default Checkout;