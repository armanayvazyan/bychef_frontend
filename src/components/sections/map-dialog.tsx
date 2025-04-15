import { ReactNode, useState } from "react";
import { X } from "lucide-react";
import Map from "@/components/sections/map";
import { YMaps } from "@pbe/react-yandex-maps";
import { useTranslation } from "react-i18next";
import AddressSearch from "@/components/sections/address-search";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { YMAP_KEY } from "@/configs/constants";

interface IMapDialogProps {
  trigger: ReactNode,
  onApplyAddress: (callback?: () => void) => void
}

const MapDialog = ({ trigger, onApplyAddress }: IMapDialogProps) => {
  const { t } = useTranslation("translation");

  const [open, setOpen] = useState(false);

  const handleApplyAddress = (callback?: () => void) => {
    onApplyAddress(() => {
      if (callback) callback();
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-xs font-normal text-zinc-600">{trigger}</DialogTrigger>
      <DialogContent
        closeIcon={
          <X size={24}/>
        }
      >
        <DialogTitle className="text-center text-xl font-semibold">{t("home-page.address.select-address")}</DialogTitle>
        <div>
          <div className="flex gap-2 items-center mb-6">
            <AddressSearch onApplyAddress={handleApplyAddress} />
          </div>
          <YMaps query={{ lang: "en_US", apikey: YMAP_KEY }}>
            <Map/>
          </YMaps>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;