import { ReactNode, useState } from "react";
import { X } from "lucide-react";
import Map from "@/components/sections/map";
import { YMaps } from "@pbe/react-yandex-maps";
import SearchInput from "@/components/sections/address-search";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

const MapDialog = ({ trigger }: { trigger: ReactNode }) => {
  const { t } = useTranslation("translation");

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-xs font-normal text-zinc-600">{trigger}</DialogTrigger>
      <DialogContent
        className="rounded-lg"
        closeIcon={
          <X size={24}/>
        }
      >
        <DialogTitle className="text-center text-xl font-semibold">{t("home-page.address.select-address")}</DialogTitle>
        <div>
          <div className="flex gap-2 items-center mb-6">
            <SearchInput callback={setOpen} />
          </div>
          <YMaps query={{ lang: "en_US", apikey: import.meta.env.VITE_YMAP_KEY }}>
            <Map/>
          </YMaps>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;