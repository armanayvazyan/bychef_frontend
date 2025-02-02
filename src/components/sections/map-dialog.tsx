import { ReactNode } from "react";
import { X } from "lucide-react";
import Map from "@/components/sections/map";
import { YMaps } from "@pbe/react-yandex-maps";
import SearchInput from "@/components/sections/address-search";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const MapDialog = ({ trigger }: { trigger: ReactNode }) => {
  return (
    <Dialog>
      <div className="flex justify-start w-full">
        <DialogTrigger className="[&_button]:px-0 text-xs font-normal text-zinc-600">{trigger}</DialogTrigger>
      </div>
      <DialogContent
        className="rounded-lg"
        closeIcon={
          <X size={24}/>
        }
      >
        <DialogTitle className="text-center text-xl font-semibold">Մուտքագրեք Ձեր հասցեն</DialogTitle>
        <div>
          <div className="flex gap-2 items-center mb-6">
            <SearchInput/>
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