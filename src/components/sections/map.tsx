import { MapPin } from "lucide-react";
import { Map as YMap, useYMaps } from "@pbe/react-yandex-maps";
import { useContext } from "react";
import { AddressSearchContext } from "@/context/address-search-context";

const Map = () => {
  const ymaps = useYMaps(["Map"]);
  const { onSelectAddress } = useContext(AddressSearchContext);

  const getGeoLocation = async (e: any) => {
    if (ymaps) {
      const coord = e.get("target").getCenter() as number[];
      const response = await ymaps.geocode(coord);
      // @ts-expect-error remove error
      const currentAddress = response.geoObjects.get(0).getAddressLine() as string;

      if (currentAddress) {
        onSelectAddress(currentAddress);
      }
    }
  };

  return (
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
  );
};

export default Map;