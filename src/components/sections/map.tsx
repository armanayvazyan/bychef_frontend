import { ReactNode, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Map as YMap, useYMaps, YMaps } from "@pbe/react-yandex-maps";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Map = ({ trigger }: { trigger: ReactNode }) => {
  const ymaps = useYMaps(["Map"]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [address, setAddress] = useState("");

  const handleSearchAddress = async () => {
    const key = import.meta.env.VITE_YMAP_KEY as string;
    const url = new URL("https://suggest-maps.yandex.ru/v1/suggest");
    url.searchParams.set("apikey", key);
    url.searchParams.set("text", inputValue);
    url.searchParams.set("results", "5");
    url.searchParams.set("lang", "en_AM");
    url.searchParams.set("ll", "44.491567,40.153759");
    url.searchParams.set("spn", "0.473785400390625,0.7407931148263032");

    const res = await fetch(url);

    console.log(res);
  };

  const getGeoLocation = async (e: any) => {
    if (ymaps) {
      const coord = e.get("target").getCenter() as number[];
      const response = await ymaps.geocode(coord);
      // @ts-expect-error remove error
      const currentAddress = response.geoObjects.get(0).getAddressLine() as string;

      if (currentAddress) {
        setAddress(currentAddress);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent
        className="rounded-lg"
        closeIcon={
          <X size={24}/>
        }
      >
        <DialogTitle>Մուտքագրեք Ձեր հասցեն</DialogTitle>
        <div>
          {address}
          <div className="flex w-full gap-2 items-center mb-6">
            <Input
              type="text"
              ref={inputRef}
              value={inputValue}
              placeholder="Մուտքագրեք հասցեն"
              className="flex-1"
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
            <Button type="submit" onClick={handleSearchAddress}>Փնտրել</Button>
          </div>
          <div className="relative w-full h-[500px]">
            <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-30">
              <MapPin width={30} height={30} color="red"/>
            </div>
            <YMap
              defaultState={{
                center: [40.188508, 44.516095],
                zoom: 17
              }}
              className="w-full h-full"
              onBoundsChange={getGeoLocation}
              modules={["geolocation", "geocode"]}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const YMapWrappedMap = ({ trigger }: { trigger: ReactNode }) => {
  return (
    <YMaps query={{ lang: "en_US", apikey: import.meta.env.VITE_YMAP_KEY }}>
      <Map trigger={trigger} />
    </YMaps>
  );
};

export default YMapWrappedMap;