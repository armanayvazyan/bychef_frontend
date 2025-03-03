import { fetchApi } from "@/hooks/use-fetch-data";
import { IFetchChefsProps, IPlaceOrderProps } from "@/server-actions/types";
import constructFinalUrl from "@/helpers/constructFinalUrl";
import { CHEFS_PER_PAGE_COUNT, YMAP_KEY, YMAP_SEARCH_RESULTS_COUNT } from "@/configs/constants";
import { IChefAvailabilityExceptionDays, IChefAvailableDates, IChefInfo, IDishInfo, ISuggestion, LOCALES } from "@/types";

export const fetchDeliveryPrice = async (id: number, coordinates: { lat: number; lng: number }, doorToDoorEnabled: boolean, onErrorCb?: (errorKey: string) => void) => {
  const data = await fetchApi(
    {
      initialPath: "order/delivery-price",
      method: "POST",
      bodyParams: {
        chefId: id,
        doorToDoorEnabled,
        userCoordinates: [coordinates.lng, coordinates.lat],
      },
      injectErrorMessage: true,
    }
  );

  if (data.error) {
    if (onErrorCb) onErrorCb(data.error);

    return { result: null, error: data.error };
  }

  return data;
};

export const fetchChefAvailableDates = async (id: number, onErrorCb?: (errorKey: string) => void): Promise<{ chefAvailableDates?: IChefAvailableDates[], chefAvailabilityExceptionDays?: IChefAvailabilityExceptionDays[] }> => {
  const data = await fetchApi(
    {
      initialPath: "chef/",
      pathExtension: String(id),
      injectErrorMessage: true,
    });

  if (data.error) {
    if (onErrorCb) onErrorCb(data.error);

    return {};
  }

  return {
    chefAvailableDates: data.result.chefAvailableDates,
    chefAvailabilityExceptionDays: data.result.chefAvailabilityExceptionDays,
  };
};

export const fetchDish = async (id: string | number, onErrorCb?: (errorKey: string) => void): Promise<IDishInfo | undefined> => {
  const data = await fetchApi(
    {
      initialPath: "dish/",
      pathExtension: String(id),
      injectErrorMessage: true,
    }
  );

  if (data.error) {
    if (onErrorCb) onErrorCb(data.error);

    return;
  }

  return data.result;
};

export const fetchCartItem = async (id: string | number, deleteItemCb?: () => void, onErrorCb?: (errorKey: string) => void) => {
  const data = await fetchApi({
    initialPath: "dish/",
    pathExtension: String(id),
    injectErrorMessage: true,
  });

  if (data && data.status === 403 && deleteItemCb) {
    deleteItemCb();
  }

  if (data.error) {
    if (onErrorCb) onErrorCb(data.error);

    return;
  }

  return data.result as IDishInfo;
};

export const fetchChef = async (id: string, onErrorCb?: (errorKey: string) => void): Promise<IChefInfo | undefined> => {
  const data = await fetchApi(
    {
      initialPath: "chef/",
      pathExtension: id,
      injectErrorMessage: true,
    }
  );

  if (data.error) {
    if (onErrorCb) onErrorCb(data.error);

    return;
  }

  return data.result;
};

export const fetchTermsContent = async (locale: LOCALES) => {
  try {
    const response = await fetch(`https://static.bychef.am/docs/terms/${locale}_latest.html`);

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const html = await response.text();

    return html as TrustedHTML;
  } catch(error) {
    console.log(error);
  }
};

export const fetchPrivacyContent = async (locale: LOCALES) => {
  try {
    const response = await fetch(`https://static.bychef.am/docs/privacy/${locale}_latest.html`);

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const html = await response.text();

    return html as TrustedHTML;
  } catch(error) {
    console.log(error);
  }
};

export const fetchChefs = async ({ pageParam, dateFrom, dateTo, onErrorCb }: IFetchChefsProps) => {
  const url = new URL(constructFinalUrl("chef/active"));

  url.searchParams.append("limit", String(CHEFS_PER_PAGE_COUNT));
  url.searchParams.append("offset", String(pageParam));
  if (dateFrom) url.searchParams.append("dateFrom", dateFrom);
  if (dateTo) url.searchParams.append("dateTo", dateTo);

  const data = await fetchApi(
    {
      initialPath: "chef/active",
      pathExtension: url.search,
      injectErrorMessage: true,
    }
  );

  if (data.error) {
    if (onErrorCb) onErrorCb(data.error);

    return;
  }

  return data.result || {};
};

export const fetchSearchAddressSuggestions = async (search: string, locale: LOCALES): Promise<ISuggestion[] | null> => {
  if (!search) return null;

  const url = new URL("https://geocode-maps.yandex.ru/1.x");
  url.searchParams.set("apikey", YMAP_KEY);
  url.searchParams.set("geocode", search);
  url.searchParams.set("results", YMAP_SEARCH_RESULTS_COUNT);
  url.searchParams.set("lang", `${locale}_AM`);
  url.searchParams.set("format", "json");
  url.searchParams.set("ll", "44.491567,40.153759");
  url.searchParams.set("spn", "0.473785400390625,0.7407931148263032");

  const res = await fetch(url);
  const data = await res.json();

  const collection = [] as { address: string; location: string }[];

  data.response.GeoObjectCollection.featureMember
    .forEach(
      (item: {
        GeoObject: {
          metaDataProperty: { GeocoderMetaData: { text: string } };
          name: string; Point: { pos: string; }; };
      }) => {
        const [country, region] = item.GeoObject.metaDataProperty.GeocoderMetaData.text.split(", ");

        if (country && region)
          collection.push({ address: item.GeoObject.metaDataProperty.GeocoderMetaData.text, location: item.GeoObject.Point.pos });
      }
    );

  return collection;
};

export const placeOrder = async (formData: IPlaceOrderProps, locale: LOCALES, onErrorCb?: (errorKey: string) => void) => {
  const data = await fetchApi(
    {
      initialPath: "order",
      method: "POST",
      headerParams: {
        language: locale,
      },
      bodyParams: formData,
      injectErrorMessage: true,
      isResponseOtherType: true
    }
  );

  if (data.error) {
    if (onErrorCb) onErrorCb(data.error);

    return;
  }

  return data.result || null;
};