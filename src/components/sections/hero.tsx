import { useContext } from "react";
import { db } from "@/db";
import Button from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MapDialog from "@/components/sections/map-dialog";
import AddressSearch from "@/components/sections/address-search";
import { AddressSearchContext } from "@/context/address-search-context";

const HeroTemp = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("translation");
  const { selectedAddress } = useContext(AddressSearchContext);

  const handleApplyAddress = async (callback?: () => void) => {
    if (selectedAddress) {
      await db.location.put({
        id: "1",
        address: selectedAddress.address,
        coordinates: { lat: selectedAddress.location[0], lng: selectedAddress.location[1] },
      }, "1");

      if (callback) callback();

      if (window.location.pathname === "/") {
        navigate("/explore");
      }
    }
  };

  return (
    <section className="hero relative">
      <img src="https://static.bychef.am/landing/hero.webp" alt="hero image" className="object-cover w-full h-[718px]"/>
      <div className="absolute w-full max-w-[560px] px-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white flex flex-col items-center pl-8 p-6 gap-3">
          <h1 className="text-2xl font-extrabold">{t("home-page.address.select-address")}</h1>
          <div className="flex gap-2 w-full">
            <AddressSearch onApplyAddress={handleApplyAddress} />
          </div>
          <div className="flex justify-center w-full">
            <MapDialog
              onApplyAddress={handleApplyAddress}
              trigger={
                <Button>{t("home-page.address.find-with-map")}</Button>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroTemp;