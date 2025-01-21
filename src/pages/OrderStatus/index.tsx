import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IDRAM_ORDER_ID_PREFIX } from "@/configs/constants";

const OrderStatus = ({ type }: { type: "success" | "failure" }) => {
  const navigate = useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const orderId = urlParams.get(IDRAM_ORDER_ID_PREFIX as string);

  const { t } = useTranslation("translation", { keyPrefix: "order-status" });

  const handleNavigateExplore = () => { navigate("/explore"); };

  return (
    <section data-state={type} className="group flex-auto w-full flex flex-col gap-4 justify-center items-center px-8">
      <div className="text-center flex flex-col gap-4 items-center justify-center max-w-[483px] w-full">
        <div className="bg-destructive group-data-[state='success']:bg-success w-[64px] h-[64px] rounded-full relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {type === "success" ? (
              <img className="scale-[2]" src="https://static.bychef.am/icons/success.svg" alt="successful order icon" />
            ) : (
              <img className="scale-[2]" src="https://static.bychef.am/icons/failed.svg" alt="rejected order icon" />
            )}
          </div>
        </div>
        <h1 className="text-xl">{t(type === "success" ? "success.title" : "failure.title")}</h1>
        <p className="text-sm">{t(type === "success" ? "success.details" : "failure.details", { orderId })}</p>
      </div>
      <Button variant="secondary" onClick={handleNavigateExplore}>
        {t(type === "success" ? "success.button" : "failure.button")}
      </Button>
    </section>
  );
};

export default OrderStatus;