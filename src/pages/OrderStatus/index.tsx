import { IDRAM_ORDER_ID_PREFIX } from "@/configs/constants";

const OrderStatus = ({ type }: { type: "success" | "failure" }) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const orderId = urlParams.get(IDRAM_ORDER_ID_PREFIX as string);

  return (
    <section className="flex-auto w-full flex justify-center items-center">
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-3xl">{type === "success" ? "Hooray!" : "Oops!"}</h1>
        <p className="text-3xl">{type === "success" ? "Your order has been placed successfully" : "Something went wrong with your order"}</p>
        <p className="text-3xl">Order id: {orderId}</p>
      </div>
    </section>
  );
};

export default OrderStatus;