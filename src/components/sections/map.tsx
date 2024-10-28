import { YMaps, Map as Mapp } from "@pbe/react-yandex-maps";

const Map = () => {
  return (
    <YMaps query={{ lang: "en_US" }}>
      <div>My awesome application with maps!</div>
      <Mapp defaultState={{ center: [55.75, 37.57], zoom: 9 }} />
    </YMaps>
  );
};

export default Map;