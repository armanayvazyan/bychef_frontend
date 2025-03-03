import { useCallback, useContext, useEffect, useState } from "react";
import { db } from "@/db";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { EInputNames, ILocation } from "@/types";
import { FormLabel } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { fetchDeliveryPrice } from "@/server-actions";
import MapDialog from "@/components/sections/map-dialog";
import { AddressSearchContext } from "@/context/address-search-context";
import ConfirmationModal from "@/components/sections/confirmation-modal";
import useServerError from "@/hooks/useServerError";

interface ICheckoutAddressFieldContainerProps {
  chefId?: number;
  sessionLocation: ILocation[]
}

const CheckoutAddressField = ({ chefId, sessionLocation }: ICheckoutAddressFieldContainerProps) => {
  const form = useFormContext();
  const navigate = useNavigate();
  const { handleServerError } = useServerError();
  const { selectedAddress } = useContext(AddressSearchContext);
  const { t } = useTranslation("translation", { keyPrefix: "checkout" });

  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const handleSaveAddress = useCallback(async () => {
    if (selectedAddress && chefId) {
      await db.location.put({
        id: "1",
        address: selectedAddress.address,
        coordinates: { lat: selectedAddress.location[0], lng: selectedAddress.location[1] },
      }, "1");
    }
  }, [chefId, selectedAddress]);

  const handleApplyAddress = useCallback(async (callback?: () => void) => {
    if (selectedAddress && chefId) {
      const res = await fetchDeliveryPrice(
        chefId,
        { lat: selectedAddress.location[0], lng: selectedAddress.location[1] },
        false,
      );

      if (res.error) {
        setIsPromptOpen(true);
        handleServerError(res.error);
        return;
      }

      await handleSaveAddress();

      if (callback) callback();
    }
  }, [chefId, handleSaveAddress, handleServerError, selectedAddress]);

  const handleAddressPromptPositiveAction = useCallback(async () => {
    await db.products.clear();
    await handleSaveAddress();
    navigate("/explore");
  }, [handleSaveAddress, navigate]);

  const handleAddressPromptNegativeAction = useCallback(() => {
    setIsPromptOpen(false);
  }, []);

  useEffect(() => {
    if (sessionLocation) {
      form.setValue(EInputNames.address, sessionLocation[0].address);
      form.setValue(EInputNames.coordinates, [sessionLocation[0].coordinates.lat, sessionLocation[0].coordinates.lng]);
    }
  }, [form, sessionLocation]);

  return (
    <>
      <FormLabel className="text-primary font-semibold text-sm leading-tight flex gap-1" htmlFor="address">
        {t("address")}
      </FormLabel>
      <MapDialog
        onApplyAddress={handleApplyAddress}
        trigger={
          <div className="gap-2 flex items-center">
            <MapPin className="shrink-0" />
            <p className="text-sm text-primary underline" id="address">{sessionLocation[0].address}</p>
          </div>
        }
      />
      <ConfirmationModal
        open={isPromptOpen}
        setOpen={setIsPromptOpen}
        positiveAction={handleAddressPromptPositiveAction}
        negativeAction={handleAddressPromptNegativeAction}
        contentKeys={{
          title: "checkout.wrongAddressModal.title",
          description: "checkout.wrongAddressModal.description",
          positiveButtonText: "checkout.wrongAddressModal.positiveButton",
          negativeButtonText: "checkout.wrongAddressModal.negativeButton",
        }}
      />
    </>
  );
};

const CheckoutAddressFieldContainer = ({ chefId, sessionLocation }: ICheckoutAddressFieldContainerProps) => {
  return (
    <CheckoutAddressField chefId={chefId} sessionLocation={sessionLocation} />
  );
};

export default CheckoutAddressFieldContainer;