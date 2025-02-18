import { useContext, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { Map as YMap, useYMaps } from "@pbe/react-yandex-maps";
import { AddressSearchContext } from "@/context/address-search-context";

const Map = () => {
  const ymaps = useYMaps(["Map"]);
  const mapRef = useRef<ymaps.Map | null>(null);
  const { selectedAddress, onSelectAddress, isUserInteracting, onSetIsUserInteracting } = useContext(AddressSearchContext);

  const getGeoLocation = async (e: any) => {
    if (ymaps && isUserInteracting) {
      const coord = e.get("target").getCenter() as number[];
      const response = await ymaps.geocode(coord);
      // @ts-expect-error remove error
      const currentAddress = response.geoObjects.get(0).getAddressLine() as string;

      if (currentAddress) {
        onSelectAddress({ address: currentAddress, location: coord });
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (selectedAddress && !isUserInteracting && mapRef.current) {
        await mapRef.current.setCenter(selectedAddress.location, 17);
        onSetIsUserInteracting(true);
      }
    })();
  }, [isUserInteracting, onSetIsUserInteracting, selectedAddress]);

  return (
    <div className="relative w-full h-[500px]">
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-30">
        <MapPin width={30} height={30} color="red"/>
      </div>
      <YMap
        instanceRef={(ref) => { mapRef.current = ref; }}
        defaultState={{
          center: [40.188508, 44.516095],
          zoom: 17
        }}
        className="w-full h-full"
        onBoundsChange={getGeoLocation}
        modules={["geolocation", "geocode"]}
        onActionBegin={() => { onSetIsUserInteracting(true); }}
      />
    </div>
  );
};

export default Map;